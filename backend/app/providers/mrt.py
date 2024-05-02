import re
from datetime import datetime

import requests
from bs4 import BeautifulSoup


def get_all_mrt_stations(all_lines: list):
    response = requests.get(
        "https://metro.bemplc.co.th/Fare-Calculation",
        params={"lang": "th"},
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
    )

    soup = BeautifulSoup(response.text, "html.parser")

    origin = soup.find("div", id="SelectStationFrom").find_all(
        "div", class_="stationList"
    )
    origin_title = soup.find("div", id="SelectStationFrom").find_all("h3")

    response = requests.get(
        "https://metro.bemplc.co.th/Fare-Calculation",
        params={"lang": "en"},
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
    )

    soup_eng = BeautifulSoup(response.text, "html.parser")

    origin_en = soup_eng.find("div", id="SelectStationTo").find_all(
        "div", class_="stationList"
    )
    origin_title_en = soup_eng.find("div", id="SelectStationTo").find_all("h3")

    for [title, title_en], [stations, stations_en] in zip(
        zip(origin_title, origin_title_en), zip(origin, origin_en)
    ):
        line_name = title.getText().strip().title()
        line_name_en = title_en.getText().strip().title()

        if stations["id"] == "listFromBLL":
            line_color = "#0E4285"
        elif stations["id"] == "listFromPPL":
            line_color = "#A069C3"
        else:
            line_color = "#FFFFFF"

        stations = stations.find("ul").find_all("li")
        stations_en = stations_en.find("ul").find_all("li")

        station_list = {
            "line_name": line_name_en,
            "line_name_th": line_name,
            "line_color": line_color,
            "stations": [],
        }

        for station, station_en in zip(stations, stations_en):
            station = station.find("button")
            station_en = station_en.find("button")

            station_name = re.sub(r" \(.*?\)$", "", station.getText().strip())
            station_name_en = re.sub(r" \(.*?\)$", "", station_en.getText().strip())

            code = re.sub(r".* \((.*?)\)$", r"\1", station.getText().strip())

            station_list["stations"].append(
                {
                    "code": code,
                    "station_id": re.search(
                        r"document.getElementById\('station1_id'\)\.value = '.*?\|(\d+)';$",
                        station["onclick"],
                    ).group(1),
                    "station_name": station_name_en,
                    "station_name_th": station_name,
                    "line_name": line_name_en,
                    "line_name_th": line_name,
                    "line_color": line_color,
                }
            )
        all_lines.append(station_list)


def calculate_mrt(origin_station, dest_station):
    mrt_res = requests.get(
        "https://metro.bemplc.co.th/Fare-Calculation-Submit.aspx",
        params={
            "s1": "|".join([origin_station["code"], origin_station["station_id"]]),
            "s2": "|".join([dest_station["code"], dest_station["station_id"]]),
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

    url = "https://metro.bemplc.co.th/" + re.search(r"URL=(.*)'", mrt_res.text).group(1)

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

    journey = [
        origin_station,
        dest_station,
    ]

    return journey, fare
