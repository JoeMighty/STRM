/**
 * STRM - Animated Weather App
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/
 */

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/

export default function Sunny() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #FFD700, #FF8C00, transparent 70%)' }}
      />
      {/* Sun body */}
      <div className="absolute top-8 right-12 w-24 h-24 flex items-center justify-center">
        <div
          className="w-16 h-16 rounded-full"
          style={{
            background: 'radial-gradient(circle, #FFE566, #FFB800)',
            boxShadow: '0 0 40px 10px rgba(255, 200, 50, 0.4)',
            animation: 'sunPulse 4s ease-in-out infinite',
          }}
        />
        {/* Rotating rays */}
        <div
          className="absolute w-24 h-24"
          style={{ animation: 'spin 20s linear infinite' }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-10 -mt-5 -ml-0.5 rounded-full opacity-40"
              style={{
                background: 'linear-gradient(to top, transparent, #FFD700)',
                transform: `rotate(${i * 45}deg) translateY(-100%)`,
                transformOrigin: 'center bottom',
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes sunPulse {
          0%, 100% { box-shadow: 0 0 40px 10px rgba(255, 200, 50, 0.4); }
          50% { box-shadow: 0 0 60px 20px rgba(255, 200, 50, 0.6); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
