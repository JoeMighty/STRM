/**
 * STRM - Animated Weather App
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/
 */

import { useState } from 'react'
import { Copy, Check, X, Code2 } from 'lucide-react'
import { useWeatherStore } from '../store/weatherStore'

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/

const PRESETS = [
  { label: 'Small Card',      width: 200,  height: 200 },
  { label: 'Medium Banner',   width: 400,  height: 200 },
  { label: 'Large Dashboard', width: 600,  height: 400 },
  { label: 'Custom',          width: null, height: null },
]

const MIN_W = 200
const MIN_H = 200

export default function WidgetGenerator({ onClose }) {
  const { locations, activeLocationId } = useWeatherStore()
  const [preset, setPreset] = useState(0)
  const [width, setWidth] = useState(400)
  const [height, setHeight] = useState(300)
  const [locationId, setLocationId] = useState(activeLocationId || locations[0]?.id || '')
  const [copied, setCopied] = useState(false)

  const isCustom = PRESETS[preset].label === 'Custom'
  const w = isCustom ? Math.max(MIN_W, width) : PRESETS[preset].width
  const h = isCustom ? Math.max(MIN_H, height) : PRESETS[preset].height

  const activeLoc = locations.find((l) => l.id === locationId) || locations[0]
  const widgetSrc = activeLoc
    ? `https://joemighty.github.io/STRM/widget.html?lat=${activeLoc.lat}&lon=${activeLoc.lon}&name=${encodeURIComponent(activeLoc.name)}&refresh=15`
    : 'https://joemighty.github.io/STRM/widget.html'

  const embedCode = `<iframe
  src="${widgetSrc}"
  width="${w}"
  height="${h}"
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"
  title="STRM Weather Widget"
></iframe>`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePreset = (i) => {
    setPreset(i)
    if (PRESETS[i].width) {
      setWidth(PRESETS[i].width)
      setHeight(PRESETS[i].height)
    }
  }

  return (
    <div className="glass rounded-2xl p-6 max-w-lg w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Code2 size={18} className="text-primary-purple" />
          <h2 className="font-display text-lg font-semibold text-mint-green">Widget Generator</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg" aria-label="Close">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Location selector */}
      <div className="mb-4">
        <label className="stat-label block mb-2">Location</label>
        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className="input-field"
          aria-label="Select widget location"
        >
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>
      </div>

      {/* Size presets */}
      <div className="mb-4">
        <label className="stat-label block mb-2">Size</label>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p, i) => (
            <button
              key={p.label}
              onClick={() => handlePreset(i)}
              className={`px-3 py-2 rounded-xl text-sm border transition-all ${
                preset === i
                  ? 'border-primary-purple text-mint-green bg-primary-purple/20'
                  : 'border-white/10 text-mint-green/60 hover:border-white/20'
              }`}
            >
              {p.label}
              {p.width && <span className="block text-xs opacity-60">{p.width}×{p.height}px</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Custom size controls */}
      {isCustom && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="stat-label block mb-1">Width (min {MIN_W}px)</label>
            <input
              type="number"
              value={width}
              min={MIN_W}
              max={1920}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="input-field"
              aria-label="Widget width in pixels"
            />
          </div>
          <div>
            <label className="stat-label block mb-1">Height (min {MIN_H}px)</label>
            <input
              type="number"
              value={height}
              min={MIN_H}
              max={1080}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="input-field"
              aria-label="Widget height in pixels"
            />
          </div>
        </div>
      )}

      {/* Preview info */}
      <div className="text-xs text-mint-green/40 mb-4">
        Output: {w} × {h}px · Auto-refresh: 15 min
      </div>

      {/* Embed code */}
      <div className="relative">
        <pre className="glass rounded-xl p-4 text-xs text-mint-green/80 overflow-x-auto whitespace-pre-wrap break-all font-mono leading-relaxed">
          {embedCode}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 btn-ghost p-1.5 rounded-lg flex items-center gap-1.5 text-xs"
          aria-label="Copy embed code"
        >
          {copied ? <Check size={14} className="text-neon-green" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
