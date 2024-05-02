def get_all_arl_stations(all_lines: list):
    line = {
        "line_name": "Airport Rail Link",
        "line_name_th": "รถไฟฟ้าเชื่อมท่าอากาศยานสุวรรณภูมิ",
        "line_color": "#761F21",
        "stations": [],
    }
    line["stations"].extend(
        [
            {
                "code": key,
                "station_name": name,
                "station_name_th": name_th,
                "line_name": line["line_name"],
                "line_name_th": line["line_name_th"],
                "line_color": line["line_color"],
            }
            for key, name, name_th in [
                ["A1", "Suvarnabhumi", "สุวรรณภูมิ"],
                ["A2", "Lat Krabang", "ลาดกระบัง"],
                ["A3", "Ban Thap Chang", "บ้านทับช้าง"],
                ["A4", "Hua Mak", "หัวหมาก"],
                ["A5", "Ramkhamhaeng", "รามคำแหง"],
                ["A6", "Makkasa", "มักกะสัน"],
                ["A7", "Ratchaprarop", "ราชปรารภ"],
                ["A8", "Phaya Thai", "พญาไท"],
            ]
        ]
    )

    all_lines.append(line)


def calculate_arl(origin_station, dest_station):
    fares = [
        {"origin": "พญาไท", "dest": "พญาไท", "price": 15},
        {"origin": "พญาไท", "dest": "ราชปรารภ", "price": 15},
        {"origin": "พญาไท", "dest": "มักกะสัน", "price": 20},
        {"origin": "พญาไท", "dest": "รามคำแหง", "price": 25},
        {"origin": "พญาไท", "dest": "หัวหมาก", "price": 30},
        {"origin": "พญาไท", "dest": "บ้านทับช้าง", "price": 35},
        {"origin": "พญาไท", "dest": "ลาดกระบัง", "price": 40},
        {"origin": "พญาไท", "dest": "สุวรรณภูมิ", "price": 45},
        {"origin": "ราชปรารภ", "dest": "พญาไท", "price": 15},
        {"origin": "ราชปรารภ", "dest": "ราชปรารภ", "price": 15},
        {"origin": "ราชปรารภ", "dest": "มักกะสัน", "price": 15},
        {"origin": "ราชปรารภ", "dest": "รามคำแหง", "price": 20},
        {"origin": "ราชปรารภ", "dest": "หัวหมาก", "price": 25},
        {"origin": "ราชปรารภ", "dest": "บ้านทับช้าง", "price": 30},
        {"origin": "ราชปรารภ", "dest": "ลาดกระบัง", "price": 35},
        {"origin": "ราชปรารภ", "dest": "สุวรรณภูมิ", "price": 40},
        {"origin": "มักกะสัน", "dest": "พญาไท", "price": 20},
        {"origin": "มักกะสัน", "dest": "ราชปรารภ", "price": 15},
        {"origin": "มักกะสัน", "dest": "มักกะสัน", "price": 15},
        {"origin": "มักกะสัน", "dest": "รามคำแหง", "price": 15},
        {"origin": "มักกะสัน", "dest": "หัวหมาก", "price": 20},
        {"origin": "มักกะสัน", "dest": "บ้านทับช้าง", "price": 25},
        {"origin": "มักกะสัน", "dest": "ลาดกระบัง", "price": 30},
        {"origin": "มักกะสัน", "dest": "สุวรรณภูมิ", "price": 35},
        {"origin": "รามคำแหง", "dest": "พญาไท", "price": 25},
        {"origin": "รามคำแหง", "dest": "ราชปรารภ", "price": 20},
        {"origin": "รามคำแหง", "dest": "มักกะสัน", "price": 15},
        {"origin": "รามคำแหง", "dest": "รามคำแหง", "price": 15},
        {"origin": "รามคำแหง", "dest": "หัวหมาก", "price": 15},
        {"origin": "รามคำแหง", "dest": "บ้านทับช้าง", "price": 20},
        {"origin": "รามคำแหง", "dest": "ลาดกระบัง", "price": 25},
        {"origin": "รามคำแหง", "dest": "สุวรรณภูมิ", "price": 30},
        {"origin": "หัวหมาก", "dest": "พญาไท", "price": 30},
        {"origin": "หัวหมาก", "dest": "ราชปรารภ", "price": 25},
        {"origin": "หัวหมาก", "dest": "มักกะสัน", "price": 20},
        {"origin": "หัวหมาก", "dest": "รามคำแหง", "price": 15},
        {"origin": "หัวหมาก", "dest": "หัวหมาก", "price": 15},
        {"origin": "หัวหมาก", "dest": "บ้านทับช้าง", "price": 15},
        {"origin": "หัวหมาก", "dest": "ลาดกระบัง", "price": 20},
        {"origin": "หัวหมาก", "dest": "สุวรรณภูมิ", "price": 25},
        {"origin": "บ้านทับช้าง", "dest": "พญาไท", "price": 35},
        {"origin": "บ้านทับช้าง", "dest": "ราชปรารภ", "price": 30},
        {"origin": "บ้านทับช้าง", "dest": "มักกะสัน", "price": 25},
        {"origin": "บ้านทับช้าง", "dest": "รามคำแหง", "price": 20},
        {"origin": "บ้านทับช้าง", "dest": "หัวหมาก", "price": 20},
        {"origin": "บ้านทับช้าง", "dest": "บ้านทับช้าง", "price": 15},
        {"origin": "บ้านทับช้าง", "dest": "ลาดกระบัง", "price": 15},
        {"origin": "บ้านทับช้าง", "dest": "สุวรรณภูมิ", "price": 20},
        {"origin": "ลาดกระบัง", "dest": "พญาไท", "price": 40},
        {"origin": "ลาดกระบัง", "dest": "ราชปรารภ", "price": 35},
        {"origin": "ลาดกระบัง", "dest": "มักกะสัน", "price": 30},
        {"origin": "ลาดกระบัง", "dest": "รามคำแหง", "price": 25},
        {"origin": "ลาดกระบัง", "dest": "หัวหมาก", "price": 20},
        {"origin": "ลาดกระบัง", "dest": "บ้านทับช้าง", "price": 15},
        {"origin": "ลาดกระบัง", "dest": "ลาดกระบัง", "price": 15},
        {"origin": "ลาดกระบัง", "dest": "สุวรรณภูมิ", "price": 15},
        {"origin": "สุวรรณภูมิ", "dest": "พญาไท", "price": 45},
        {"origin": "สุวรรณภูมิ", "dest": "ราชปรารภ", "price": 40},
        {"origin": "สุวรรณภูมิ", "dest": "มักกะสัน", "price": 35},
        {"origin": "สุวรรณภูมิ", "dest": "รามคำแหง", "price": 30},
        {"origin": "สุวรรณภูมิ", "dest": "หัวหมาก", "price": 25},
        {"origin": "สุวรรณภูมิ", "dest": "บ้านทับช้าง", "price": 20},
        {"origin": "สุวรรณภูมิ", "dest": "ลาดกระบัง", "price": 15},
        {"origin": "สุวรรณภูมิ", "dest": "สุวรรณภูมิ", "price": 15},
    ]

    price = 0

    for fare in fares:
        print(
            origin_station["station_name_th"] == fare["origin"]
            and dest_station["station_name_th"] == fare["dest"]
        )
        if (
            origin_station["station_name_th"] == fare["origin"]
            and dest_station["station_name_th"] == fare["dest"]
        ):
            price += fare["price"]
            break

    journey = [origin_station, dest_station]

    return journey, price
