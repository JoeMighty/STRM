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

### Via HACS (recommended)

1. Open HACS → Integrations
2. Click "Custom repositories"
3. Add: `https://github.com/JoeMighty/STRM` (category: Integration)
4. Install "STRM Weather"
5. Restart Home Assistant
6. Go to **Settings → Devices & Services → Add Integration → STRM Weather**
7. Enter your location name, latitude, and longitude

### Manual Installation

1. Copy `home-assistant/custom_components/strm/` to your HA `custom_components/` directory
2. Restart Home Assistant
3. Add via Settings → Devices & Services

### Configuration

```yaml
# In your Lovelace dashboard
type: weather-forecast
entity: weather.strm_my_location
show_forecast: true
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
