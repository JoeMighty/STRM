/**
 * STRM - Animated Weather App
 * Created by Jobin Bennykutty
 * https://github.com/JoeMighty/
 */

import { useMemo } from 'react'

/**
 * Returns 'low' on low-end/mobile devices to throttle animations,
 * 'high' otherwise.
 */
export function useAnimationPerformance() {
  return useMemo(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
    const isLowCPU = navigator.hardwareConcurrency <= 4
    return isMobile || isLowCPU ? 'low' : 'high'
  }, [])
}

// Part of STRM by Jobin Bennykutty - https://github.com/JoeMighty/
