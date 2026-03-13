/**
 * STRM - Animated Weather App
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/
 */

import { Droplets } from 'lucide-react'
import { useWeatherStore } from '../store/weatherStore'
import { getConditionLabel, formatTemp, formatDate, ANIMATION_MAP } from '../utils/weatherMapper'

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/

/** Simple emoji icon map based on animation type */
const WEATHER_ICON = {
  sunny: '☀️',
  partlyCloudy: '⛅',
  cloudy: '☁️',
  rain: '🌧️',
  snow: '❄️',
  stormy: '⛈️',
  foggy: '🌫️',
  windy: '💨',
}

export default function Forecast() {
  const { locations, activeLocationId, weatherData, units } = useWeatherStore()
  const activeLocation = locations.find((l) => l.id === activeLocationId) || locations[0] || null
  const activeWeather = activeLocation ? weatherData[activeLocation.id] || null : null

  if (!activeWeather?.daily) return null

  const { daily } = activeWeather
  const days = daily.time.slice(0, 7)

  return (
    <div className="glass rounded-2xl p-4 md:p-6">
      <h3 className="font-display text-sm font-semibold text-mint-green/60 uppercase tracking-wider mb-4">
        7-Day Forecast
      </h3>
      <div className="space-y-1">
        {days.map((date, i) => {
          const code = daily.weather_code[i]
          const animType = ANIMATION_MAP[code] || 'sunny'
          const icon = WEATHER_ICON[animType]
          const precip = daily.precipitation_probability_max?.[i]

          return (
            <div
              key={date}
              className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              {/* Day */}
              <span className="text-sm text-mint-green/70 w-20 shrink-0">{formatDate(date)}</span>

              {/* Icon */}
              <span className="text-lg w-8 text-center" role="img" aria-label={getConditionLabel(code)}>
                {icon}
              </span>

              {/* Condition */}
              <span className="text-xs text-mint-green/50 flex-1 hidden sm:block truncate">
                {getConditionLabel(code)}
              </span>

              {/* Precip probability */}
              {precip != null && (
                <span className="flex items-center gap-1 text-xs text-blue-400/80 w-12 justify-end">
                  <Droplets size={11} />
                  {precip}%
                </span>
              )}

              {/* Temp range */}
              <div className="flex items-center gap-1.5 text-sm ml-auto shrink-0">
                <span className="text-mint-green/50 font-medium">
                  {formatTemp(daily.temperature_2m_min[i], units)}
                </span>
                <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden hidden sm:block">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(0, ((daily.temperature_2m_max[i] - daily.temperature_2m_min[i]) / 30) * 100))}%`,
                      background: 'linear-gradient(to right, #5601D6, #17EC1C)',
                    }}
                  />
                </div>
                <span className="text-mint-green font-semibold">
                  {formatTemp(daily.temperature_2m_max[i], units)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
