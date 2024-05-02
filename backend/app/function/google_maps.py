import json
import os
import re
from urllib.parse import unquote

import polyline
import requests
from app.providers.tolls import do_calculate
from dotenv import load_dotenv
from shapely.geometry import LineString, Point

load_dotenv()


def google_map(url: str, wheel: int):
    response = requests.get(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
    )
    full_url = response.url

    extracted_data = re.search(
        r"https:\/\/www\.google\..*?\/maps\/dir\/(.*)\/@", full_url
    ).group(1)
    all_stops = extracted_data.split("/")
    all_stops = list(map(lambda x: unquote(x.encode("utf8")), all_stops))

    response = requests.get(
        "https://maps.googleapis.com/maps/api/directions/json",
        params={
            "key": os.environ.get("GOOGLE_API_KEY"),
            "origin": all_stops[0],
            "destination": all_stops[-1],
        },
    ).json()

    # Extract the route polyline
    waypoint = response["routes"][0]["overview_polyline"]["points"]

    # Decode the polyline into lat/lng coordinates
    decoded_polyline = polyline.decode(waypoint)

    route_line = LineString(decoded_polyline)

    with open("app/data/tolls.json", encoding="utf8") as f:
        tolls = json.load(f)

    names = []

    for toll_name, checkpoints in tolls.items():
        for checkpoint in checkpoints:
            point = Point(
                list(map(lambda x: float(x), checkpoint["lat_long"].split(", ")))
            )
            is_on_route = route_line.distance(point) < 0.001

            if is_on_route:
                names.append(f"{toll_name}/{checkpoint['value']}")

    fare = do_calculate(tolls, names[0], names[-1], wheel)

    return {"journey": names, "fare": fare}
