/**
 * STRM - Animated Weather App
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { fetchWeather, fetchAirQuality } from '../utils/api'

const MAX_LOCATIONS = 5

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

export const useWeatherStore = create(
  persist(
    (set, get) => ({
      // --- Persisted state ---
      locations: [],           // [{ id, name, lat, lon, isDefault }]
      activeLocationId: null,
      units: 'metric',         // 'metric' | 'imperial'

      // --- Transient state ---
      weatherData: {},         // { [locationId]: { current, daily, airQuality, fetchedAt } }
      loading: false,
      error: null,

      // --- Actions ---

      /** Add a location (max 5). Sets as active if it's the first. */
      addLocation(location) {
        const { locations } = get()
        if (locations.length >= MAX_LOCATIONS) {
          set({ error: `Maximum of ${MAX_LOCATIONS} locations allowed.` })
          return false
        }
        if (locations.some((l) => Math.abs(l.lat - location.lat) < 0.01 && Math.abs(l.lon - location.lon) < 0.01)) {
          set({ error: 'This location is already saved.' })
          return false
        }
        const id = generateId()
        const isDefault = locations.length === 0
        const newLocation = { ...location, id, isDefault }
        set((state) => ({
          locations: [...state.locations, newLocation],
          activeLocationId: state.activeLocationId || id,
          error: null,
        }))
        get().fetchWeatherForLocation(id)
        return true
      },

      /** Remove a location by id. */
      removeLocation(id) {
        set((state) => {
          const next = state.locations.filter((l) => l.id !== id)
          const nextWeatherData = { ...state.weatherData }
          delete nextWeatherData[id]
          const nextActive =
            state.activeLocationId === id
              ? (next[0]?.id || null)
              : state.activeLocationId
          return { locations: next, activeLocationId: nextActive, weatherData: nextWeatherData }
        })
      },

      /** Switch active location. */
      setActiveLocation(id) {
        set({ activeLocationId: id })
        const { weatherData } = get()
        // Refresh if stale (> 15 min)
        const data = weatherData[id]
        if (!data || Date.now() - data.fetchedAt > 15 * 60 * 1000) {
          get().fetchWeatherForLocation(id)
        }
      },

      /** Toggle temperature units. */
      toggleUnits() {
        set((state) => ({ units: state.units === 'metric' ? 'imperial' : 'metric' }))
      },

      /** Fetch weather for a specific location id. */
      async fetchWeatherForLocation(id) {
        const { locations } = get()
        const loc = locations.find((l) => l.id === id)
        if (!loc) return

        set({ loading: true, error: null })
        try {
          const [weather, air] = await Promise.all([
            fetchWeather(loc.lat, loc.lon),
            fetchAirQuality(loc.lat, loc.lon),
          ])
          set((state) => ({
            weatherData: {
              ...state.weatherData,
              [id]: {
                current: weather.current,
                daily: weather.daily,
                timezone: weather.timezone,
                airQuality: air?.current || null,
                fetchedAt: Date.now(),
              },
            },
            loading: false,
          }))
        } catch (err) {
          set({ error: err.message, loading: false })
        }
      },

      /** Refresh weather for the active location. */
      async refreshActive() {
        const { locations, activeLocationId } = get()
        const loc = locations.find((l) => l.id === activeLocationId) || locations[0] || null
        if (loc) await get().fetchWeatherForLocation(loc.id)
      },

      /** Clear transient error. */
      clearError() {
        set({ error: null })
      },
    }),
    {
      name: 'strm-weather-storage',
      // Only persist locations, active id, and units — not live weather data
      partialize: (state) => ({
        locations: state.locations,
        activeLocationId: state.activeLocationId,
        units: state.units,
      }),
    }
  )
)

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/
