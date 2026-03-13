/**
 * STRM - Animated Weather App
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/
 */

import Sunny from './Sunny'
import Cloudy from './Cloudy'

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/

export default function PartlyCloudy() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Sunny />
      <Cloudy />
    </div>
  )
}
