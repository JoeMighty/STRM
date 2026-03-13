/**
 * STRM - Animated Weather App
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/
 */

import { useEffect, useRef, useState } from 'react'
import { useAnimationPerformance } from '../../hooks/useAnimationPerformance'
import Rain from './Rain'

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/

export default function Stormy() {
  const canvasRef = useRef(null)
  const quality = useAnimationPerformance()
  const [lightning, setLightning] = useState(false)

  // Lightning flash effect
  useEffect(() => {
    let timeout
    const scheduleLightning = () => {
      const delay = 3000 + Math.random() * 7000
      timeout = setTimeout(() => {
        setLightning(true)
        setTimeout(() => setLightning(false), 80 + Math.random() * 100)
        scheduleLightning()
      }, delay)
    }
    scheduleLightning()
    return () => clearTimeout(timeout)
  }, [])

  // Lightning bolt on canvas
  useEffect(() => {
    if (!lightning) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const drawBolt = (x, y, angle, length, depth) => {
      if (depth === 0 || length < 5) return
      const endX = x + Math.cos(angle) * length
      const endY = y + Math.sin(angle) * length
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(endX, endY)
      ctx.strokeStyle = `rgba(255, 230, 100, ${0.5 + depth * 0.1})`
      ctx.lineWidth = depth * 0.8
      ctx.stroke()
      // Two branches
      drawBolt(endX, endY, angle + 0.4, length * 0.65, depth - 1)
      drawBolt(endX, endY, angle - 0.2, length * 0.75, depth - 1)
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const startX = canvas.width * (0.2 + Math.random() * 0.6)
    drawBolt(startX, 0, Math.PI / 2, canvas.height * 0.35, quality === 'low' ? 4 : 6)

    const fadeOut = setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }, 120)

    return () => clearTimeout(fadeOut)
  }, [lightning, quality])

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {/* Heavy rain */}
      <Rain intensity="heavy" />
      {/* Lightning overlay */}
      {lightning && (
        <div className="absolute inset-0 bg-purple-200/10 pointer-events-none transition-opacity duration-75" />
      )}
      {/* Lightning bolt canvas */}
      <canvas
        ref={canvasRef}
        className="weather-canvas w-full h-full"
        aria-hidden="true"
      />
    </div>
  )
}
