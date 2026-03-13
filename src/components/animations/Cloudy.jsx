/**
 * STRM - Animated Weather App
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/
 */

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/

const CLOUDS = [
  { top: '10%', size: 120, opacity: 0.12, duration: 30, delay: 0 },
  { top: '20%', size: 80,  opacity: 0.08, duration: 45, delay: -10 },
  { top: '5%',  size: 160, opacity: 0.07, duration: 55, delay: -20 },
  { top: '35%', size: 90,  opacity: 0.10, duration: 38, delay: -5 },
  { top: '15%', size: 110, opacity: 0.09, duration: 50, delay: -15 },
]

function Cloud({ top, size, opacity, duration, delay }) {
  return (
    <div
      className="absolute"
      style={{
        top,
        left: '-20%',
        opacity,
        animation: `cloudDrift ${duration}s linear ${delay}s infinite`,
        willChange: 'transform',
      }}
      aria-hidden="true"
    >
      {/* Main cloud body */}
      <div
        className="relative rounded-full"
        style={{
          width: size,
          height: size * 0.5,
          background: 'rgba(200,220,240,0.9)',
          filter: 'blur(2px)',
        }}
      >
        <div
          className="absolute -top-1/3 left-1/4 rounded-full"
          style={{ width: size * 0.55, height: size * 0.55, background: 'rgba(200,220,240,0.9)', filter: 'blur(2px)' }}
        />
        <div
          className="absolute -top-1/4 right-1/4 rounded-full"
          style={{ width: size * 0.4, height: size * 0.4, background: 'rgba(200,220,240,0.9)', filter: 'blur(2px)' }}
        />
      </div>
    </div>
  )
}

export default function Cloudy() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {CLOUDS.map((c, i) => <Cloud key={i} {...c} />)}
      <style>{`
        @keyframes cloudDrift {
          from { transform: translateX(0); }
          to { transform: translateX(130vw); }
        }
      `}</style>
    </div>
  )
}
