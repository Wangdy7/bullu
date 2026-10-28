import { useCallback, useEffect, useRef, type MutableRefObject } from 'react'
import gsap from 'gsap'

export interface IntroState {
  form: number
  run: number
  charge: number
  impact: number
  fade: number
}

interface Options {
  onFinish: () => void
  onProgress?: (progress: number) => void
  debugTime?: number | null
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

function smoothstep(from: number, to: number, value: number) {
  const t = clamp01((value - from) / (to - from))
  return t * t * (3 - 2 * t)
}

export function useIntroTimeline(
  stateRef: MutableRefObject<IntroState>,
  { onFinish, onProgress, debugTime }: Options,
) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const finishRef = useRef(onFinish)
  const progressRef = useRef(onProgress)

  useEffect(() => {
    finishRef.current = onFinish
    progressRef.current = onProgress
  }, [onFinish, onProgress])

  const play = useCallback(() => {
    timelineRef.current?.kill()
    const state = stateRef.current
    state.form = 0
    state.run = 0
    state.charge = 0
    state.impact = 0
    state.fade = 1
    progressRef.current?.(0)

    if (debugTime != null) {
      const time = Math.min(5.1, Math.max(0, debugTime))
      state.form = smoothstep(0, 1.05, time)
      state.run = smoothstep(0.75, 2.05, time)
      state.charge = smoothstep(2.0, 3.35, time)
      state.impact = smoothstep(3.35, 4.05, time)
      state.fade = time < 3.82 ? 1 : 1 - smoothstep(3.82, 4.7, time)
      progressRef.current?.(time / 5.1)
      return
    }

    const timeline = gsap.timeline({
      onUpdate: () => progressRef.current?.(timeline.progress()),
    })
    timeline
      .to(state, { form: 1, duration: 1.05, ease: 'power2.out' }, 0)
      .to(state, { run: 1, duration: 1.45, ease: 'power1.inOut' }, 0.72)
      .to(state, { charge: 1, duration: 1.45, ease: 'power2.in' }, 2.0)
      .to(state, { impact: 1, duration: 0.7, ease: 'power4.in' }, 3.35)
      .to(state, { fade: 0, duration: 0.78, ease: 'power2.out' }, 3.82)
      .call(() => finishRef.current(), undefined, 4.86)
    timelineRef.current = timeline
  }, [debugTime, stateRef])

  const skip = useCallback(() => {
    timelineRef.current?.kill()
    timelineRef.current = null
    stateRef.current.fade = 0
    finishRef.current()
  }, [stateRef])

  useEffect(
    () => () => {
      timelineRef.current?.kill()
    },
    [],
  )

  return { play, skip }
}
