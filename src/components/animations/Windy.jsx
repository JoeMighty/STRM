/**
 * STRM - Animated Weather App
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/
 */

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/

const STREAKS = [
  { top: '15%', width: 200, delay: 0,    duration: 2.5, opacity: 0.15 },
  { top: '28%', width: 300, delay: 0.4,  duration: 3.0, opacity: 0.10 },
  { top: '42%', width: 180, delay: 0.9,  duration: 2.2, opacity: 0.12 },
  { top: '55%', width: 250, delay: 1.3,  duration: 2.8, opacity: 0.09 },
  { top: '68%', width: 160, delay: 0.2,  duration: 2.0, opacity: 0.13 },
  { top: '78%', width: 280, delay: 0.7,  duration: 3.2, opacity: 0.08 },
  { top: '22%', width: 140, delay: 1.6,  duration: 1.8, opacity: 0.11 },
  { top: '85%', width: 320, delay: 0.5,  duration: 3.5, opacity: 0.07 },
]

export default function Windy() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {STREAKS.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: s.top,
            left: '-10%',
            width: s.width,
            height: 2,
            background: `linear-gradient(to right, transparent, rgba(218, 233, 223, ${s.opacity}), transparent)`,
            animation: `windStreak ${s.duration}s ease-in-out ${s.delay}s infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
      {/* Swaying particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={`p${i}`}
          className="absolute w-1 h-1 rounded-full opacity-20"
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${Math.random() * 100}%`,
            background: '#DAE9DF',
            animation: `windParticle ${1.5 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes windStreak {
          0%   { transform: translateX(0) scaleX(0.5); opacity: 0; }
          30%  { opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: translateX(120vw) scaleX(1.2); opacity: 0; }
        }
        @keyframes windParticle {
          0%   { transform: translateX(0) translateY(0); opacity: 0.2; }
          50%  { transform: translateX(60px) translateY(-8px); opacity: 0.5; }
          100% { transform: translateX(120px) translateY(4px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
