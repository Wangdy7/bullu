import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface AnimatedGlobeProps {
  onReady?: () => void
}

const TARGET_YAW = 2.936
const TARGET_PITCH = -0.035

const earthVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const earthFragmentShader = /* glsl */ `
  uniform sampler2D uDayMap;
  uniform sampler2D uNightMap;
  uniform vec3 uLightDirection;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 day = texture2D(uDayMap, vUv).rgb;
    vec3 night = texture2D(uNightMap, vUv).rgb;
    vec3 normal = normalize(vNormal);
    vec3 lightDirection = normalize(uLightDirection);

    float daylight = smoothstep(-0.3, 0.62, dot(normal, lightDirection));
    float nightMask = 1.0 - daylight;

    vec3 color = day * (1.18 + daylight * 0.32);
    color = mix(color, color * vec3(0.78, 0.98, 1.2), 0.3);
    vec3 cityLights = night * smoothstep(0.04, 0.42, max(night.r, max(night.g, night.b)));
    color += cityLights * vec3(1.0, 0.66, 0.34) * (0.1 + nightMask * 0.75);

    vec3 viewDirection = normalize(vViewPosition);
    float rim = pow(1.0 - abs(dot(normal, viewDirection)), 3.0);
    color += vec3(0.08, 0.42, 0.92) * rim * 0.5;

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

const atmosphereVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const atmosphereFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vec3 viewDirection = normalize(vViewPosition);
    float rim = pow(1.0 - abs(dot(normalize(vNormal), viewDirection)), 2.4);
    gl_FragColor = vec4(0.12, 0.5, 1.0, rim * 0.42);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export function AnimatedGlobe({ onReady }: AnimatedGlobeProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const readyRef = useRef(onReady)

  useEffect(() => {
    readyRef.current = onReady
  }, [onReady])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch {
      host.dataset.failed = 'true'
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const compact = window.innerWidth < 720
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.5 : 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.NoToneMapping
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.className = 'animated-globe__canvas'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 100)
    camera.position.set(0, 0.05, 5.05)

    const group = new THREE.Group()
    group.rotation.y = TARGET_YAW
    group.rotation.x = TARGET_PITCH
    scene.add(group)

    const textureLoader = new THREE.TextureLoader()
    const dayTexture = textureLoader.load('./images/earth/earth-day.jpg')
    const nightTexture = textureLoader.load('./images/earth/earth-night.jpg')
    const cloudTexture = textureLoader.load('./images/earth/earth-clouds.jpg')
    for (const texture of [dayTexture, nightTexture, cloudTexture]) {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
    }
    cloudTexture.wrapS = THREE.RepeatWrapping

    const earthGeometry = new THREE.SphereGeometry(1.62, compact ? 72 : 112, compact ? 48 : 72)
    const earthMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uDayMap: { value: dayTexture },
        uNightMap: { value: nightTexture },
        uLightDirection: { value: new THREE.Vector3(-0.18, 0.32, 0.94) },
      },
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
    })
    const earth = new THREE.Mesh(earthGeometry, earthMaterial)
    group.add(earth)

    const cloudGeometry = new THREE.SphereGeometry(1.628, compact ? 64 : 96, compact ? 42 : 64)
    const cloudMaterial = new THREE.MeshBasicMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.19,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial)
    group.add(clouds)

    const atmosphereGeometry = new THREE.SphereGeometry(1.77, compact ? 48 : 64, compact ? 32 : 48)
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    group.add(atmosphere)

    const resize = () => {
      const width = host.clientWidth
      const height = host.clientHeight
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)

    let frame = 0
    const clock = new THREE.Clock()
    let visible = true
    let firstFrame = false

    const render = () => {
      if (!visible) return
      frame = requestAnimationFrame(render)
      const elapsed = clock.getElapsedTime()
      const entry = reducedMotion ? 1 : Math.min(1, elapsed / 1.25)
      const easedEntry = 1 - Math.pow(1 - entry, 3)

      group.scale.setScalar(0.9 + easedEntry * 0.1)
      group.rotation.y = TARGET_YAW - (1 - easedEntry) * 0.52 + (reducedMotion ? 0 : Math.sin(elapsed * 0.18) * 0.025)
      group.rotation.x = TARGET_PITCH + (reducedMotion ? 0 : Math.cos(elapsed * 0.14) * 0.018)
      clouds.rotation.y = elapsed * 0.007 + (1 - easedEntry) * 0.16

      renderer.render(scene, camera)
      if (!firstFrame) {
        firstFrame = true
        host.classList.add('is-ready')
        readyRef.current?.()
      }
    }

    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
      if (visible) {
        clock.start()
        render()
      } else {
        cancelAnimationFrame(frame)
      }
    }

    render()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', onVisibility)
      resizeObserver.disconnect()
      earthGeometry.dispose()
      earthMaterial.dispose()
      cloudGeometry.dispose()
      cloudMaterial.dispose()
      atmosphereGeometry.dispose()
      atmosphereMaterial.dispose()
      dayTexture.dispose()
      nightTexture.dispose()
      cloudTexture.dispose()
      renderer.dispose()
      host.replaceChildren()
    }
  }, [])

  return (
    <div ref={hostRef} className="animated-globe" aria-hidden="true">
      <span className="animated-globe__fallback" />
    </div>
  )
}
