/**
 * STRM - Animated Weather App
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/
 */

import Rain from './Rain'
import Snow from './Snow'
import Stormy from './Stormy'
import Sunny from './Sunny'
import Cloudy from './Cloudy'
import PartlyCloudy from './PartlyCloudy'
import Windy from './Windy'
import Foggy from './Foggy'

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/

const ANIMATION_COMPONENTS = {
  rain: <Rain />,
  snow: <Snow />,
  stormy: <Stormy />,
  sunny: <Sunny />,
  cloudy: <Cloudy />,
  partlyCloudy: <PartlyCloudy />,
  windy: <Windy />,
  foggy: <Foggy />,
}

/** Renders the correct weather animation for the given type. */
export default function WeatherAnimation({ type }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl" aria-hidden="true">
      {ANIMATION_COMPONENTS[type] || ANIMATION_COMPONENTS.sunny}
    </div>
  )
}
