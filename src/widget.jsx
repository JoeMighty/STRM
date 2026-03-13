/**
 * STRM - Animated Weather App
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/
 */

import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import WeatherAnimation from './components/animations/WeatherAnimation'
import { getAnimation, getConditionLabel, formatTemp, formatWind } from './utils/weatherMapper'
import { fetchWeather } from './utils/api'

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/

function Widget() {
  const params = new URLSearchParams(window.location.search)
  const lat = parseFloat(params.get('lat'))
  const lon = parseFloat(params.get('lon'))
  const name = params.get('name') || 'Weather'
  const units = params.get('units') === 'imperial' ? 'imperial' : 'metric'
  const refreshMin = Math.max(5, parseInt(params.get('refresh') || '15', 10))

  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)

  const load = async () => {
    if (isNaN(lat) || isNaN(lon)) {
      setError('Missing location. Add ?lat=&lon= to the widget URL.')
      return
    }
    try {
      const data = await fetchWeather(lat, lon)
      setWeather(data)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    load()
    const id = setInterval(load, refreshMin * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-alert-red text-xs p-4 text-center">
        {error}
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: '#0A0618' }}>
        <div className="w-6 h-6 border-2 border-primary-purple border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const { current } = weather
  const animType = getAnimation(current.weather_code, current.wind_speed_10m)
  const condition = getConditionLabel(current.weather_code)

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl" style={{ background: '#0A0618' }}>
      <WeatherAnimation type={animType} />
      <div className="relative z-10 p-4 flex flex-col justify-between h-full box-border">
        <div>
          <p className="font-display text-sm font-semibold text-mint-green truncate">{name}</p>
          <p className="text-xs text-mint-green/50 mt-0.5">{condition}</p>
        </div>
        <div>
          <p className="font-display text-5xl font-bold text-mint-green leading-none">
            {formatTemp(current.temperature_2m, units)}
          </p>
          <p className="text-xs text-mint-green/50 mt-1">
            Feels {formatTemp(current.apparent_temperature, units)} &middot; {formatWind(current.wind_speed_10m, units)}
          </p>
        </div>
        <a
          href="https://github.com/JoeMighty/STRM"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-mint-green/20 hover:text-mint-green/40 transition-colors self-end"
        >
          STRM
        </a>
      </div>
    </div>
  )
}

createRoot(document.getElementById('widget-root')).render(
  <StrictMode>
    <Widget />
  </StrictMode>
)
