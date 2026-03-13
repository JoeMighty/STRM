/**
 * STRM - Animated Weather App
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/
 */

import { useEffect, useRef } from 'react'
import { useAnimationPerformance } from '../../hooks/useAnimationPerformance'

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/

export default function Rain({ intensity = 'moderate' }) {
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

    const dropCount = quality === 'low'
      ? { light: 40, moderate: 70, heavy: 100 }[intensity]
      : { light: 80, moderate: 150, heavy: 240 }[intensity]

    const drops = Array.from({ length: dropCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 6 + Math.random() * 8,
      length: 10 + Math.random() * 20,
      opacity: 0.3 + Math.random() * 0.4,
      width: 0.5 + Math.random() * 1,
    }))

    let rafId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      drops.forEach((d) => {
        ctx.beginPath()
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x - 1, d.y + d.length)
        ctx.strokeStyle = `rgba(174, 214, 241, ${d.opacity})`
        ctx.lineWidth = d.width
        ctx.stroke()

        d.y += d.speed
        d.x -= 0.5 // slight angle
        if (d.y > canvas.height) {
          d.y = -d.length
          d.x = Math.random() * canvas.width
        }
      })

      rafId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [intensity, quality])

  return (
    <canvas
      ref={canvasRef}
      className="weather-canvas w-full h-full"
      aria-hidden="true"
    />
  )
}
