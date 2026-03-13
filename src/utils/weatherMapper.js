/**
 * STRM - Animated Weather App
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/
 */

/** WMO code → animation type */
export const ANIMATION_MAP = {
  0:  'sunny',
  1:  'partlyCloudy',
  2:  'partlyCloudy',
  3:  'cloudy',
  45: 'foggy',
  48: 'foggy',
  51: 'rain',
  53: 'rain',
  55: 'rain',
  56: 'rain',
  57: 'rain',
  61: 'rain',
  63: 'rain',
  65: 'rain',
  66: 'rain',
  67: 'rain',
  71: 'snow',
  73: 'snow',
  75: 'snow',
  77: 'snow',
  80: 'rain',
  81: 'rain',
  82: 'rain',
  85: 'snow',
  86: 'snow',
  95: 'stormy',
  96: 'stormy',
  99: 'stormy',
}

/** WMO code → human-readable label */
export const CONDITION_LABELS = {
  0:  'Clear Sky',
  1:  'Mainly Clear',
  2:  'Partly Cloudy',
  3:  'Overcast',
  45: 'Foggy',
  48: 'Rime Fog',
  51: 'Light Drizzle',
  53: 'Drizzle',
  55: 'Heavy Drizzle',
  56: 'Freezing Drizzle',
  57: 'Heavy Freezing Drizzle',
  61: 'Light Rain',
  63: 'Rain',
  65: 'Heavy Rain',
  66: 'Freezing Rain',
  67: 'Heavy Freezing Rain',
  71: 'Light Snowfall',
  73: 'Snowfall',
  75: 'Heavy Snowfall',
  77: 'Snow Grains',
  80: 'Rain Showers',
  81: 'Heavy Rain Showers',
  82: 'Violent Rain Showers',
  85: 'Snow Showers',
  86: 'Heavy Snow Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm w/ Hail',
  99: 'Thunderstorm w/ Heavy Hail',
}

/**
 * Determine the animation to use, factoring in wind speed.
 * @param {number} weatherCode  WMO code
 * @param {number} windSpeed    m/s
 */
export function getAnimation(weatherCode, windSpeed) {
  if (windSpeed > 10 && ANIMATION_MAP[weatherCode] === 'sunny') return 'windy'
  if (windSpeed > 10 && ANIMATION_MAP[weatherCode] === 'partlyCloudy') return 'windy'
  return ANIMATION_MAP[weatherCode] || 'sunny'
}

/** Get weather condition label */
export function getConditionLabel(weatherCode) {
  return CONDITION_LABELS[weatherCode] || 'Unknown'
}

/**
 * Format temperature with unit symbol.
 * @param {number} celsius
 * @param {'metric'|'imperial'} units
 */
export function formatTemp(celsius, units = 'metric') {
  if (units === 'imperial') {
    return `${Math.round(celsius * 9 / 5 + 32)}°F`
  }
  return `${Math.round(celsius)}°C`
}

/**
 * Format wind speed with unit.
 * @param {number} ms   meters/second
 * @param {'metric'|'imperial'} units
 */
export function formatWind(ms, units = 'metric') {
  if (units === 'imperial') {
    return `${Math.round(ms * 2.237)} mph`
  }
  return `${Math.round(ms * 3.6)} km/h`
}

/**
 * Format pressure.
 * @param {number} hpa
 */
export function formatPressure(hpa) {
  return `${Math.round(hpa)} hPa`
}

/**
 * Parse "HH:MM" from ISO datetime string "2026-03-13T06:15"
 * @param {string} isoStr
 */
export function formatTime(isoStr) {
  if (!isoStr) return '--:--'
  const d = new Date(isoStr)
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
}

/**
 * Parse date label like "Mon 13 Mar" from ISO date string "2026-03-13"
 * @param {string} dateStr
 */
export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Today'
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

/**
 * Wind direction degrees → compass label
 * @param {number} deg
 */
export function windDirection(deg) {
  const dirs = ['N','NE','E','SE','S','SW','W','NW']
  return dirs[Math.round(deg / 45) % 8]
}

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/
