import re

import requests
from bs4 import BeautifulSoup


def get_all_srt_stations(all_lines: list):
    response = requests.get(
        "https://www.srtet.co.th/th",
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
    )

    soup = BeautifulSoup(response.text, "html.parser")

    origin = soup.find_all("div", class_=re.compile(r"line--station__view.*"))

    response = requests.get(
        "https://www.srtet.co.th/en",
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
    )

    soup_eng = BeautifulSoup(response.text, "html.parser")

    origin_en = soup_eng.find_all("div", class_=re.compile(r"line--station__view.*"))

    for line, line_en in zip(origin, origin_en):
        line_name = ""
        line_name_en = ""

        if "redLine" in line["class"]:
            line_name = "สายสีแดงเข้ม"
            line_name_en = "Dark Red Line"
            line_color = "#BC1320"
        elif "lightredLine" in line["class"]:
            line_name = "สายสีแดงอ่อน"
            line_name_en = "Light Red Line"
            line_color = "#D05A63"
        else:
            line_color = "#FFFFFF"

        stations = line.find_all("div", class_="station--info__bottom")
        stations_en = line_en.find_all("div", class_="station--info__bottom")

        station_list = {
            "line_name": line_name_en,
            "line_name_th": line_name,
            "line_color": line_color,
            "stations": [
                {
                    "code": "RN01" if "redLine" in line["class"] else "RW01",
                    "station_name": "Krung Thep Aphiwat Central Terminal",
                    "station_name_th": "สถานีกลางกรุงเทพอภิวัฒน์",
                    "line_name": line_name_en,
                    "line_name_th": line_name,
                    "line_color": line_color,
                }
            ],
        }

        offset = 0

        for i, [station, station_en] in enumerate(zip(stations, stations_en), start=2):
            station_i = i + offset

            station = station.find("div", class_="info__name")
            station_en = station_en.find("div", class_="info__name")

            station_name = re.sub(r" \(.*?\)$", "", station.getText().strip())
            station_name_en = re.sub(r" \(.*?\)$", "", station_en.getText().strip())

            code = f"ERROR{i:02d}"

            if "บางบำหรุ" in station_name and station_i == 3:
                offset = 2
                station_i = i + offset

            if "redLine" in line["class"]:
                code = f"RN{station_i:02d}"
            elif "lightredLine" in line["class"]:
                code = f"RW{station_i:02d}"

            station_list["stations"].append(
                {
                    "code": code,
                    "station_name": station_name_en,
                    "station_name_th": station_name,
                    "line_name": line_name_en,
                    "line_name_th": line_name,
                    "line_color": line_color,
                }
            )
        all_lines.append(station_list)


def calculate_srt(origin_station, dest_station):
    from app.providers import get_station_info

    fares = [
        {"origin": "ตลิ่งชัน", "dest": "ตลิ่งชัน", "price": 12},
        {"origin": "ตลิ่งชัน", "dest": "บางบำหรุ", "price": 18},
        {"origin": "ตลิ่งชัน", "dest": "บางซ่อน", "price": 29},
        {"origin": "ตลิ่งชัน", "dest": "สถานีกลางกรุงเทพอภิวัฒน์", "price": 35},
        {"origin": "ตลิ่งชัน", "dest": "จตุจักร", "price": 38},
        {"origin": "ตลิ่งชัน", "dest": "วัดเสมียนนารี", "price": 41},
        {"origin": "ตลิ่งชัน", "dest": "บางเขน", "price": 42},
        {"origin": "ตลิ่งชัน", "dest": "ทุ่งสองห้อง", "price": 42},
        {"origin": "ตลิ่งชัน", "dest": "หลักสี่", "price": 42},
        {"origin": "ตลิ่งชัน", "dest": "การเคหะ", "price": 42},
        {"origin": "ตลิ่งชัน", "dest": "ดอนเมือง", "price": 42},
        {"origin": "ตลิ่งชัน", "dest": "หลักหก", "price": 42},
        {"origin": "ตลิ่งชัน", "dest": "รังสิต", "price": 42},
        {"origin": "บางบำหรุ", "dest": "ตลิ่งชัน", "price": 18},
        {"origin": "บางบำหรุ", "dest": "บางบำหรุ", "price": 12},
        {"origin": "บางบำหรุ", "dest": "บางซ่อน", "price": 23},
        {"origin": "บางบำหรุ", "dest": "สถานีกลางกรุงเทพอภิวัฒน์", "price": 29},
        {"origin": "บางบำหรุ", "dest": "จตุจักร", "price": 32},
        {"origin": "บางบำหรุ", "dest": "วัดเสมียนนารี", "price": 35},
        {"origin": "บางบำหรุ", "dest": "บางเขน", "price": 37},
        {"origin": "บางบำหรุ", "dest": "ทุ่งสองห้อง", "price": 39},
        {"origin": "บางบำหรุ", "dest": "หลักสี่", "price": 42},
        {"origin": "บางบำหรุ", "dest": "การเคหะ", "price": 42},
        {"origin": "บางบำหรุ", "dest": "ดอนเมือง", "price": 42},
        {"origin": "บางบำหรุ", "dest": "หลักหก", "price": 42},
        {"origin": "บางบำหรุ", "dest": "รังสิต", "price": 42},
        {"origin": "บางซ่อน", "dest": "ตลิ่งชัน", "price": 29},
        {"origin": "บางซ่อน", "dest": "บางบำหรุ", "price": 23},
        {"origin": "บางซ่อน", "dest": "บางซ่อน", "price": 12},
        {"origin": "บางซ่อน", "dest": "สถานีกลางกรุงเทพอภิวัฒน์", "price": 18},
        {"origin": "บางซ่อน", "dest": "จตุจักร", "price": 22},
        {"origin": "บางซ่อน", "dest": "วัดเสมียนนารี", "price": 25},
        {"origin": "บางซ่อน", "dest": "บางเขน", "price": 26},
        {"origin": "บางซ่อน", "dest": "ทุ่งสองห้อง", "price": 29},
        {"origin": "บางซ่อน", "dest": "หลักสี่", "price": 33},
        {"origin": "บางซ่อน", "dest": "การเคหะ", "price": 36},
        {"origin": "บางซ่อน", "dest": "ดอนเมือง", "price": 39},
        {"origin": "บางซ่อน", "dest": "หลักหก", "price": 42},
        {"origin": "บางซ่อน", "dest": "รังสิต", "price": 42},
        {"origin": "สถานีกลางกรุงเทพอภิวัฒน์", "dest": "ตลิ่งชัน", "price": 35},
        {"origin": "สถานีกลางกรุงเทพอภิวัฒน์", "dest": "บางบำหรุ", "price": 29},
        {"origin": "สถานีกลางกรุงเทพอภิวัฒน์", "dest": "บางซ่อน", "price": 18},
        {"origin": "สถานีกลางกรุงเทพอภิวัฒน์", "dest": "สถานีกลางกรุงเทพอภิวัฒน์", "price": 12},
        {"origin": "สถานีกลางกรุงเทพอภิวัฒน์", "dest": "จตุจักร", "price": 16},
        {"origin": "สถานีกลางกรุงเทพอภิวัฒน์", "dest": "วัดเสมียนนารี", "price": 19},
        {"origin": "สถานีกลางกรุงเทพอภิวัฒน์", "dest": "บางเขน", "price": 20},
        {"origin": "สถานีกลางกรุงเทพอภิวัฒน์", "dest": "ทุ่งสองห้อง", "price": 23},
        {"origin": "สถานีกลางกรุงเทพอภิวัฒน์", "dest": "หลักสี่", "price": 27},
        {"origin": "สถานีกลางกรุงเทพอภิวัฒน์", "dest": "การเคหะ", "price": 30},
        {"origin": "สถานีกลางกรุงเทพอภิวัฒน์", "dest": "ดอนเมือง", "price": 33},
        {"origin": "สถานีกลางกรุงเทพอภิวัฒน์", "dest": "หลักหก", "price": 42},
        {"origin": "สถานีกลางกรุงเทพอภิวัฒน์", "dest": "รังสิต", "price": 42},
        {"origin": "จตุจักร", "dest": "ตลิ่งชัน", "price": 38},
        {"origin": "จตุจักร", "dest": "บางบำหรุ", "price": 32},
        {"origin": "จตุจักร", "dest": "บางซ่อน", "price": 22},
        {"origin": "จตุจักร", "dest": "สถานีกลางกรุงเทพอภิวัฒน์", "price": 16},
        {"origin": "จตุจักร", "dest": "จตุจักร", "price": 12},
        {"origin": "จตุจักร", "dest": "วัดเสมียนนารี", "price": 15},
        {"origin": "จตุจักร", "dest": "บางเขน", "price": 17},
        {"origin": "จตุจักร", "dest": "ทุ่งสองห้อง", "price": 19},
        {"origin": "จตุจักร", "dest": "หลักสี่", "price": 23},
        {"origin": "จตุจักร", "dest": "การเคหะ", "price": 26},
        {"origin": "จตุจักร", "dest": "ดอนเมือง", "price": 29},
        {"origin": "จตุจักร", "dest": "หลักหก", "price": 38},
        {"origin": "จตุจักร", "dest": "รังสิต", "price": 42},
        {"origin": "วัดเสมียนนารี", "dest": "ตลิ่งชัน", "price": 41},
        {"origin": "วัดเสมียนนารี", "dest": "บางบำหรุ", "price": 35},
        {"origin": "วัดเสมียนนารี", "dest": "บางซ่อน", "price": 25},
        {"origin": "วัดเสมียนนารี", "dest": "สถานีกลางกรุงเทพอภิวัฒน์", "price": 19},
        {"origin": "วัดเสมียนนารี", "dest": "จตุจักร", "price": 15},
        {"origin": "วัดเสมียนนารี", "dest": "วัดเสมียนนารี", "price": 12},
        {"origin": "วัดเสมียนนารี", "dest": "บางเขน", "price": 14},
        {"origin": "วัดเสมียนนารี", "dest": "ทุ่งสองห้อง", "price": 16},
        {"origin": "วัดเสมียนนารี", "dest": "หลักสี่", "price": 20},
        {"origin": "วัดเสมียนนารี", "dest": "การเคหะ", "price": 23},
        {"origin": "วัดเสมียนนารี", "dest": "ดอนเมือง", "price": 26},
        {"origin": "วัดเสมียนนารี", "dest": "หลักหก", "price": 35},
        {"origin": "วัดเสมียนนารี", "dest": "รังสิต", "price": 40},
        {"origin": "บางเขน", "dest": "ตลิ่งชัน", "price": 42},
        {"origin": "บางเขน", "dest": "บางบำหรุ", "price": 37},
        {"origin": "บางเขน", "dest": "บางซ่อน", "price": 26},
        {"origin": "บางเขน", "dest": "สถานีกลางกรุงเทพอภิวัฒน์", "price": 20},
        {"origin": "บางเขน", "dest": "จตุจักร", "price": 17},
        {"origin": "บางเขน", "dest": "วัดเสมียนนารี", "price": 14},
        {"origin": "บางเขน", "dest": "บางเขน", "price": 12},
        {"origin": "บางเขน", "dest": "ทุ่งสองห้อง", "price": 14},
        {"origin": "บางเขน", "dest": "หลักสี่", "price": 19},
        {"origin": "บางเขน", "dest": "การเคหะ", "price": 22},
        {"origin": "บางเขน", "dest": "ดอนเมือง", "price": 25},
        {"origin": "บางเขน", "dest": "หลักหก", "price": 34},
        {"origin": "บางเขน", "dest": "รังสิต", "price": 38},
        {"origin": "ทุ่งสองห้อง", "dest": "ตลิ่งชัน", "price": 42},
        {"origin": "ทุ่งสองห้อง", "dest": "บางบำหรุ", "price": 39},
        {"origin": "ทุ่งสองห้อง", "dest": "บางซ่อน", "price": 29},
        {"origin": "ทุ่งสองห้อง", "dest": "สถานีกลางกรุงเทพอภิวัฒน์", "price": 23},
        {"origin": "ทุ่งสองห้อง", "dest": "จตุจักร", "price": 19},
        {"origin": "ทุ่งสองห้อง", "dest": "วัดเสมียนนารี", "price": 16},
        {"origin": "ทุ่งสองห้อง", "dest": "บางเขน", "price": 14},
        {"origin": "ทุ่งสองห้อง", "dest": "ทุ่งสองห้อง", "price": 12},
        {"origin": "ทุ่งสองห้อง", "dest": "หลักสี่", "price": 17},
        {"origin": "ทุ่งสองห้อง", "dest": "การเคหะ", "price": 20},
        {"origin": "ทุ่งสองห้อง", "dest": "ดอนเมือง", "price": 23},
        {"origin": "ทุ่งสองห้อง", "dest": "หลักหก", "price": 32},
        {"origin": "ทุ่งสองห้อง", "dest": "รังสิต", "price": 36},
        {"origin": "หลักสี่", "dest": "ตลิ่งชัน", "price": 42},
        {"origin": "หลักสี่", "dest": "บางบำหรุ", "price": 42},
        {"origin": "หลักสี่", "dest": "บางซ่อน", "price": 33},
        {"origin": "หลักสี่", "dest": "สถานีกลางกรุงเทพอภิวัฒน์", "price": 27},
        {"origin": "หลักสี่", "dest": "จตุจักร", "price": 23},
        {"origin": "หลักสี่", "dest": "วัดเสมียนนารี", "price": 20},
        {"origin": "หลักสี่", "dest": "บางเขน", "price": 19},
        {"origin": "หลักสี่", "dest": "ทุ่งสองห้อง", "price": 17},
        {"origin": "หลักสี่", "dest": "หลักสี่", "price": 12},
        {"origin": "หลักสี่", "dest": "การเคหะ", "price": 15},
        {"origin": "หลักสี่", "dest": "ดอนเมือง", "price": 18},
        {"origin": "หลักสี่", "dest": "หลักหก", "price": 27},
        {"origin": "หลักสี่", "dest": "รังสิต", "price": 32},
        {"origin": "การเคหะ", "dest": "ตลิ่งชัน", "price": 42},
        {"origin": "การเคหะ", "dest": "บางบำหรุ", "price": 42},
        {"origin": "การเคหะ", "dest": "บางซ่อน", "price": 36},
        {"origin": "การเคหะ", "dest": "สถานีกลางกรุงเทพอภิวัฒน์", "price": 30},
        {"origin": "การเคหะ", "dest": "จตุจักร", "price": 26},
        {"origin": "การเคหะ", "dest": "วัดเสมียนนารี", "price": 23},
        {"origin": "การเคหะ", "dest": "บางเขน", "price": 22},
        {"origin": "การเคหะ", "dest": "ทุ่งสองห้อง", "price": 20},
        {"origin": "การเคหะ", "dest": "หลักสี่", "price": 15},
        {"origin": "การเคหะ", "dest": "การเคหะ", "price": 12},
        {"origin": "การเคหะ", "dest": "ดอนเมือง", "price": 15},
        {"origin": "การเคหะ", "dest": "หลักหก", "price": 24},
        {"origin": "การเคหะ", "dest": "รังสิต", "price": 29},
        {"origin": "ดอนเมือง", "dest": "ตลิ่งชัน", "price": 42},
        {"origin": "ดอนเมือง", "dest": "บางบำหรุ", "price": 42},
        {"origin": "ดอนเมือง", "dest": "บางซ่อน", "price": 39},
        {"origin": "ดอนเมือง", "dest": "สถานีกลางกรุงเทพอภิวัฒน์", "price": 33},
        {"origin": "ดอนเมือง", "dest": "จตุจักร", "price": 29},
        {"origin": "ดอนเมือง", "dest": "วัดเสมียนนารี", "price": 26},
        {"origin": "ดอนเมือง", "dest": "บางเขน", "price": 25},
        {"origin": "ดอนเมือง", "dest": "ทุ่งสองห้อง", "price": 23},
        {"origin": "ดอนเมือง", "dest": "หลักสี่", "price": 18},
        {"origin": "ดอนเมือง", "dest": "การเคหะ", "price": 15},
        {"origin": "ดอนเมือง", "dest": "ดอนเมือง", "price": 12},
        {"origin": "ดอนเมือง", "dest": "หลักหก", "price": 21},
        {"origin": "ดอนเมือง", "dest": "รังสิต", "price": 26},
        {"origin": "หลักหก", "dest": "ตลิ่งชัน", "price": 42},
        {"origin": "หลักหก", "dest": "บางบำหรุ", "price": 42},
        {"origin": "หลักหก", "dest": "บางซ่อน", "price": 42},
        {"origin": "หลักหก", "dest": "สถานีกลางกรุงเทพอภิวัฒน์", "price": 42},
        {"origin": "หลักหก", "dest": "จตุจักร", "price": 38},
        {"origin": "หลักหก", "dest": "วัดเสมียนนารี", "price": 35},
        {"origin": "หลักหก", "dest": "บางเขน", "price": 34},
        {"origin": "หลักหก", "dest": "ทุ่งสองห้อง", "price": 32},
        {"origin": "หลักหก", "dest": "หลักสี่", "price": 27},
        {"origin": "หลักหก", "dest": "การเคหะ", "price": 24},
        {"origin": "หลักหก", "dest": "ดอนเมือง", "price": 21},
        {"origin": "หลักหก", "dest": "หลักหก", "price": 12},
        {"origin": "หลักหก", "dest": "รังสิต", "price": 17},
        {"origin": "รังสิต", "dest": "ตลิ่งชัน", "price": 42},
        {"origin": "รังสิต", "dest": "บางบำหรุ", "price": 42},
        {"origin": "รังสิต", "dest": "บางซ่อน", "price": 42},
        {"origin": "รังสิต", "dest": "สถานีกลางกรุงเทพอภิวัฒน์", "price": 42},
        {"origin": "รังสิต", "dest": "จตุจักร", "price": 42},
        {"origin": "รังสิต", "dest": "วัดเสมียนนารี", "price": 40},
        {"origin": "รังสิต", "dest": "บางเขน", "price": 38},
        {"origin": "รังสิต", "dest": "ทุ่งสองห้อง", "price": 36},
        {"origin": "รังสิต", "dest": "หลักสี่", "price": 32},
        {"origin": "รังสิต", "dest": "การเคหะ", "price": 29},
        {"origin": "รังสิต", "dest": "ดอนเมือง", "price": 26},
        {"origin": "รังสิต", "dest": "หลักหก", "price": 17},
        {"origin": "รังสิต", "dest": "รังสิต", "price": 12},
    ]

    price = 0

    for fare in fares:
        if (
            origin_station["station_name_th"] == fare["origin"]
            and dest_station["station_name_th"] == fare["dest"]
        ):
            price += fare["price"] if fare["price"] <= 20 else 20

    journey = []

    if not (
        origin_station["code"].startswith("RW")
        and dest_station["code"].startswith("RW")
    ) or (
        origin_station["code"].startswith("RN")
        and dest_station["code"].startswith("RN")
    ):
        if not (
            origin_station["code"] == "RW01"
            or origin_station["code"] == "RN01"
            or dest_station["code"] == "RW01"
            or dest_station["code"] == "RN01"
        ):
            if origin_station["code"].startswith("RW"):
                journey.append(get_station_info("RW01"))
            elif origin_station["code"].startswith("RN"):
                journey.append(get_station_info("RN01"))

    journey = [origin_station] + journey + [dest_station]

    return journey, price
