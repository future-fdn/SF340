from app.function.google_maps import google_map
from app.providers import (
    calculate_bts_mrt,
    get_all_lines,
    get_connections,
    get_station_info,
)
from app.providers.arl import calculate_arl
from app.providers.mrt import calculate_mrt
from app.providers.srt import calculate_srt
from app.providers.tolls import calculate_toll_fare, get_all_tolls, get_valid_toll
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app = FastAPI(
    title="travel fare api",
    version="2.0.0",
    description="https://github.com/future-fdn/master-data-management-api",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"],
)


@app.get("/")
def root():
    return {"message": "API is working."}


@app.get("/trains")
def train_list():
    all_lines = get_all_lines()

    return {"lines": all_lines}


@app.get("/trains/{key}")
def filter_dest(key: str):
    connection = get_connections(key)

    return {"connections": connection}


@app.get("/trains/{origin}/{dest}")
def calculate(origin: str, dest: str):
    origin_station = get_station_info(origin)
    dest_station = get_station_info(dest)

    if not (origin_station and dest_station):
        return {}

    if (
        (origin_station.get("station_id") and dest_station.get("station_id"))
        or (
            origin_station["line_name"] in ["Blue Line", "Purple Line"]
            and dest_station["line_name"] in ["Blue Line", "Purple Line"]
        )
        or (
            origin_station.get("station_id")
            and dest_station["line_name"] in ["Blue Line", "Purple Line"]
        )
        or (
            origin_station["line_name"] in ["Blue Line", "Purple Line"]
            and dest_station.get("station_id")
        )
    ):
        travel_list, price = calculate_bts_mrt(origin_station, dest_station)
    elif origin_station["line_name"] in ["Blue Line", "Purple Line"] and dest_station[
        "line_name"
    ] in ["Blue Line", "Purple Line"]:
        travel_list, price = calculate_mrt(origin_station, dest_station)
    elif origin_station["line_name"] in [
        "Dark Red Line",
        "Light Red Line",
    ] and dest_station["line_name"] in ["Dark Red Line", "Light Red Line"]:
        travel_list, price = calculate_srt(origin_station, dest_station)
    elif origin_station["line_name"] in ["Airport Rail Link"] and dest_station[
        "line_name"
    ] in ["Airport Rail Link"]:
        travel_list, price = calculate_arl(origin_station, dest_station)

    return {"journey": travel_list, "total": price}


@app.get("/tolls")
def toll_list():
    return {"tolls": get_all_tolls()}


@app.get("/tolls/{toll_name}/{checkpoint}")
def filter_toll(toll_name: str, checkpoint: str):
    return {"tolls": get_valid_toll(toll_name, checkpoint)}


@app.get("/tolls/calculate")
def calculate_toll(origin: str, dest: str, wheel: int):
    return {"fare": calculate_toll_fare(origin, dest, wheel)}


@app.get("/maps")
def maps(url: str, wheel: int):
    return google_map(url, wheel)
