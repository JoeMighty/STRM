/**
 * STRM - Animated Weather App
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/
 */

import { RefreshCw, Droplets, Wind, Gauge, Thermometer, Sunrise, Sunset, Eye } from 'lucide-react'
import { useWeatherStore } from '../store/weatherStore'
import { getAnimation, getConditionLabel, formatTemp, formatWind, formatPressure, formatTime, windDirection } from '../utils/weatherMapper'
import WeatherAnimation from './animations/WeatherAnimation'

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/

export default function WeatherCard() {
  const { locations, activeLocationId, weatherData, units, toggleUnits, refreshActive, loading } = useWeatherStore()

  const location = locations.find((l) => l.id === activeLocationId) || locations[0] || null
  const weather = location ? weatherData[location.id] || null : null

  if (!location) return null

  if (!weather) {
    return (
      <div className="relative glass rounded-2xl overflow-hidden p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-2 border-primary-purple border-t-transparent rounded-full animate-spin" />
        <p className="text-mint-green/50 text-sm mt-4">Loading weather…</p>
      </div>
    )
  }

  const { current, daily } = weather
  const animType = getAnimation(current.weather_code, current.wind_speed_10m)
  const condition = getConditionLabel(current.weather_code)

  const aqiLabel = (aqi) => {
    if (!aqi) return null
    if (aqi <= 50) return { label: 'Good', color: 'text-neon-green' }
    if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-400' }
    if (aqi <= 150) return { label: 'Unhealthy', color: 'text-orange-400' }
    return { label: 'Hazardous', color: 'text-alert-red' }
  }

  const aqi = aqiLabel(weather.airQuality?.us_aqi)

  return (
    <div className="relative glass rounded-2xl overflow-hidden">
      {/* Background animation */}
      <WeatherAnimation type={animType} />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        {/* Header row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-semibold text-mint-green leading-tight">
              {location.name}
            </h2>
            <p className="text-mint-green/60 text-sm mt-1">{condition}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Unit toggle */}
            <button
              onClick={toggleUnits}
              className="glass glass-hover px-3 py-1.5 rounded-xl text-xs font-medium text-mint-green"
              aria-label={`Switch to ${units === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
            >
              °{units === 'metric' ? 'C' : 'F'}
            </button>
            {/* Refresh */}
            <button
              onClick={refreshActive}
              disabled={loading}
              className="btn-ghost p-2 rounded-xl"
              aria-label="Refresh weather"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-primary-purple' : ''} />
            </button>
          </div>
        </div>

        {/* Main temperature */}
        <div className="flex items-end gap-4 mb-6">
          <span className="font-display text-7xl font-bold text-mint-green leading-none">
            {formatTemp(current.temperature_2m, units).replace(/°[CF]/, '')}
            <span className="text-3xl font-normal text-mint-green/70">
              {units === 'metric' ? '°C' : '°F'}
            </span>
          </span>
          <div className="mb-2 flex flex-col gap-0.5">
            <span className="text-sm text-mint-green/60">
              Feels {formatTemp(current.apparent_temperature, units)}
            </span>
            {aqi && (
              <span className={`text-xs font-medium ${aqi.color}`}>
                AQI: {aqi.label}
              </span>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="weather-stat">
            <Droplets size={16} className="text-blue-400 mb-1" />
            <span className="stat-label">Humidity</span>
            <span className="stat-value">{current.relative_humidity_2m}%</span>
          </div>
          <div className="weather-stat">
            <Wind size={16} className="text-mint-green/70 mb-1" />
            <span className="stat-label">Wind</span>
            <span className="stat-value">
              {formatWind(current.wind_speed_10m, units)}
            </span>
            <span className="text-xs text-mint-green/40">
              {windDirection(current.wind_direction_10m)}
            </span>
          </div>
          <div className="weather-stat">
            <Gauge size={16} className="text-primary-purple/80 mb-1" />
            <span className="stat-label">Pressure</span>
            <span className="stat-value">{formatPressure(current.pressure_msl)}</span>
          </div>
          <div className="weather-stat">
            <Thermometer size={16} className="text-orange-400 mb-1" />
            <span className="stat-label">Precip</span>
            <span className="stat-value">{current.precipitation} mm</span>
          </div>
        </div>

        {/* Sunrise / Sunset */}
        {daily?.sunrise?.[0] && (
          <div className="flex items-center gap-4 pt-3 border-t border-white/5 text-sm text-mint-green/60">
            <span className="flex items-center gap-1.5">
              <Sunrise size={14} className="text-yellow-400" />
              {formatTime(daily.sunrise[0])}
            </span>
            <span className="flex items-center gap-1.5">
              <Sunset size={14} className="text-orange-400" />
              {formatTime(daily.sunset[0])}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
