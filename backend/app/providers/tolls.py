import json


def get_all_tolls():
    with open("app/data/tolls.json", encoding="utf8") as f:
        tolls = json.load(f)

    toll_return = []

    for toll_name, checkpoints in tolls.items():
        toll_data = {
            "toll_name": toll_name,
            "checkpoints": [],
        }

        for cp in checkpoints:
            toll_data["checkpoints"].append(
                {
                    "checkpoint_name": cp["value"],
                    "toll_name": toll_name,
                }
            )

        toll_return.append(toll_data)

    return toll_return


def get_valid_toll(toll_name: str, checkpoint: str):
    tolls_connections = [
        [
            "ทางพิเศษเฉลิมมหานคร",
            "ทางพิเศษศรีรัช",
            "ทางพิเศษฉลองรัช",
            "ทางพิเศษบูรพาวิถี",
            "ทางพิเศษอุดรรัถยา",
            "ทางพิเศษกาญจนาภิเษก",
        ],
        [
            "ทางพิเศษฉลองรัช",
            "ทางพิเศษเฉลิมมหานคร",
            "ทางพิเศษศรีรัช",
            "ทางพิเศษบูรพาวิถี",
            "ทางหลวงพิเศษหมายเลข 7",
        ],
        [
            "ทางพิเศษศรีรัช",
            "ทางพิเศษเฉลิมมหานคร",
            "ทางพิเศษฉลองรัช",
            "ทางพิเศษบูรพาวิถี",
            "ทางหลวงพิเศษหมายเลข 7",
        ],
    ]

    tolls = get_all_tolls()

    valid = set()

    for conn in tolls_connections:
        if toll_name in conn:
            valid.update(conn)

    return list(filter(lambda x: x["toll_name"] in valid, tolls))


def calculate_toll_fare(origin: str, dest: str, wheel: int):
    with open("app/data/tolls.json", encoding="utf8") as f:
        tolls = json.load(f)

    return do_calculate(tolls, origin, dest, wheel)


def do_calculate(tolls, origin, dest, wheel):
    origin_toll_name, origin_checkpoint = origin.split("/")
    dest_toll_name, dest_checkpoint = dest.split("/")

    fare = 0

    for toll_name, checkpoint in [
        [origin_toll_name, origin_checkpoint],
        [dest_toll_name, dest_checkpoint],
    ]:
        if tolls[toll_name][0]["fare"].get("4"):
            if wheel == 10 and not tolls[toll_name][0]["fare"].get("10"):
                wheel = 8
            if wheel == 8 and not tolls[toll_name][0]["fare"].get("8"):
                wheel = 10
            if wheel == 6 and not tolls[toll_name][0]["fare"].get("6"):
                wheel = 4

            fare += [x for x in tolls[toll_name] if x["value"] == checkpoint][0][
                "fare"
            ].get(str(wheel))

        else:
            if wheel == 10 and not tolls[origin_toll_name][0]["fare"][checkpoint].get(
                "10"
            ):
                wheel = 8
            if wheel == 8 and not tolls[origin_toll_name][0]["fare"][checkpoint].get(
                "8"
            ):
                wheel = 10
            if wheel == 6 and not tolls[origin_toll_name][0]["fare"][checkpoint].get(
                "6"
            ):
                wheel = 4

            fare += (
                [x for x in tolls[origin_toll_name] if x["value"] == origin_checkpoint][
                    0
                ]["fare"]
                .get(dest_checkpoint, {})
                .get(str(wheel), 0)
            )

    return fare
