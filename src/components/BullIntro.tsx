import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useApp } from '../app-context'

const DURATION = 5.15
const FORM_END = 1.12
const CHARGE_END = 2.55
const IMPACT_END = 3.35
const REFORM_END = 4.55
const LOGO_SRC = 'brand/bullu-mark.png'

interface SampleSet {
  points: Array<{ x: number; y: number }>
  aspect: number
}

interface Particle {
  bull: THREE.Vector3
  logo: THREE.Vector3
  start: THREE.Vector3
  impact: THREE.Vector3
  dir: THREE.Vector3
  size: number
  delay: number
  seed: number
  bullColor: [number, number, number]
  logoColor: [number, number, number]
  isHorn: boolean
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount
const smoothstep = (min: number, max: number, value: number) => {
  const x = clamp((value - min) / (max - min))
  return x * x * (3 - 2 * x)
}
const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3)
const easeOutQuint = (value: number) => 1 - Math.pow(1 - value, 5)
const easeInCubic = (value: number) => value * value * value
const easeInOutCubic = (value: number) =>
  value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Could not load ${src}`))
    image.src = src
  })
}

function sampleMask(
  image: HTMLImageElement,
  count: number,
  crop?: { x: number; y: number; width: number; height: number },
): SampleSet {
  const sx = Math.floor((crop?.x ?? 0) * image.naturalWidth)
  const sy = Math.floor((crop?.y ?? 0) * image.naturalHeight)
  const sw = Math.floor((crop?.width ?? 1) * image.naturalWidth)
  const sh = Math.floor((crop?.height ?? 1) * image.naturalHeight)
  if (!sw || !sh) throw new Error('Empty intro image')

  const canvas = document.createElement('canvas')
  canvas.width = sw
  canvas.height = sh
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('No canvas context')
  context.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh)
  const pixels = context.getImageData(0, 0, sw, sh).data
  const candidates: Array<{ x: number; y: number }> = []

  for (let y = 0; y < sh; y += 1) {
    for (let x = 0; x < sw; x += 1) {
      if (pixels[(y * sw + x) * 4 + 3] > 24) candidates.push({ x, y })
    }
  }

  if (candidates.length === 0) throw new Error('No visible intro pixels')

  const points = Array.from({ length: count }, () => {
    const source = candidates[Math.floor(Math.random() * candidates.length)]
    return {
      x: clamp((source.x + Math.random() * 0.9) / sw),
      y: clamp((source.y + Math.random() * 0.9) / sh),
    }
  })

  return { points, aspect: sw / sh }
}

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.replace('#', ''), 16)
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255]
}

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)]
}

function buildParticles(bull: SampleSet, logo: SampleSet, mobile: boolean): Particle[] {
  const count = mobile ? 3000 : 4600
  const bullHeight = mobile ? 6.2 : 9.0
  const bullWidth = bullHeight * bull.aspect
  const logoHeight = mobile ? 4.2 : 5.2
  const logoWidth = logoHeight * logo.aspect
  const bodyColors = ['#e6fbff', '#aeeeff', '#5ad7ff', '#37a4ff', '#1769ff', '#8b7bff'].map(hexToRgb)
  const hornColors = ['#ff3b30', '#ff5a3c', '#ff7b42', '#ffb07a'].map(hexToRgb)
  const logoColors = ['#dff9ff', '#8de5ff', '#45b9ff', '#1769ff', '#7ad9ff'].map(hexToRgb)

  return Array.from({ length: count }, (_, index) => {
    const bullPoint = bull.points[index]
    const logoPoint = logo.points[Math.floor(Math.random() * logo.points.length)]
    const isHorn =
      bullPoint.y < 0.28 && (bullPoint.x < 0.38 || bullPoint.x > 0.62)
    const bx = (bullPoint.x - 0.5) * bullWidth
    const by = (0.5 - bullPoint.y) * bullHeight
    const bz = (Math.random() - 0.5) * 1.9
    const lx = (logoPoint.x - 0.5) * logoWidth
    const ly = (0.5 - logoPoint.y) * logoHeight
    const lz = (Math.random() - 0.5) * 0.36
    const direction = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      0.6 + Math.random() * 2.4,
    ).normalize()
    const impactScale = 4.3
    const burstFactor = isHorn ? 1 : 0.7
    const impactX = bx * impactScale + direction.x * 9.2 * burstFactor
    const impactY = by * impactScale + direction.y * 9.2 * burstFactor
    const impactZ = bz * impactScale + 2.3 + direction.z * 7.2 * burstFactor

    let start: THREE.Vector3
    if (isHorn) {
      start = new THREE.Vector3(
        bx + (Math.random() - 0.5) * 1.1,
        by + 0.5 + Math.random() * 1.4,
        bz + (Math.random() - 0.5) * 2.5,
      )
    } else {
      const angle = Math.random() * Math.PI * 2
      const radius = 8 + Math.random() * 10
      start = new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.7,
        -7 + Math.random() * 10,
      )
    }

    return {
      bull: new THREE.Vector3(bx, by, bz),
      logo: new THREE.Vector3(lx, ly, lz),
      start,
      impact: new THREE.Vector3(impactX, impactY, impactZ),
      dir: direction,
      size: (isHorn ? 0.7 : 0.46) + Math.random() * (isHorn ? 0.8 : 0.9),
      delay: isHorn ? Math.random() * 0.08 : Math.random() * 0.34,
      seed: Math.random(),
      bullColor: pick(isHorn ? hornColors : bodyColors),
      logoColor: pick(logoColors),
      isHorn,
    }
  })
}

function makeMaterial(pixelRatio: number) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uPixelRatio: { value: pixelRatio },
      uSize: { value: 162 },
    },
    vertexShader: `
      uniform float uPixelRatio;
      uniform float uSize;
      attribute float aSize;
      attribute float aAlpha;
      attribute vec3 aColor;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vColor = aColor;
        vAlpha = aAlpha;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = clamp(aSize * uSize * uPixelRatio / max(0.1, -mvPosition.z), 1.0, 42.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vec2 point = gl_PointCoord - vec2(0.5);
        float radius = length(point) * 2.0;
        float core = smoothstep(0.9, 0.0, radius);
        float halo = smoothstep(1.0, 0.28, radius) * 0.34;
        float alpha = (core * 0.82 + halo) * vAlpha;
        if (alpha < 0.008) discard;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  })
}

export function BullIntro() {
  const { t } = useApp()
  const [active, setActive] = useState(() => {
    if (typeof window === 'undefined') return false
    if (new URLSearchParams(window.location.search).get('intro') === '0') return false
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  const [leaving, setLeaving] = useState(false)
  const [ready, setReady] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const phaseRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const glowRef = useRef<HTMLSpanElement>(null)
  const finishedRef = useRef(false)
  const leaveTimerRef = useRef<number | null>(null)

  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    setLeaving(true)
    leaveTimerRef.current = window.setTimeout(() => setActive(false), 820)
  }, [])

  useEffect(() => {
    if (!active) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.scrollTo({ top: 0, behavior: 'auto' })

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [active])

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return

    let disposed = false
    let animationFrame = 0
    let startTime = 0
    let lastTime = 0
    let spawnAccumulator = 0
    let phaseText = ''
    let renderer: THREE.WebGLRenderer | null = null
    let geometry: THREE.BufferGeometry | null = null
    let trailGeometry: THREE.BufferGeometry | null = null
    let material: THREE.ShaderMaterial | null = null
    let trailMaterial: THREE.ShaderMaterial | null = null

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish()
    }
    window.addEventListener('keydown', onKeyDown)

    const setup = async () => {
      try {
        const logoImage = await loadImage(LOGO_SRC)
        if (disposed) return

        const mobile = window.innerWidth < 720
        const sampleCount = mobile ? 3000 : 4600
        const particles = buildParticles(
          sampleMask(logoImage, sampleCount, { x: 0.08, y: 0.08, width: 0.84, height: 0.84 }),
          sampleMask(logoImage, sampleCount),
          mobile,
        )
        const count = particles.length
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const sizes = new Float32Array(count)
        const alphas = new Float32Array(count)
        const bullColors = new Float32Array(count * 3)
        const logoColors = new Float32Array(count * 3)

        particles.forEach((particle, index) => {
          bullColors.set(particle.bullColor, index * 3)
          logoColors.set(particle.logoColor, index * 3)
          sizes[index] = particle.size
          alphas[index] = 0
        })

        geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
        geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
        geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1))

        const trailCount = mobile ? 620 : 980
        const trailPositions = new Float32Array(trailCount * 3)
        const trailColors = new Float32Array(trailCount * 3)
        const trailSizes = new Float32Array(trailCount)
        const trailAlphas = new Float32Array(trailCount)
        const trailLife = new Float32Array(trailCount)
        const trailSeed = new Float32Array(trailCount)
        for (let index = 0; index < trailCount; index += 1) {
          const color = pick(['#ff3b30', '#ff5c3a', '#ff8a4c', '#d92626'])
          trailColors.set(hexToRgb(color), index * 3)
          trailSizes[index] = 0.9 + Math.random() * 1.5
          trailSeed[index] = Math.random()
        }

        trailGeometry = new THREE.BufferGeometry()
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3))
        trailGeometry.setAttribute('aColor', new THREE.BufferAttribute(trailColors, 3))
        trailGeometry.setAttribute('aSize', new THREE.BufferAttribute(trailSizes, 1))
        trailGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(trailAlphas, 1))

        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75)
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        })
        renderer.setClearColor(0x000000, 0)
        renderer.setPixelRatio(pixelRatio)
        renderer.outputColorSpace = THREE.LinearSRGBColorSpace
        renderer.toneMapping = THREE.NoToneMapping

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
        const baseZ = () => (window.innerWidth < 720 ? 20 : 16)
        const resize = () => {
          const width = window.innerWidth
          const height = window.innerHeight
          renderer?.setSize(width, height, false)
          if (!renderer) return
          camera.aspect = width / height
          camera.position.set(0, 0, baseZ())
          camera.lookAt(0, 0, 0)
          camera.updateProjectionMatrix()
          const ratio = Math.min(window.devicePixelRatio || 1, 1.75)
          if (material) material.uniforms.uPixelRatio.value = ratio
          if (trailMaterial) trailMaterial.uniforms.uPixelRatio.value = ratio
          renderer.setPixelRatio(ratio)
        }

        material = makeMaterial(pixelRatio)
        trailMaterial = makeMaterial(pixelRatio)
        trailMaterial.uniforms.uSize.value = 125
        scene.add(new THREE.Points(geometry, material))
        scene.add(new THREE.Points(trailGeometry, trailMaterial))
        window.addEventListener('resize', resize)
        resize()
        renderer.compile(scene, camera)

        const posAttribute = geometry.getAttribute('position') as THREE.BufferAttribute
        const colorAttribute = geometry.getAttribute('aColor') as THREE.BufferAttribute
        const alphaAttribute = geometry.getAttribute('aAlpha') as THREE.BufferAttribute
        const trailPositionAttribute = trailGeometry.getAttribute('position') as THREE.BufferAttribute
        const trailAlphaAttribute = trailGeometry.getAttribute('aAlpha') as THREE.BufferAttribute
        const trailPositionArray = trailPositionAttribute.array as Float32Array
        const trailAlphaArray = trailAlphaAttribute.array as Float32Array
        const positionArray = posAttribute.array as Float32Array
        const colorArray = colorAttribute.array as Float32Array
        const alphaArray = alphaAttribute.array as Float32Array
        let trailCursor = 0
    const debugTime = import.meta.env.DEV
      ? Number(new URLSearchParams(window.location.search).get('introAt') ?? '0')
      : 0

        const spawnTrail = (amount: number, now: number) => {
          if (!renderer) return
          for (let index = 0; index < amount; index += 1) {
            const source = Math.floor(Math.random() * count)
            const slot = trailCursor % trailCount
            trailCursor += 1
            trailLife[slot] = 1
            trailPositionArray[slot * 3] = positionArray[source * 3] - (0.5 + Math.random() * 2.4)
            trailPositionArray[slot * 3 + 1] =
              positionArray[source * 3 + 1] + (Math.random() - 0.5) * 1.6
            trailPositionArray[slot * 3 + 2] =
              positionArray[source * 3 + 2] + (Math.random() - 0.5) * 1.6
            trailAlphaArray[slot] = 0.92
            trailSeed[slot] = Math.random()
            void now
          }
        }

        const update = (time: number, delta: number) => {
          const t = debugTime > 0
            ? Math.min(debugTime, DURATION + 0.2)
            : clamp((time - startTime) / 1000, 0, DURATION + 0.4)
          const chargeProgress = clamp((t - FORM_END) / (CHARGE_END - FORM_END))
          const impactProgress = clamp((t - CHARGE_END) / (IMPACT_END - CHARGE_END))
          const reformProgress = clamp((t - IMPACT_END) / (REFORM_END - IMPACT_END))
          const reformEase = easeInOutCubic(reformProgress)
          const brandProgress = smoothstep(REFORM_END - 0.05, REFORM_END + 0.2, t)
          const finalFade = smoothstep(REFORM_END + 0.1, DURATION, t)
          const redBurst =
            t >= CHARGE_END && t < IMPACT_END
              ? smoothstep(CHARGE_END, CHARGE_END + 0.28, t) *
                (1 - smoothstep(IMPACT_END - 0.12, IMPACT_END, t))
              : 0
          let shake = 0
          let dolly = 0
          if (t >= FORM_END && t < CHARGE_END) {
            dolly = easeInOutCubic(chargeProgress) * 0.22
            shake = smoothstep(0.72, 1, chargeProgress) * 0.022
          } else if (t >= CHARGE_END && t < IMPACT_END) {
            dolly = 0.22 + easeOutCubic(impactProgress) * 2.55
            shake = 0.022 + Math.pow(impactProgress, 1.6) * 0.235
          } else if (t >= IMPACT_END && t < REFORM_END) {
            dolly = (1 - easeInOutCubic(reformProgress)) * 2.77
            shake = (1 - reformProgress) * 0.24
          }

          const shakeX =
            (Math.sin(t * 23.7) + 0.45 * Math.sin(t * 11.9 + 1.7)) * shake
          const shakeY =
            (Math.cos(t * 19.3) + 0.4 * Math.sin(t * 13.1 + 0.8)) * shake * 0.62
          const cameraDamp = 1 - Math.exp(-9.5 * delta)
          const dollyDamp = 1 - Math.exp(-6.5 * delta)
          camera.position.x += (shakeX - camera.position.x) * cameraDamp
          camera.position.y += (shakeY - camera.position.y) * cameraDamp
          camera.position.z += (baseZ() - dolly - camera.position.z) * dollyDamp
          camera.lookAt(0, 0, 0)

          for (let index = 0; index < count; index += 1) {
            const particle = particles[index]
            let x: number
            let y: number
            let z: number
            let alpha = 1
            let form = 1

            if (t < FORM_END) {
              const local = clamp(
                (t - particle.delay) / Math.max(0.18, FORM_END - particle.delay),
              )
              form = easeOutQuint(local)
              const swirl =
                (1 - form) * Math.sin(local * Math.PI * 2 + particle.seed * 6.28) * 0.18
              x = lerp(particle.start.x, particle.bull.x, form) + swirl
              y = lerp(particle.start.y, particle.bull.y, form) - swirl * 0.45
              z = lerp(particle.start.z, particle.bull.z, form)
              alpha = smoothstep(0, 0.18, form)
            } else if (t < CHARGE_END) {
              const rush = easeInCubic(chargeProgress)
              const scale = 1 + rush * 0.2
              const gallop =
                Math.sin(chargeProgress * Math.PI * 3.2) * 0.035 * (1 - chargeProgress)
              x = particle.bull.x * scale
              y = particle.bull.y * scale + gallop
              z = particle.bull.z * scale
            } else if (t < IMPACT_END) {
              const zoom = 1.2 + easeInOutCubic(impactProgress) * 3.1
              const burst = easeInCubic(clamp((impactProgress - 0.2) / 0.8))
              x = particle.bull.x * zoom + particle.dir.x * burst * 9.2
              y = particle.bull.y * zoom + particle.dir.y * burst * 9.2
              z = particle.bull.z * zoom + 2.3 * impactProgress + particle.dir.z * burst * 7.2
              alpha = 1 - smoothstep(0.65, 1, impactProgress) * 0.18
            } else if (t < REFORM_END) {
              const settle = easeInOutCubic(reformProgress)
              const swirl =
                (1 - settle) *
                Math.sin(reformProgress * Math.PI * 1.8 + particle.seed * 6.28) *
                0.9
              x = lerp(particle.impact.x, particle.logo.x, settle) + swirl
              y = lerp(particle.impact.y, particle.logo.y, settle) - swirl * 0.48
              z = lerp(particle.impact.z, particle.logo.z, settle)
              alpha = 0.82 + settle * 0.18
            } else {
              x = particle.logo.x
              y = particle.logo.y
              z = particle.logo.z
              alpha = 1 - finalFade * 0.72
            }

            positionArray[index * 3] = x
            positionArray[index * 3 + 1] = y
            positionArray[index * 3 + 2] = z
            alphaArray[index] = alpha * (particle.isHorn ? 1 : 0.84)
            if (t < IMPACT_END) {
              colorArray[index * 3] = lerp(particle.bullColor[0], 1, redBurst * 0.42)
              colorArray[index * 3 + 1] = lerp(particle.bullColor[1], 0.09, redBurst * 0.42)
              colorArray[index * 3 + 2] = lerp(particle.bullColor[2], 0.04, redBurst * 0.42)
            } else {
              const mix = reformEase
              colorArray[index * 3] = lerp(particle.bullColor[0], particle.logoColor[0], mix)
              colorArray[index * 3 + 1] = lerp(
                particle.bullColor[1],
                particle.logoColor[1],
                mix,
              )
              colorArray[index * 3 + 2] = lerp(
                particle.bullColor[2],
                particle.logoColor[2],
                mix,
              )
            }

          }

          if (t > FORM_END && t < IMPACT_END) {
            spawnAccumulator += delta * (t < CHARGE_END ? 74 : 160)
            const amount = Math.min(16, Math.floor(spawnAccumulator))
            if (amount > 0) {
              spawnTrail(amount, time)
              spawnAccumulator -= amount
            }
          }

          for (let index = 0; index < trailCount; index += 1) {
            if (trailLife[index] <= 0) {
              trailAlphaArray[index] = 0
              continue
            }
            trailLife[index] -= delta * (1.15 + trailSeed[index] * 0.8)
            if (trailLife[index] <= 0) {
              trailAlphaArray[index] = 0
              continue
            }
            const life = trailLife[index]
            trailPositionArray[index * 3] -= delta * (1.8 + trailSeed[index] * 2.2)
            trailPositionArray[index * 3 + 1] +=
              delta * (trailSeed[index] - 0.46) * 1.3
            trailPositionArray[index * 3 + 2] -= delta * (0.5 + trailSeed[index] * 0.6)
            trailAlphaArray[index] = life * life * 0.9
          }

          posAttribute.needsUpdate = true
          colorAttribute.needsUpdate = true
          alphaAttribute.needsUpdate = true
          trailPositionAttribute.needsUpdate = true
          trailAlphaAttribute.needsUpdate = true

          if (glowRef.current) {
            const glow =
              smoothstep(CHARGE_END - 0.35, CHARGE_END + 0.1, t) *
              (1 - smoothstep(IMPACT_END + 0.05, REFORM_END, t))
            glowRef.current.style.opacity = String(glow)
          }
          const canvasFade =
            1 - smoothstep(REFORM_END - 0.2, REFORM_END + 0.08, t)
          canvas.style.opacity = String(canvasFade)
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${clamp(t / DURATION)})`
          }
          if (brandRef.current) {
            brandRef.current.style.opacity = String(brandProgress)
            brandRef.current.style.transform = `translateY(${(1 - brandProgress) * 12}px) scale(${0.96 + brandProgress * 0.04})`
          }
          if (phaseRef.current) {
            const nextPhase =
              t < FORM_END
                ? '01 / AWAKENING'
                : t < CHARGE_END
                  ? '02 / CHARGE'
                  : t < IMPACT_END
                    ? '03 / IMPACT'
                    : t < REFORM_END
                      ? '04 / REFORM'
                      : 'BULLU / UKM BANGI'
            if (phaseText !== nextPhase) {
              phaseText = nextPhase
              phaseRef.current.textContent = nextPhase
            }
          }
          renderer?.render(scene, camera)
          if (!debugTime && t >= DURATION) finish()
        }

        const loop = (now: number) => {
          if (disposed) return
          if (!startTime) {
            startTime = now
            lastTime = now
            setReady(true)
          }
          const delta = Math.min(0.033, (now - lastTime) / 1000 || 0.016)
          lastTime = now
          update(now, delta)
          animationFrame = requestAnimationFrame(loop)
        }
        animationFrame = requestAnimationFrame(loop)

        canvas.classList.add('is-ready')
      } catch (error) {
        if (import.meta.env.DEV) console.warn('[BullIntro]', error)
        finish()
      }
    }

    void setup()

    return () => {
      disposed = true
      if (animationFrame) cancelAnimationFrame(animationFrame)
      window.removeEventListener('keydown', onKeyDown)
      if (leaveTimerRef.current) window.clearTimeout(leaveTimerRef.current)
      geometry?.dispose()
      trailGeometry?.dispose()
      material?.dispose()
      trailMaterial?.dispose()
      renderer?.dispose()
      renderer?.forceContextLoss()
      renderer = null
      canvas.classList.remove('is-ready')
    }
  }, [active, finish])

  if (!active) return null

  return (
    <div className={`bull-intro${leaving ? ' is-leaving' : ''}`} role="dialog" aria-modal="true" aria-label={t('BullU 开场动画')}>
      <div className="bull-intro__backdrop" aria-hidden="true" />
      <canvas ref={canvasRef} className="bull-intro__canvas" aria-hidden="true" />
      <span ref={glowRef} className="bull-intro__impact-glow" aria-hidden="true" />
      <span className="bull-intro__beam" aria-hidden="true" />

      <div className="bull-intro__topline">
        <span>
          BULLU <i /> UKM · BANGI
        </span>
        <span>CAMPUS IN MOTION</span>
      </div>

      <div className={`bull-intro__prelude${ready ? ' is-hidden' : ''}`} aria-hidden="true">
        <img src={LOGO_SRC} alt="" />
        <small>INITIALIZING CAMPUS</small>
      </div>

      <div ref={brandRef} className="bull-intro__brand">
        <img src={LOGO_SRC} alt="" />
        <div>
          <strong>BullU</strong>
          <small>{t('你的校园，你的生活，我们的社区。')}</small>
        </div>
      </div>

      <div className="bull-intro__bottombar">
        <span ref={phaseRef} className="bull-intro__phase">
          01 / AWAKENING
        </span>
        <span className="bull-intro__progress">
          <span ref={progressRef} />
        </span>
        <button className="bull-intro__skip" type="button" onClick={finish}>
          {t('跳过开场')}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <span className="bull-intro__ready" aria-live="polite">
        {ready ? '' : 'LOADING'}
      </span>
    </div>
  )
}
