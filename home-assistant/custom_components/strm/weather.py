"""
STRM - Animated Weather App — Home Assistant Weather Entity
Created by Jobin Bennykutty
https://github.com/JoeMighty/
"""

from __future__ import annotations

import aiohttp
from datetime import timedelta
import logging

from homeassistant.components.weather import (
    WeatherEntity,
    WeatherEntityFeature,
    Forecast,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import UnitOfTemperature, UnitOfSpeed, UnitOfPressure
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import (
    DataUpdateCoordinator,
    CoordinatorEntity,
)

from .const import (
    DOMAIN,
    WEATHER_API_BASE,
    SCAN_INTERVAL_MINUTES,
    WMO_CONDITION_MAP,
    CONF_LATITUDE,
    CONF_LONGITUDE,
    CONF_LOCATION_NAME,
)

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up STRM weather entity from config entry."""
    lat = entry.data[CONF_LATITUDE]
    lon = entry.data[CONF_LONGITUDE]
    name = entry.data.get(CONF_LOCATION_NAME, "STRM Weather")

    coordinator = STRMDataCoordinator(hass, lat, lon)
    await coordinator.async_config_entry_first_refresh()

    async_add_entities([STRMWeatherEntity(coordinator, name, lat, lon)])


class STRMDataCoordinator(DataUpdateCoordinator):
    """Coordinator to fetch weather data from Open-Meteo."""

    def __init__(self, hass: HomeAssistant, lat: float, lon: float):
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=timedelta(minutes=SCAN_INTERVAL_MINUTES),
        )
        self.lat = lat
        self.lon = lon

    async def _async_update_data(self):
        params = (
            f"?latitude={self.lat}&longitude={self.lon}"
            f"&current=temperature_2m,relative_humidity_2m,apparent_temperature,"
            f"precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl"
            f"&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,"
            f"wind_speed_10m_max,precipitation_probability_max"
            f"&timezone=auto&forecast_days=7"
        )
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{WEATHER_API_BASE}/forecast{params}") as resp:
                resp.raise_for_status()
                return await resp.json()


class STRMWeatherEntity(CoordinatorEntity, WeatherEntity):
    """STRM weather entity backed by Open-Meteo."""

    _attr_supported_features = WeatherEntityFeature.FORECAST_DAILY

    def __init__(self, coordinator, name, lat, lon):
        super().__init__(coordinator)
        self._attr_name = name
        self._attr_unique_id = f"strm_{lat}_{lon}"
        self._attr_native_temperature_unit = UnitOfTemperature.CELSIUS
        self._attr_native_wind_speed_unit = UnitOfSpeed.KILOMETERS_PER_HOUR
        self._attr_native_pressure_unit = UnitOfPressure.HPA

    @property
    def _current(self):
        return self.coordinator.data.get("current", {})

    @property
    def _daily(self):
        return self.coordinator.data.get("daily", {})

    @property
    def native_temperature(self):
        return self._current.get("temperature_2m")

    @property
    def humidity(self):
        return self._current.get("relative_humidity_2m")

    @property
    def native_wind_speed(self):
        ms = self._current.get("wind_speed_10m", 0)
        return round(ms * 3.6, 1)  # convert m/s → km/h

    @property
    def wind_bearing(self):
        return self._current.get("wind_direction_10m")

    @property
    def native_pressure(self):
        return self._current.get("pressure_msl")

    @property
    def condition(self):
        code = self._current.get("weather_code", 0)
        return WMO_CONDITION_MAP.get(code, "cloudy")

    async def async_forecast_daily(self) -> list[Forecast] | None:
        daily = self._daily
        if not daily:
            return None
        forecasts = []
        for i, date in enumerate(daily.get("time", [])):
            code = daily["weather_code"][i]
            forecasts.append(
                Forecast(
                    datetime=date,
                    native_temperature=daily["temperature_2m_max"][i],
                    native_templow=daily["temperature_2m_min"][i],
                    condition=WMO_CONDITION_MAP.get(code, "cloudy"),
                    native_precipitation=daily.get("precipitation_sum", [None] * 7)[i],
                    precipitation_probability=daily.get("precipitation_probability_max", [None] * 7)[i],
                )
            )
        return forecasts

# Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/
