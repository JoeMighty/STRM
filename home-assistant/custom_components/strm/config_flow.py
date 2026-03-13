"""
STRM - Animated Weather App — Home Assistant Config Flow
Created by Jobin Bennykutty
https://github.com/JoeMighty/
"""

from __future__ import annotations

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResult

from .const import DOMAIN, CONF_LATITUDE, CONF_LONGITUDE, CONF_LOCATION_NAME

DATA_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_LOCATION_NAME, default="My Location"): str,
        vol.Required(CONF_LATITUDE): vol.Coerce(float),
        vol.Required(CONF_LONGITUDE): vol.Coerce(float),
    }
)


class STRMConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for STRM."""

    VERSION = 1

    async def async_step_user(self, user_input=None) -> FlowResult:
        errors = {}
        if user_input is not None:
            lat = user_input[CONF_LATITUDE]
            lon = user_input[CONF_LONGITUDE]
            if not (-90 <= lat <= 90):
                errors[CONF_LATITUDE] = "invalid_latitude"
            elif not (-180 <= lon <= 180):
                errors[CONF_LONGITUDE] = "invalid_longitude"
            else:
                await self.async_set_unique_id(f"strm_{lat}_{lon}")
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title=user_input[CONF_LOCATION_NAME],
                    data=user_input,
                )

        return self.async_show_form(
            step_id="user",
            data_schema=DATA_SCHEMA,
            errors=errors,
        )

# Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/
