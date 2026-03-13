/**
 * STRM - Animated Weather App
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/
 */

import { useState, useRef, useEffect } from 'react'
import { Search, MapPin, Plus, Loader2 } from 'lucide-react'
import { searchLocations } from '../utils/api'
import { useWeatherStore } from '../store/weatherStore'

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  const { addLocation, locations, error, clearError } = useWeatherStore()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleInput = (e) => {
    const val = e.target.value
    setQuery(val)
    setSearchError(null)

    clearTimeout(debounceRef.current)
    if (val.trim().length < 2) {
      setResults([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await searchLocations(val.trim())
        setResults(res)
      } catch {
        setSearchError('Search failed. Please try again.')
      } finally {
        setSearching(false)
      }
    }, 400)
  }

  const handleAdd = (loc) => {
    const name = [loc.name, loc.admin1, loc.country_code].filter(Boolean).join(', ')
    const added = addLocation({ name, lat: loc.latitude, lon: loc.longitude })
    if (added && onClose) onClose()
  }

  const isAlreadySaved = (loc) =>
    locations.some(
      (l) => Math.abs(l.lat - loc.latitude) < 0.01 && Math.abs(l.lon - loc.longitude) < 0.01
    )

  return (
    <div className="flex flex-col gap-3">
      {/* Input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-mint-green/40"
        />
        {searching && (
          <Loader2
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-purple animate-spin"
          />
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInput}
          placeholder="Search city or location…"
          className="input-field pl-9 pr-9"
          aria-label="Search for a city"
          autoComplete="off"
        />
      </div>

      {/* Error */}
      {(searchError || error) && (
        <p className="text-alert-red text-sm px-1">{searchError || error}</p>
      )}

      {/* Results */}
      {results.length > 0 && (
        <ul className="glass rounded-xl overflow-hidden divide-y divide-white/5 max-h-64 overflow-y-auto" role="listbox">
          {results.map((loc) => {
            const saved = isAlreadySaved(loc)
            return (
              <li key={loc.id}>
                <button
                  onClick={() => !saved && handleAdd(loc)}
                  disabled={saved}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  role="option"
                  aria-selected={saved}
                >
                  <MapPin size={14} className="text-primary-purple shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-mint-green truncate">{loc.name}</p>
                    <p className="text-xs text-mint-green/50 truncate">
                      {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                  {!saved && (
                    <Plus size={14} className="text-neon-green shrink-0" />
                  )}
                  {saved && (
                    <span className="text-xs text-mint-green/40 shrink-0">Saved</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {query.length >= 2 && !searching && results.length === 0 && !searchError && (
        <p className="text-mint-green/50 text-sm text-center py-2">No results found.</p>
      )}
    </div>
  )
}
