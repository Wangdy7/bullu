export interface IntroQuality {
  particleCount: number
  dpr: [number, number]
  pointSize: number
  bloom: boolean
  antialias: boolean
}

export function getIntroQuality(): IntroQuality {
  const mobile = window.innerWidth < 720
  const lowMemory = typeof navigator !== 'undefined' && 'deviceMemory' in navigator
    ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined &&
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory! <= 4
    : false
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return {
    particleCount: mobile ? 6500 : 14000,
    dpr: mobile ? [1, 1.55] : [1, lowMemory ? 1.6 : 2],
    pointSize: mobile ? 1.95 : 2.2,
    bloom: !mobile && !lowMemory && !reduced,
    antialias: !mobile,
  }
}
