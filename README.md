# STRM — Animated Weather App

> A dark-mode-only animated weather web app with embeddable widgets and Home Assistant integration.

**Live Demo**: [https://joemighty.github.io/STRM](https://joemighty.github.io/STRM)

---

## Features

- **Auto-detect location** on first load
- **Multi-location support** (up to 5) — add, remove, switch
- **Current weather**: temperature, feels like, humidity, wind, pressure, precipitation
- **7-day forecast** with precipitation probability
- **8 animated weather backgrounds** — Rain, Snow, Stormy, Sunny, Cloudy, Partly Cloudy, Windy, Foggy
- **Celsius / Fahrenheit toggle**
- **Air Quality Index** (AQI) display
- **Embeddable widget generator** with iframe embed code
- **Home Assistant integration** — custom weather entity + Lovelace card
- No API key required — powered by [Open-Meteo](https://open-meteo.com/)

---

## Tech Stack

- React 18 + Vite
- Tailwind CSS (dark mode only)
- Zustand (state management)
- Canvas API + CSS animations (60fps)
- Open-Meteo API (free, unlimited)

---

## Development Setup

```bash
# Clone the repo
git clone https://github.com/JoeMighty/STRM.git
cd STRM

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Widget Embed Guide

1. Open the app and click the `</>` icon in the header
2. Select a location and size preset
3. Copy the generated `<iframe>` code
4. Paste into any website

**Example**:
```html
<iframe
  src="https://joemighty.github.io/STRM/widget.html?lat=52.58&lon=-1.98&name=Walsall&refresh=15"
  width="400"
  height="300"
  frameborder="0"
  style="border-radius: 8px;"
  title="STRM Weather Widget"
></iframe>
```

**Widget URL Parameters**:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `lat` | Latitude (required) | — |
| `lon` | Longitude (required) | — |
| `name` | Location display name | `Weather` |
| `units` | `metric` or `imperial` | `metric` |
| `refresh` | Auto-refresh in minutes (min 5) | `15` |

**Minimum sizes**: 200×200px

---

## Home Assistant Installation

### Custom Component (backend integration)

**Via HACS:**
1. Open HACS → Integrations → ⋮ → Custom repositories
2. Add `https://github.com/JoeMighty/STRM` (category: Integration)
3. Install "STRM Weather" → Restart HA
4. Go to **Settings → Devices & Services → Add Integration → STRM Weather**
5. Enter your location name, latitude, and longitude

**Manual:**
1. Copy `home-assistant/custom_components/strm/` → your HA `custom_components/` directory
2. Restart HA → add via Settings → Devices & Services

---

### Lovelace Card (STRM animated widget)

The Lovelace card embeds the STRM animated weather widget directly in your dashboard.

**Manual installation:**
1. Copy `home-assistant/www/strm-weather-card.js` → your HA `www/` directory
   (e.g. `/config/www/strm-weather-card.js`)
2. In HA go to **Settings → Dashboards → ⋮ → Resources**
3. Add resource: `/local/strm-weather-card.js` (type: JavaScript module)
4. Reload the browser

**Card configuration:**

```yaml
type: custom:strm-weather-card
lat: 52.58
lon: -1.98
name: Walsall
units: metric   # metric | imperial
refresh: 15     # auto-refresh in minutes
height: 420     # iframe height in px (optional, default 420)
```

Or link it to a STRM weather entity (auto-reads lat/lon):

```yaml
type: custom:strm-weather-card
entity: weather.strm_52_58__1_98
height: 420
```

---

## Color Palette

| Name | Hex |
|------|-----|
| Dark Navy | `#0A0618` |
| Primary Purple | `#5601D6` |
| Neon Green | `#17EC1C` |
| Mint Green | `#DAE9DF` |
| Alert Red | `#F70D0D` |

---

## Performance Targets

- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Animation Frame Rate: 60fps
- Bundle Size: ~187KB JS (59KB gzipped)
- Lighthouse Score: 90+

---

## Contributing

Pull requests welcome. Please follow the existing code style and include credits.

---

## Credits

Created by [Jobin Bennykutty](https://github.com/JoeMighty/)

Powered by [Open-Meteo](https://open-meteo.com/) — no API key required.

## License

MIT License — see LICENSE file for details.
