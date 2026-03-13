/**
 * STRM - Animated Weather App
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/
 */

import { useState } from 'react'
import { MapPin, X, Plus, Locate, ChevronDown } from 'lucide-react'
import { useWeatherStore } from '../store/weatherStore'
import { searchLocations } from '../utils/api'
import SearchBar from './SearchBar'

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/

export default function LocationManager({ onDetect, detecting }) {
  const [showSearch, setShowSearch] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const { locations, activeLocationId, setActiveLocation, removeLocation } = useWeatherStore()
  const activeLocation = locations.find((l) => l.id === activeLocationId)

  const handleSwitch = (id) => {
    setActiveLocation(id)
    setShowDropdown(false)
  }

  return (
    <div className="relative">
      {/* Active location pill + dropdown trigger */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowDropdown((v) => !v)}
          className="flex items-center gap-2 glass glass-hover px-3 py-2 rounded-xl text-sm font-medium text-mint-green"
          aria-haspopup="listbox"
          aria-expanded={showDropdown}
        >
          <MapPin size={14} className="text-primary-purple" />
          <span className="max-w-[140px] truncate">
            {activeLocation?.name || 'No location'}
          </span>
          <ChevronDown size={14} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {/* Detect location button */}
        <button
          onClick={onDetect}
          disabled={detecting}
          className="btn-ghost p-2 rounded-xl"
          title="Auto-detect location"
          aria-label="Auto-detect my location"
        >
          <Locate size={16} className={detecting ? 'animate-pulse text-neon-green' : ''} />
        </button>

        {/* Add location button */}
        <button
          onClick={() => { setShowSearch((v) => !v); setShowDropdown(false) }}
          className="btn-ghost p-2 rounded-xl"
          title="Add location"
          aria-label="Add a new location"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Location dropdown */}
      {showDropdown && locations.length > 0 && (
        <div className="absolute top-full mt-2 left-0 z-50 glass rounded-xl min-w-[220px] overflow-hidden shadow-xl">
          <ul role="listbox" aria-label="Saved locations">
            {locations.map((loc) => (
              <li key={loc.id}>
                <div className="flex items-center">
                  <button
                    onClick={() => handleSwitch(loc.id)}
                    className={`flex-1 flex items-center gap-2 px-4 py-3 text-left text-sm transition-colors hover:bg-white/5 ${
                      loc.id === activeLocationId ? 'text-neon-green font-medium' : 'text-mint-green'
                    }`}
                    role="option"
                    aria-selected={loc.id === activeLocationId}
                  >
                    <MapPin size={12} className={loc.id === activeLocationId ? 'text-neon-green' : 'text-primary-purple'} />
                    <span className="truncate">{loc.name}</span>
                  </button>
                  {locations.length > 1 && (
                    <button
                      onClick={() => removeLocation(loc.id)}
                      className="p-3 text-mint-green/30 hover:text-alert-red transition-colors"
                      aria-label={`Remove ${loc.name}`}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {locations.length < 5 && (
            <div className="border-t border-white/10 px-4 py-2">
              <p className="text-xs text-mint-green/40">{locations.length}/5 locations saved</p>
            </div>
          )}
        </div>
      )}

      {/* Search panel */}
      {showSearch && (
        <div className="absolute top-full mt-2 left-0 z-50 glass rounded-xl p-4 w-80 shadow-xl">
          <SearchBar onClose={() => setShowSearch(false)} />
        </div>
      )}

      {/* Overlay to close dropdowns */}
      {(showDropdown || showSearch) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowDropdown(false); setShowSearch(false) }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
