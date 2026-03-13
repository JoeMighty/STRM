"""
STRM - Animated Weather App
Created by Jobin Bennykutty
https://github.com/JoeMighty/
"""

DOMAIN = "strm"

CONF_LATITUDE = "latitude"
CONF_LONGITUDE = "longitude"
CONF_LOCATION_NAME = "location_name"

WEATHER_API_BASE = "https://api.open-meteo.com/v1"
GEO_API_BASE = "https://geocoding-api.open-meteo.com/v1"
AIR_API_BASE = "https://air-quality-api.open-meteo.com/v1"

SCAN_INTERVAL_MINUTES = 15

WMO_CONDITION_MAP = {
    0: "sunny",
    1: "partlyCloudy",
    2: "partlyCloudy",
    3: "cloudy",
    45: "fog",
    48: "fog",
    51: "rainy",
    53: "rainy",
    55: "rainy",
    56: "rainy",
    57: "rainy",
    61: "rainy",
    63: "rainy",
    65: "rainy",
    66: "rainy",
    67: "rainy",
    71: "snowy",
    73: "snowy",
    75: "snowy",
    77: "snowy",
    80: "rainy",
    81: "rainy",
    82: "rainy",
    85: "snowy",
    86: "snowy",
    95: "lightning-rainy",
    96: "lightning-rainy",
    99: "lightning-rainy",
}

# Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/
