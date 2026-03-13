/**
 * STRM - Animated Weather App
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/
 */

import { useEffect, useState } from 'react'
import { Cloud, Code2, Github, AlertCircle } from 'lucide-react'
import { useWeatherStore } from './store/weatherStore'
import { useGeolocation } from './hooks/useGeolocation'
import WeatherCard from './components/WeatherCard'
import Forecast from './components/Forecast'
import LocationManager from './components/LocationManager'
import WidgetGenerator from './components/WidgetGenerator'

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/

export default function App() {
  const { locations, activeLocationId, weatherData, addLocation, error, clearError, refreshActive } = useWeatherStore()
  const activeLocation = locations.find((l) => l.id === activeLocationId) || locations[0] || null
  const activeWeather = activeLocation ? weatherData[activeLocation.id] || null : null
  const { detect, position, error: geoError, loading: detecting } = useGeolocation()
  const [showWidget, setShowWidget] = useState(false)
  const [geoHandled, setGeoHandled] = useState(false)

  // Auto-detect on first load if no saved locations
  useEffect(() => {
    if (locations.length === 0 && !geoHandled) {
      detect()
      setGeoHandled(true)
    }
  }, [])

  // Fetch weather whenever the active location changes and we have no data for it
  useEffect(() => {
    if (activeLocation && !activeWeather) {
      refreshActive()
    }
  }, [activeLocation?.id])

  // Reverse-geocode detected position
  useEffect(() => {
    if (!position) return
    ;(async () => {
      try {
        // Use Open-Meteo reverse geocoding via a nearby city lookup
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${position.lat}&lon=${position.lon}&format=json`
        )
        const data = await res.json()
        const name = [
          data.address?.city || data.address?.town || data.address?.village || data.address?.county,
          data.address?.country_code?.toUpperCase(),
        ]
          .filter(Boolean)
          .join(', ')

        addLocation({ name: name || 'My Location', lat: position.lat, lon: position.lon })
      } catch {
        addLocation({ name: 'My Location', lat: position.lat, lon: position.lon })
      }
    })()
  }, [position])

  return (
    <div className="min-h-screen bg-dark-navy text-mint-green">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-dark-navy/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo */}
          <a
            href="https://github.com/JoeMighty/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-display text-xl font-bold text-mint-green hover:text-neon-green transition-colors"
            aria-label="STRM by Jobin Bennykutty"
          >
            <Cloud size={22} className="text-primary-purple" />
            STRM
          </a>

          {/* Location manager */}
          <div className="flex-1 flex justify-center">
            <LocationManager onDetect={detect} detecting={detecting} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWidget((v) => !v)}
              className="btn-ghost p-2 rounded-xl"
              title="Widget generator"
              aria-label="Open widget generator"
            >
              <Code2 size={18} />
            </button>
            <a
              href="https://github.com/JoeMighty/STRM"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost p-2 rounded-xl"
              aria-label="View on GitHub"
            >
              <Github size={18} />
            </a>
          </div>
        </div>
      </header>

      {/* Error banner */}
      {(error || geoError) && (
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <div className="flex items-start gap-3 glass border border-alert-red/20 rounded-xl p-4">
            <AlertCircle size={16} className="text-alert-red shrink-0 mt-0.5" />
            <p className="text-sm text-mint-green/80 flex-1">{error || geoError}</p>
            <button
              onClick={clearError}
              className="text-mint-green/40 hover:text-mint-green text-xs"
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Empty state */}
        {locations.length === 0 && !detecting && (
          <div className="glass rounded-2xl p-12 text-center">
            <Cloud size={48} className="text-primary-purple mx-auto mb-4 opacity-60" />
            <h2 className="font-display text-xl font-semibold text-mint-green mb-2">
              No location set
            </h2>
            <p className="text-mint-green/50 text-sm mb-6">
              Allow location access or search for a city to get started.
            </p>
            <button
              onClick={detect}
              className="btn-primary"
            >
              Detect My Location
            </button>
          </div>
        )}

        {/* Detecting state */}
        {detecting && locations.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="w-10 h-10 border-2 border-primary-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-mint-green/60 text-sm">Detecting your location…</p>
          </div>
        )}

        {/* Weather content */}
        {locations.length > 0 && (
          <>
            <WeatherCard />
            <Forecast />
          </>
        )}

        {/* Widget generator */}
        {showWidget && locations.length > 0 && (
          <WidgetGenerator onClose={() => setShowWidget(false)} />
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 pb-8 pt-4 border-t border-white/5 mt-8">
        <p className="text-xs text-mint-green/30 text-center">
          STRM — Created by{' '}
          <a
            href="https://github.com/JoeMighty/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-purple hover:text-mint-green transition-colors"
          >
            Jobin Bennykutty
          </a>{' '}
          · Powered by{' '}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-mint-green transition-colors"
          >
            Open-Meteo
          </a>
        </p>
      </footer>
    </div>
  )
}
