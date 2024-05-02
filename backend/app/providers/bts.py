import requests


def get_all_bts_stations(all_lines: list):
    ## BTS

    response = requests.post(
        "https://www.ebm.co.th/mobapi-routemap/api/RouteMap/StationList",
        params={"lang": "th"},
        headers={
            "Origin": "https://www.bts.co.th",
            "Referer": "https://www.bts.co.th/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
    ).json()

    for line in response["data"]:
        stations = {
            "line_name": line["LineName_EN"],
            "line_id": line["LineId"],
            "line_name_th": line["LineName_TH"],
            "line_color": line["LineColor"],
            "stations": [],
        }
        for station in line["StationList"]:
            stations["stations"].append(
                {
                    "code": station["StationKey"],
                    "station_id": station["StationId"],
                    "station_name": station["StationNameEN"],
                    "station_name_th": station["StationNameTH"],
                    "line_name": line["LineName_EN"],
                    "line_name_th": line["LineName_TH"],
                    "line_color": line["LineColor"],
                }
            )
        all_lines.append(stations)
