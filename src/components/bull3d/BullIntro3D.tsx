import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from 'react'
import { useApp } from '../../app-context'
import { BullScene } from './BullScene'
import { getIntroQuality } from './quality'
import { useIntroTimeline, type IntroState } from './useIntroTimeline'

const LOGO_SRC = './brand/bullu-mark.png'

interface BullIntro3DProps {
  onComplete?: () => void
}

interface StageBoundaryProps {
  children: ReactNode
  onError: () => void
}

class StageBoundary extends Component<StageBoundaryProps, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.props.onError()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function BullIntro3D({ onComplete }: BullIntro3DProps) {
  const { t } = useApp()
  const quality = useMemo(() => getIntroQuality(), [])
  const stateRef = useRef<IntroState>({
    form: 0,
    run: 0,
    charge: 0,
    impact: 0,
    fade: 1,
  })
  const progressRef = useRef<HTMLDivElement>(null)
  const startedRef = useRef(false)
  const logoRef = useRef(false)
  const finishedRef = useRef(false)
  const closeTimerRef = useRef<number | null>(null)
  const webglRef = useRef<boolean | null>(null)
  const [ready, setReady] = useState(false)
  const [logo, setLogo] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [closed, setClosed] = useState(false)
  const [failed, setFailed] = useState(false)

  const debugTime = useMemo(() => {
    const value = new URLSearchParams(window.location.search).get('introAt')
    if (value == null) return null
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }, [])

  const reducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    setLeaving(true)
    closeTimerRef.current = window.setTimeout(() => {
      setClosed(true)
      onComplete?.()
    }, 760)
  }, [onComplete])

  const handleProgress = useCallback((progress: number) => {
    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${Math.max(0.001, progress)})`
    }
    if (progress > 0.74 && !logoRef.current) {
      logoRef.current = true
      setLogo(true)
    }
  }, [])

  const { play, skip } = useIntroTimeline(stateRef, {
    onFinish: finish,
    onProgress: handleProgress,
    debugTime,
  })

  useEffect(() => {
    webglRef.current = hasWebGL()
    if (!webglRef.current) {
      setFailed(true)
      setLogo(true)
      const timer = window.setTimeout(finish, 900)
      return () => window.clearTimeout(timer)
    }
    if (reducedMotion) {
      setLogo(true)
      setReady(true)
      const timer = window.setTimeout(finish, 1200)
      return () => window.clearTimeout(timer)
    }
    if (debugTime != null) {
      startedRef.current = true
      play()
      if (debugTime > 3.6) {
        logoRef.current = true
        setLogo(true)
      }
    }
    return undefined
  }, [debugTime, finish, play, reducedMotion])

  useEffect(() => {
    if (!ready || startedRef.current || reducedMotion || debugTime != null) return
    startedRef.current = true
    play()
  }, [debugTime, play, ready, reducedMotion])

  useEffect(() => {
    if (ready || failed) return
    const timer = window.setTimeout(() => {
      if (!ready) {
        setFailed(true)
        setLogo(true)
        finish()
      }
    }, 9000)
    return () => window.clearTimeout(timer)
  }, [failed, finish, ready])

  useEffect(
    () => () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)
    },
    [],
  )

  if (closed) return null

  return (
    <div
      className={`bull-intro3d${leaving ? ' is-leaving' : ''}${logo ? ' has-brand' : ''}`}
      role="dialog"
      aria-label={t('BullU 3D 开场动画')}
    >
      <div className="bull-intro3d__backdrop" aria-hidden="true" />
      <div className="bull-intro3d__grain" aria-hidden="true" />

      {webglRef.current !== false && !failed && (
        <StageBoundary onError={() => {
          setFailed(true)
          setLogo(true)
          finish()
        }}>
          <BullScene
            stateRef={stateRef}
            quality={quality}
            onReady={() => setReady(true)}
          />
        </StageBoundary>
      )}

      <div className={`bull-intro3d__prelude${ready ? ' is-hidden' : ''}`} aria-hidden="true">
        <img src={LOGO_SRC} alt="" />
        <span className="bull-intro3d__prelude-line" />
        <small>FORMING THE BULL</small>
      </div>

      <div className={`bull-intro3d__brand${logo ? ' is-visible' : ''}`} aria-hidden={!logo}>
        <span className="bull-intro3d__brand-kicker">BULLU · UKM BANGI</span>
        <img src={LOGO_SRC} alt="BullU" />
        <h2>YOUR CAMPUS. YOUR LIFE. ALL IN ONE.</h2>
      </div>

      <div className="bull-intro3d__hud" aria-hidden="true">
        <span>BULLU · UKM BANGI</span>
        <span>3D / CAMPUS IN MOTION</span>
      </div>

      <div className="bull-intro3d__progress" aria-hidden="true">
        <div ref={progressRef} className="bull-intro3d__progress-fill" />
      </div>

      <button className="bull-intro3d__skip" type="button" onClick={skip}>
        {t('跳过开场')}
        <span aria-hidden="true">↗</span>
      </button>
    </div>
  )
}
