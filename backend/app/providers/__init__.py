import re
from datetime import datetime
from functools import lru_cache

import requests
from app.providers.arl import get_all_arl_stations
from app.providers.bts import get_all_bts_stations
from app.providers.mrt import get_all_mrt_stations
from app.providers.srt import get_all_srt_stations
from bs4 import BeautifulSoup


@lru_cache
def get_all_lines():
    all_lines = []

    get_all_bts_stations(all_lines)
    get_all_mrt_stations(all_lines)
    get_all_arl_stations(all_lines)
    get_all_srt_stations(all_lines)

    return all_lines


def get_connections(key: str):
    connections = [
        ["N17", "PK16"],
        ["N9", "BL14"],
        ["N8", "BL13"],
        ["N2", "A8"],
        ["E4", "BL22"],
        ["E15", "YL23"],
        ["S2", "BL26"],
        ["S12", "BL34"],
        ["BL10", "PP16"],
        ["BL11", "RW01"],
        ["BL11", "RN01"],
        ["BL15", "YL01"],
        ["BL21", "A6"],
        ["PP11", "PK01"],
        ["PP15", "RW02"],
        ["YL11", "A4"],
        ["PK14", "RN06"],
    ]
    connections.extend(list(map(lambda x: [x[1], x[0]], connections)))

    valid = []
    lines = get_all_lines()

    for con in connections:
        if con[0] == key:
            for line in lines:
                for station in line["stations"]:
                    if con[1] == station["code"]:
                        valid.append(station)

    return valid


def get_station_info(key: str):
    lines = get_all_lines()

    for line in lines:
        for station in line["stations"]:
            if key == station["code"]:
                return station


def calculate_bts_mrt(origin_station, dest_station):
    response = requests.post(
        "https://www.ebm.co.th/mobapi-routemap/api/RouteMap/getRouteSuperUltimateStation",
        params={"lang": "th"},
        headers={
            "Origin": "https://www.bts.co.th",
            "Referer": "https://www.bts.co.th/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
        json={
            "Destination": dest_station["station_id"],
            "Destination_Location": 0,
            "Origin": origin_station["station_id"],
            "Origin_Location": 0,
        },
    ).json()

    routes = sorted(response["data"]["RoutesMap"], key=lambda x: x["TotalTime"])[0]
    travel_list = []

    line_steps = routes["LineStep"]
    line_change = routes["LineChange"]

    is_mrt = any(x["TypeChange"] == "MRT" for x in line_change)
    mrts = []
    latest_mrt = False

    price = routes["FareRate_Total"]

    for line_step in line_steps:
        journey = list(
            filter(
                lambda x: x["Station"]["StationLineId"] == line_step,
                routes["RoutesJorney"],
            )
        )

        if latest_mrt:
            con_end = list(
                filter(
                    lambda x: x["line_name"] in ["Blue Line", "Purple Line"],
                    get_connections(journey[0]["StationCode"]),
                )
            )

            latest_mrt = False
            mrt_station_end = get_station_info(con_end[0]["code"])
            travel_list.append(mrt_station_end)
            mrts.append(mrt_station_end)

        for j in [journey[0], journey[-1]]:
            travel_list.append(get_station_info(j["StationCode"]))

            if (
                any(
                    x["TypeChange"] == "MRT"
                    for x in line_change
                    if x["LineID_Start"] == line_step
                )
                and j["IsMRT"]
            ):
                con_end = list(
                    filter(
                        lambda x: x["line_name"] in ["Blue Line", "Purple Line"],
                        get_connections(j["StationCode"]),
                    )
                )

                mrt_station_start = get_station_info(con_end[0]["code"])
                latest_mrt = True

                travel_list.append(mrt_station_start)
                mrts.append(mrt_station_start)

    if is_mrt:
        mrt_res = requests.get(
            "https://metro.bemplc.co.th/Fare-Calculation-Submit.aspx",
            params={
                "s1": "|".join([mrts[0]["code"], mrts[0]["station_id"]]),
                "s2": "|".join([mrts[-1]["code"], mrts[-1]["station_id"]]),
                "t": "1",
                "d": str(datetime.now().strftime("%d-%m-%Y")),
                "h": f"{datetime.now().hour:02d}",
                "m": f"{datetime.now().minute:02d}",
                "b": "2",
            },
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                "Referer": "https://metro.bemplc.co.th/Fare-Calculation",
            },
        )

        url = "https://metro.bemplc.co.th/" + re.search(
            r"URL=(.*)'", mrt_res.text
        ).group(1)

        res = requests.get(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                "Referer": mrt_res.url,
            },
        )

        soup = BeautifulSoup(res.text, "html.parser")

        fare = int(
            soup.find("div", class_="transitTableWrapper")
            .find("table", class_=re.compile(r"transitResultTable.*"))
            .find("tbody")
            .find("tr")
            .find_all("td")[1]
            .getText()
            .split(" ")[0]
        )

        price += fare

    if travel_list[-1]["code"] != dest_station["code"]:
        travel_list.append(dest_station)

    return travel_list, price
