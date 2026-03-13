/**
 * STRM - Animated Weather App
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/
 */

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/

const FOG_LAYERS = [
  { top: '20%', opacity: 0.12, duration: 18, delay: 0,   blur: 20 },
  { top: '40%', opacity: 0.15, duration: 24, delay: -6,  blur: 30 },
  { top: '60%', opacity: 0.10, duration: 20, delay: -10, blur: 25 },
  { top: '75%', opacity: 0.18, duration: 28, delay: -4,  blur: 35 },
  { top: '10%', opacity: 0.08, duration: 32, delay: -14, blur: 15 },
]

export default function Foggy() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Base fog tint */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(180,200,210,0.05), rgba(140,170,190,0.08))' }}
      />
      {/* Moving fog banks */}
      {FOG_LAYERS.map((f, i) => (
        <div
          key={i}
          className="absolute w-full"
          style={{
            top: f.top,
            height: '30%',
            opacity: f.opacity,
            background: 'linear-gradient(to right, transparent 0%, rgba(210,230,240,0.9) 20%, rgba(210,230,240,0.9) 80%, transparent 100%)',
            filter: `blur(${f.blur}px)`,
            animation: `fogDrift ${f.duration}s ease-in-out ${f.delay}s infinite alternate`,
            willChange: 'transform',
          }}
        />
      ))}
      <style>{`
        @keyframes fogDrift {
          from { transform: translateX(-8%); }
          to   { transform: translateX(8%); }
        }
      `}</style>
    </div>
  )
}
