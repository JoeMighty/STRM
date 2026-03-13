/**
 * STRM Weather Card — Home Assistant Lovelace Custom Card
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/STRM
 *
 * Renders the STRM animated weather widget inside a Lovelace card.
 *
 * Card config:
 *   type: custom:strm-weather-card
 *   lat: 52.58          # required (unless entity is set)
 *   lon: -1.98          # required (unless entity is set)
 *   name: Walsall       # optional display name
 *   units: metric       # optional: metric (default) | imperial
 *   refresh: 15         # optional: auto-refresh interval in minutes (default 15)
 *   height: 420         # optional: iframe height in px (default 420)
 *   entity: weather.strm_52_58__1_98  # optional: HA weather entity to read lat/lon from
 */

const WIDGET_BASE = 'https://joemighty.github.io/STRM/widget.html'
const CARD_VERSION = '1.0.0'

class StrmWeatherCard extends HTMLElement {
  constructor() {
    super()
    this._config = null
    this._built = false
  }

  static getStubConfig() {
    return {
      lat: 52.58,
      lon: -1.98,
      name: 'My Location',
      units: 'metric',
      refresh: 15,
    }
  }

  setConfig(config) {
    if (!config.entity && (config.lat === undefined || config.lon === undefined)) {
      throw new Error('STRM card: either "entity" or both "lat" and "lon" are required.')
    }
    this._config = config
    this._built = false
    this._build()
  }

  set hass(hass) {
    this._hass = hass
    if (!this._built) {
      this._build()
    }
  }

  _resolveCoords() {
    const cfg = this._config
    if (cfg.entity && this._hass) {
      const state = this._hass.states[cfg.entity]
      if (state && state.attributes) {
        const lat = state.attributes.latitude ?? cfg.lat
        const lon = state.attributes.longitude ?? cfg.lon
        const name = cfg.name || state.attributes.friendly_name || state.entity_id
        return { lat, lon, name }
      }
    }
    return {
      lat: cfg.lat,
      lon: cfg.lon,
      name: cfg.name || '',
    }
  }

  _buildUrl(lat, lon, name) {
    const url = new URL(WIDGET_BASE)
    url.searchParams.set('lat', lat)
    url.searchParams.set('lon', lon)
    if (name) url.searchParams.set('name', name)
    url.searchParams.set('units', this._config.units || 'metric')
    url.searchParams.set('refresh', String(this._config.refresh ?? 15))
    return url.toString()
  }

  _build() {
    if (!this._config) return
    const { lat, lon, name } = this._resolveCoords()
    if (lat === undefined || lon === undefined) return

    const height = this._config.height ?? 420
    const src = this._buildUrl(lat, lon, name)

    if (this._iframe && this._iframe.src === src) return

    // Clear and rebuild
    this.innerHTML = ''
    const card = document.createElement('ha-card')
    card.style.cssText = 'overflow:hidden;border-radius:var(--ha-card-border-radius,12px);'

    const iframe = document.createElement('iframe')
    iframe.src = src
    iframe.title = `STRM Weather — ${name || `${lat},${lon}`}`
    iframe.allow = 'geolocation'
    iframe.style.cssText = `width:100%;height:${height}px;border:none;display:block;`
    iframe.loading = 'lazy'

    card.appendChild(iframe)
    this.appendChild(card)
    this._iframe = iframe
    this._built = true
  }

  getCardSize() {
    const height = this._config?.height ?? 420
    return Math.ceil(height / 50)
  }
}

customElements.define('strm-weather-card', StrmWeatherCard)

window.customCards = window.customCards || []
window.customCards.push({
  type: 'strm-weather-card',
  name: 'STRM Weather Card',
  description: 'Animated weather card powered by STRM — open-meteo.com, no API key required.',
  preview: true,
  documentationURL: 'https://github.com/JoeMighty/STRM',
})

console.info(
  `%c STRM-WEATHER-CARD %c v${CARD_VERSION} `,
  'color:#17EC1C;background:#0A0618;font-weight:bold;',
  'color:#DAE9DF;background:#5601D6;'
)

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/
