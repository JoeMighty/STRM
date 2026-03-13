/**
 * STRM - Animated Weather App
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/
 */

const WEATHER_BASE = 'https://api.open-meteo.com/v1'
const GEO_BASE = 'https://geocoding-api.open-meteo.com/v1'
const AIR_BASE = 'https://air-quality-api.open-meteo.com/v1'

/**
 * Fetch current + 7-day forecast for a location.
 * @param {number} lat
 * @param {number} lon
 */
export async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'pressure_msl',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'precipitation_sum',
      'wind_speed_10m_max',
      'precipitation_probability_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: 7,
  })

  const res = await fetch(`${WEATHER_BASE}/forecast?${params}`)
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
  return res.json()
}

/**
 * Search for cities by name.
 * @param {string} name
 * @param {number} count
 */
export async function searchLocations(name, count = 10) {
  const params = new URLSearchParams({
    name,
    count,
    language: 'en',
    format: 'json',
  })

  const res = await fetch(`${GEO_BASE}/search?${params}`)
  if (!res.ok) throw new Error(`Geocoding API error: ${res.status}`)
  const data = await res.json()
  return data.results || []
}

/**
 * Fetch air quality data for a location.
 * @param {number} lat
 * @param {number} lon
 */
export async function fetchAirQuality(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'pm10,pm2_5,us_aqi',
    timezone: 'auto',
  })

  const res = await fetch(`${AIR_BASE}/air-quality?${params}`)
  if (!res.ok) return null // non-critical, fail silently
  return res.json()
}

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/
