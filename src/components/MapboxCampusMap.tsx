import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { CampusLocation } from '../types'
import { campusLocations } from '../data'
import { categoryColors } from './CampusMap2D'
import { getMapCopy, mapCategoryLabel, type MapLanguage } from '../lib/mapI18n'

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
const STANDARD_STYLE = 'mapbox://styles/mapbox/standard'

// UKM campus envelope from OpenStreetMap (Nominatim), used to place the
// existing percentage-based demo locations on a real basemap.
const CAMPUS_WEST = 101.7662302
const CAMPUS_EAST = 101.7957801
const CAMPUS_SOUTH = 2.9074459
const CAMPUS_NORTH = 2.9407292
const CAMPUS_CENTER: [number, number] = [101.7812, 2.9241]
const CAMPUS_BOUNDS: [[number, number], [number, number]] = [
  [CAMPUS_WEST, CAMPUS_SOUTH],
  [CAMPUS_EAST, CAMPUS_NORTH],
]

export type CampusMapMode = '2d' | '3d'

interface MapboxCampusMapProps {
  locations: CampusLocation[]
  selected: CampusLocation
  mode: CampusMapMode
  routeActive: boolean
  onSelect: (location: CampusLocation) => void
  language: MapLanguage
}

function campusCoordinate(location: Pick<CampusLocation, 'x' | 'y'>): [number, number] {
  const lng = CAMPUS_WEST + (location.x / 100) * (CAMPUS_EAST - CAMPUS_WEST)
  const lat = CAMPUS_NORTH - (location.y / 100) * (CAMPUS_NORTH - CAMPUS_SOUTH)
  return [lng, lat]
}

export function MapboxCampusMap({
  locations,
  selected,
  mode,
  routeActive,
  onSelect,
  language,
}: MapboxCampusMapProps) {
  const copy = getMapCopy(language)
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map())
  const loadedRef = useRef(false)
  const didFitRef = useRef(false)
  const modeRef = useRef(mode)
  const selectedRef = useRef(selected)
  const routeActiveRef = useRef(routeActive)
  const onSelectRef = useRef(onSelect)
  const lastSelectedRef = useRef(selected.id)
  const applyModeRef = useRef<() => void>(() => {})
  const drawRouteRef = useRef<() => void>(() => {})
  const fitCampusRef = useRef<() => void>(() => {})

  modeRef.current = mode
  selectedRef.current = selected
  routeActiveRef.current = routeActive
  onSelectRef.current = onSelect

  useEffect(() => {
    const container = containerRef.current
    if (!container || !TOKEN) return

    let disposed = false
    container.replaceChildren()
    mapboxgl.accessToken = TOKEN
    const map = new mapboxgl.Map({
      container,
      style: STANDARD_STYLE,
      center: CAMPUS_CENTER,
      zoom: 15.2,
      pitch: modeRef.current === '3d' ? 55 : 0,
      bearing: modeRef.current === '3d' ? -18 : 0,
      attributionControl: false,
      logoPosition: 'bottom-left',
      antialias: true,
      cooperativeGestures: false,
    })
    mapRef.current = map
    map.addControl(new mapboxgl.AttributionControl({ compact: false }), 'bottom-right')
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'bottom-right')

    const applyMode = () => {
      if (disposed || !loadedRef.current) return
      const current = modeRef.current
      if (current === '3d') {
        try {
          map.setConfigProperty('basemap', 'show3DObjects', true)
          map.setConfigProperty('basemap', 'lightPreset', 'day')
        } catch {
          // Standard config is not available on the satellite style.
        }
      }
      map.easeTo({
        pitch: current === '3d' ? 55 : 0,
        bearing: current === '3d' ? -18 : 0,
        duration: 650,
      })
    }

    const drawRoute = () => {
      if (disposed || !loadedRef.current || !map.isStyleLoaded()) return

      if (map.getLayer('campus-route-line')) map.removeLayer('campus-route-line')
      if (map.getSource('campus-route')) map.removeSource('campus-route')
      if (!routeActiveRef.current) return

      const bus = campusLocations.find((item) => item.id === 'bus')
      const start = bus ? campusCoordinate(bus) : ([101.7816, 2.9183] as [number, number])
      const end = campusCoordinate(selectedRef.current)
      if (start[0] === end[0] && start[1] === end[1]) return

      const mid: [number, number] = [
        (start[0] + end[0]) / 2 + (end[1] - start[1]) * 0.32,
        (start[1] + end[1]) / 2 + (start[0] - end[0]) * 0.32,
      ]

      map.addSource('campus-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [start, mid, end],
          },
        },
      })
      map.addLayer({
        id: 'campus-route-line',
        type: 'line',
        source: 'campus-route',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#1769ff',
          'line-width': ['interpolate', ['linear'], ['zoom'], 14, 2, 17, 4],
          'line-dasharray': [1.5, 1.8],
          'line-opacity': 0.86,
        },
      })
    }

    const fitCampus = () => {
      if (disposed || !loadedRef.current) return
      if (didFitRef.current) return
      didFitRef.current = true
      map.fitBounds(CAMPUS_BOUNDS, {
        padding: { top: 46, right: 46, bottom: 64, left: 46 },
        maxZoom: 16.2,
        duration: 0,
      })
    }

    applyModeRef.current = applyMode
    drawRouteRef.current = drawRoute
    fitCampusRef.current = fitCampus

    map.on('style.load', () => {
      if (disposed) return
      container.dataset.mapReady = 'true'
      loadedRef.current = true
      applyMode()
      fitCampus()
      drawRoute()
    })

    map.on('error', (event) => {
      if (import.meta.env.DEV) {
        console.warn('[mapbox-campus]', event.error?.message ?? event)
      }
    })

    const resizeObserver = new ResizeObserver(() => map.resize())
    resizeObserver.observe(container)

    return () => {
      disposed = true
      resizeObserver.disconnect()
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current.clear()
      map.remove()
      delete container.dataset.mapReady
      mapRef.current = null
      loadedRef.current = false
      didFitRef.current = false
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current.clear()

    locations.forEach((location) => {
      const element = document.createElement('button')
      element.type = 'button'
      element.className = 'mapbox-campus-marker'
      element.dataset.label = location.name
      element.setAttribute(
        'aria-label',
        `${location.name} · ${mapCategoryLabel(language, location.category)}`,
      )
      element.title = location.name
      element.style.setProperty('--marker-color', categoryColors[location.category])
      if (location.id === selectedRef.current.id) element.classList.add('is-selected')
      element.addEventListener('click', (event) => {
        event.stopPropagation()
        onSelectRef.current(location)
      })

      const marker = new mapboxgl.Marker({ element, anchor: 'center' })
        .setLngLat(campusCoordinate(location))
        .addTo(map)
      markersRef.current.set(location.id, marker)
    })

    return () => {
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current.clear()
    }
  }, [locations])

  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      marker.getElement().classList.toggle('is-selected', id === selected.id)
    })

    const map = mapRef.current
    if (!map || !loadedRef.current) {
      lastSelectedRef.current = selected.id
      return
    }
    if (lastSelectedRef.current === selected.id) return

    lastSelectedRef.current = selected.id
    map.flyTo({
      center: campusCoordinate(selected),
      zoom: Math.max(map.getZoom(), 16.2),
      pitch: modeRef.current === '3d' ? 55 : 0,
      bearing: modeRef.current === '3d' ? -18 : 0,
      duration: 900,
      essential: true,
    })
  }, [selected.id, selected.x, selected.y])

  useEffect(() => {
    if (!loadedRef.current) return
    applyModeRef.current()
  }, [mode])

  useEffect(() => {
    selectedRef.current = selected
    drawRouteRef.current()
  }, [routeActive, selected.id, selected.x, selected.y])

  return (
    <>
      <div ref={containerRef} className="mapbox-campus-map" />
      <div className="mapbox-campus-badge">
        <span className="live-dot" />
        {copy.mapboxBadge}
        <em>{copy.mapboxBadgeSub}</em>
      </div>
    </>
  )
}
