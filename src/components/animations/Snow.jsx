/**
 * STRM - Animated Weather App
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/
 */

import { useEffect, useRef } from 'react'
import { useAnimationPerformance } from '../../hooks/useAnimationPerformance'

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/

export default function Snow() {
  const canvasRef = useRef(null)
  const quality = useAnimationPerformance()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const flakeCount = quality === 'low' ? 60 : 140

    const flakes = Array.from({ length: flakeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1 + Math.random() * 3,
      speed: 0.5 + Math.random() * 1.5,
      drift: (Math.random() - 0.5) * 0.5,
      opacity: 0.5 + Math.random() * 0.5,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02,
    }))

    let rafId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      flakes.forEach((f) => {
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220, 240, 255, ${f.opacity})`
        ctx.fill()

        f.y += f.speed
        f.x += f.drift + Math.sin(f.angle) * 0.3
        f.angle += f.spin

        if (f.y > canvas.height) {
          f.y = -f.r * 2
          f.x = Math.random() * canvas.width
        }
        if (f.x > canvas.width) f.x = 0
        if (f.x < 0) f.x = canvas.width
      })

      rafId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [quality])

  return (
    <canvas
      ref={canvasRef}
      className="weather-canvas w-full h-full"
      aria-hidden="true"
    />
  )
}
