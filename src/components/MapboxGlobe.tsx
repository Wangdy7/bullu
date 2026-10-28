import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
const UKM: [number, number] = [101.78, 2.93]
const START_ZOOM = 0.8
const TARGET_ZOOM = 15.2

interface MapboxGlobeProps {
  onArrived?: () => void
  onDepart?: () => void
  replaySignal?: number
}

export function MapboxGlobe({ onArrived, onDepart, replaySignal = 0 }: MapboxGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const replayRef = useRef<(() => void) | null>(null)
  const arrivedRef = useRef(onArrived)
  const departRef = useRef(onDepart)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    arrivedRef.current = onArrived
  }, [onArrived])

  useEffect(() => {
    departRef.current = onDepart
  }, [onDepart])

  useEffect(() => {
    if (replaySignal > 0) replayRef.current?.()
  }, [replaySignal])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !TOKEN) return

    let disposed = false
    let loaded = false
    let firstScreenReady = false
    let timers: number[] = []
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    container.replaceChildren()
    mapboxgl.accessToken = TOKEN

    const map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/standard',
      projection: 'globe',
      center: UKM,
      zoom: START_ZOOM,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
      logoPosition: 'bottom-left',
      cooperativeGestures: true,
      antialias: true,
    })
    mapRef.current = map
    map.addControl(new mapboxgl.AttributionControl({ compact: false }), 'bottom-right')

    const clearTimers = () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      timers = []
    }

    const later = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(callback, delay)
      timers.push(timer)
      return timer
    }

    const arrive = () => {
      if (disposed) return
      arrivedRef.current?.()
    }

    const flyToCampus = () => {
      if (disposed || !loaded) return
      map.stop()
      map.flyTo({
        center: UKM,
        zoom: TARGET_ZOOM,
        pitch: 42,
        bearing: -16,
        duration: 4200,
        essential: true,
      })
      map.once('moveend', arrive)
    }

    const showFirstScreen = () => {
      if (disposed || firstScreenReady) return
      firstScreenReady = true
      setReady(true)

      if (reduceMotion) {
        map.jumpTo({
          center: UKM,
          zoom: TARGET_ZOOM,
          pitch: 42,
          bearing: -16,
        })
        arrive()
        return
      }

      later(flyToCampus, 900)
    }

    const replay = () => {
      if (!loaded || disposed) return
      clearTimers()
      departRef.current?.()
      map.stop()

      if (reduceMotion) {
        map.jumpTo({
          center: UKM,
          zoom: TARGET_ZOOM,
          pitch: 42,
          bearing: -16,
        })
        arrive()
        return
      }

      map.flyTo({
        center: UKM,
        zoom: START_ZOOM,
        pitch: 0,
        bearing: 0,
        duration: 1500,
        essential: true,
      })
      map.once('moveend', () => {
        if (disposed) return
        later(flyToCampus, 450)
      })
    }
    replayRef.current = replay

    map.on('load', () => {
      if (disposed) return
      loaded = true

      try {
        map.setProjection({ name: 'globe' })
      } catch {
        // Globe is already the default projection for most styles.
      }

      try {
        map.setFog({
          color: '#eef7ff',
          'high-color': '#bcdcff',
          'horizon-blend': 0.08,
          'space-color': '#f8fbff',
          'star-intensity': 0,
        })
      } catch {
        // A custom style may not support fog; the map still works.
      }

      try {
        map.setConfigProperty('basemap', 'show3DObjects', true)
        map.setConfigProperty('basemap', 'lightPreset', 'day')
      } catch {
        // Older styles may not expose the Standard basemap config.
      }

      const marker = document.createElement('div')
      marker.className = 'mapbox-ukm-marker'
      marker.innerHTML = '<i></i><span>UKM BANGI</span>'
      new mapboxgl.Marker({ element: marker, anchor: 'bottom' })
        .setLngLat(UKM)
        .addTo(map)

      map.once('idle', showFirstScreen)
      // Keep a fallback for styles that stay busy loading labels.
      later(showFirstScreen, 6000)
    })

    map.on('error', (event) => {
      if (import.meta.env.DEV) {
        console.warn('[mapbox]', event.error?.message ?? event)
      }
    })

    const resizeObserver = new ResizeObserver(() => map.resize())
    resizeObserver.observe(container)

    return () => {
      disposed = true
      clearTimers()
      replayRef.current = null
      resizeObserver.disconnect()
      map.remove()
      container.replaceChildren()
      mapRef.current = null
    }
  }, [])

  return (
    <>
      <div
        ref={containerRef}
        className="mapbox-globe"
        data-map-ready={ready ? 'true' : 'false'}
      />
      <div className={`mapbox-globe__loader${ready ? ' is-ready' : ''}`} aria-hidden={ready}>
        <span className="mapbox-globe__loader-ring" />
        <span className="mapbox-globe__loader-label">LOADING CAMPUS MAP</span>
      </div>
    </>
  )
}
