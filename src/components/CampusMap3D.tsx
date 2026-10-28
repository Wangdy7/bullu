import { useEffect, useRef, useState, type CSSProperties } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { Maximize2, Move3d, RotateCcw } from 'lucide-react'
import type { CampusLocation } from '../types'
import { locationIconMap } from '../lib/icons'
import { categoryColors } from './CampusMap2D'
import { cn } from '../lib/utils'

interface CampusMap3DProps {
  locations: CampusLocation[]
  selected: CampusLocation
  onSelect: (location: CampusLocation) => void
}

const ANCHOR_HEIGHTS: Record<string, number> = {
  library: 3.35,
  pusanika: 2.5,
  fssk: 2.55,
  fep: 2.7,
  zaaba: 3.85,
  kkm: 3.2,
  sports: 1.35,
  bus: 1.45,
  danau: 0.95,
  health: 2.35,
}

export default function CampusMap3D({ locations, selected, onSelect }: CampusMap3DProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const markerRefs = useRef<Partial<Record<string, HTMLButtonElement | null>>>({})
  const selectedRef = useRef(selected.id)
  const onSelectRef = useRef(onSelect)
  const resetRef = useRef<(() => void) | null>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    selectedRef.current = selected.id
  }, [selected.id])

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

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
      setFailed(true)
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const compact = window.matchMedia('(max-width: 760px)').matches
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.5 : 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.06
    renderer.domElement.className = 'map3d-canvas'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.07
    controls.enablePan = false
    controls.enableZoom = true
    controls.minDistance = 14
    controls.maxDistance = 36
    controls.minPolarAngle = 0.55
    controls.maxPolarAngle = 1.22
    controls.autoRotate = !reducedMotion
    controls.autoRotateSpeed = 0.32
    controls.rotateSpeed = 0.55
    controls.zoomSpeed = 0.7

    scene.add(new THREE.HemisphereLight(0xf2f8ff, 0x536d54, 2.7))
    const sun = new THREE.DirectionalLight(0xfff4df, 3.4)
    sun.position.set(9, 18, 8)
    sun.castShadow = true
    sun.shadow.mapSize.set(compact ? 1024 : 2048, compact ? 1024 : 2048)
    sun.shadow.camera.left = -13
    sun.shadow.camera.right = 13
    sun.shadow.camera.top = 12
    sun.shadow.camera.bottom = -12
    sun.shadow.camera.near = 1
    sun.shadow.camera.far = 45
    sun.shadow.bias = -0.0008
    sun.shadow.normalBias = 0.02
    scene.add(sun)
    const fill = new THREE.DirectionalLight(0xa8d8ff, 1.1)
    fill.position.set(-9, 6, -8)
    scene.add(fill)

    const materials = {
      grass: new THREE.MeshStandardMaterial({ color: '#cfe4cd', roughness: 0.95 }),
      grassSoft: new THREE.MeshStandardMaterial({ color: '#dcead8', roughness: 0.95 }),
      base: new THREE.MeshStandardMaterial({ color: '#f2eee5', roughness: 0.9 }),
      road: new THREE.MeshStandardMaterial({ color: '#f4f6f2', roughness: 0.94 }),
      roadEdge: new THREE.MeshStandardMaterial({ color: '#d7dfd5', roughness: 0.94 }),
      path: new THREE.MeshStandardMaterial({ color: '#f5eee4', roughness: 0.9 }),
      white: new THREE.MeshStandardMaterial({ color: '#fbfbf8', roughness: 0.75 }),
      cream: new THREE.MeshStandardMaterial({ color: '#f4efe3', roughness: 0.8 }),
      stone: new THREE.MeshStandardMaterial({ color: '#e5e8e2', roughness: 0.9 }),
      blueGlass: new THREE.MeshStandardMaterial({
        color: '#72b4e7',
        emissive: '#1b6dc4',
        emissiveIntensity: 0.08,
        roughness: 0.28,
        metalness: 0.18,
      }),
      deepBlue: new THREE.MeshStandardMaterial({ color: '#155fbd', roughness: 0.55 }),
      roof: new THREE.MeshStandardMaterial({ color: '#d8e4eb', roughness: 0.85 }),
      charcoal: new THREE.MeshStandardMaterial({ color: '#495a63', roughness: 0.75 }),
      orange: new THREE.MeshStandardMaterial({ color: '#e7a06b', roughness: 0.8 }),
      wood: new THREE.MeshStandardMaterial({ color: '#b99b79', roughness: 0.9 }),
      water: new THREE.MeshStandardMaterial({
        color: '#8fd1e5',
        roughness: 0.25,
        metalness: 0.08,
        transparent: true,
        opacity: 0.92,
      }),
      track: new THREE.MeshStandardMaterial({ color: '#b8d9bc', roughness: 0.9 }),
      trackLine: new THREE.MeshStandardMaterial({ color: '#fcfcf7', roughness: 0.8 }),
      leaf: new THREE.MeshStandardMaterial({ color: '#7fb58a', roughness: 0.95, flatShading: true }),
      leafDark: new THREE.MeshStandardMaterial({ color: '#5f9d77', roughness: 0.95, flatShading: true }),
      trunk: new THREE.MeshStandardMaterial({ color: '#92735d', roughness: 0.95 }),
      glow: new THREE.MeshStandardMaterial({
        color: '#f7d78e',
        emissive: '#f6bd4a',
        emissiveIntensity: 0.75,
        roughness: 0.4,
      }),
      ring: new THREE.MeshBasicMaterial({
        color: categoryColors[selected.category],
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    }

    const world = new THREE.Group()
    world.position.y = 0
    scene.add(world)

    const shadowed = (mesh: THREE.Mesh) => {
      mesh.castShadow = true
      mesh.receiveShadow = true
      return mesh
    }

    const box = (
      parent: THREE.Object3D,
      geometry: THREE.BufferGeometry,
      material: THREE.Material,
      x = 0,
      y = 0,
      z = 0,
    ) => {
      const mesh = shadowed(new THREE.Mesh(geometry, material))
      mesh.position.set(x, y, z)
      parent.add(mesh)
      return mesh
    }

    const rbox = (
      parent: THREE.Object3D,
      width: number,
      height: number,
      depth: number,
      radius: number,
      material: THREE.Material,
      x = 0,
      y = 0,
      z = 0,
    ) =>
      box(
        parent,
        new RoundedBoxGeometry(width, height, depth, 3, Math.min(radius, height / 2, width / 2)),
        material,
        x,
        y,
        z,
      )

    const plane = (
      parent: THREE.Object3D,
      width: number,
      depth: number,
      material: THREE.Material,
      x = 0,
      y = 0.12,
      z = 0,
    ) => {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), material)
      mesh.rotation.x = -Math.PI / 2
      mesh.position.set(x, y, z)
      mesh.receiveShadow = true
      parent.add(mesh)
      return mesh
    }

    // Campus base.
    const base = rbox(world, 22.5, 0.7, 15.4, 0.35, materials.base, 0, -0.45, 0)
    base.receiveShadow = true
    box(world, new THREE.BoxGeometry(21.6, 0.18, 14.5), materials.grass, 0, -0.03, 0)
    const grassy = rbox(world, 21.3, 0.08, 14.2, 0.2, materials.grassSoft, 0, 0.06, 0)
    grassy.receiveShadow = true

    // Roads.
    box(world, new THREE.BoxGeometry(18.6, 0.035, 0.92), materials.roadEdge, 0, 0.115, 0.25)
    box(world, new THREE.BoxGeometry(18.2, 0.04, 0.7), materials.road, 0, 0.13, 0.25)
    box(world, new THREE.BoxGeometry(1.02, 0.035, 11.3), materials.roadEdge, 0.15, 0.115, -1)
    box(world, new THREE.BoxGeometry(0.8, 0.04, 11.2), materials.road, 0.15, 0.13, -1)
    box(world, new THREE.BoxGeometry(13.8, 0.035, 0.86), materials.roadEdge, 1.1, 0.115, 4.75)
    box(world, new THREE.BoxGeometry(13.6, 0.04, 0.64), materials.road, 1.1, 0.13, 4.75)
    box(world, new THREE.BoxGeometry(0.86, 0.035, 10.6), materials.roadEdge, -7.3, 0.115, -0.7)
    box(world, new THREE.BoxGeometry(0.64, 0.04, 10.5), materials.road, -7.3, 0.13, -0.7)

    // Crosswalk marks at the main entrance.
    for (let i = 0; i < 6; i += 1) {
      box(world, new THREE.BoxGeometry(0.92, 0.01, 0.06), materials.white, 0.15, 0.17, 4.3 + i * 0.11)
    }

    // Plaza around Pusanika.
    cylinder(world, 1.65, 1.65, 0.06, 36, materials.path, 0.6, 0.15, 0.55)
    cylinder(world, 1.4, 1.4, 0.04, 36, materials.stone, 0.6, 0.19, 0.55)

    function cylinder(
      parent: THREE.Object3D,
      radiusTop: number,
      radiusBottom: number,
      height: number,
      segments: number,
      material: THREE.Material,
      x = 0,
      y = 0,
      z = 0,
    ) {
      return box(
        parent,
        new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments),
        material,
        x,
        y,
        z,
      )
    }

    // Sports field.
    box(world, new RoundedBoxGeometry(4.2, 0.12, 2.9, 3, 0.2), materials.track, -5.1, 0.16, 2.7)
    box(world, new RoundedBoxGeometry(3.5, 0.03, 2.25, 3, 0.14), materials.grassSoft, -5.1, 0.23, 2.7)
    box(world, new THREE.BoxGeometry(3.5, 0.01, 0.04), materials.trackLine, -5.1, 0.25, 2.7)
    cylinder(world, 0.46, 0.46, 0.02, 32, materials.trackLine, -5.1, 0.255, 2.7).scale.set(1, 1, 0.72)

    const buildingGroups: Record<string, THREE.Group> = {}
    const hitboxes: Array<THREE.Mesh> = []
    const register = (id: string, group: THREE.Group) => {
      buildingGroups[id] = group
      group.userData.locationId = id
      group.traverse((child) => {
        if (child instanceof THREE.Mesh && !child.userData.noSelect) {
          child.userData.locationId = id
        }
      })
    }

    const addHitbox = (group: THREE.Group, width: number, depth: number, height: number, y: number) => {
      const hit = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
      )
      hit.position.y = y
      hit.userData.locationId = group.userData.locationId
      group.add(hit)
      hitboxes.push(hit)
    }

    const addWindows = (
      parent: THREE.Object3D,
      width: number,
      height: number,
      x: number,
      y: number,
      z: number,
      count: number,
      direction: 'front' | 'side' = 'front',
    ) => {
      const gap = width / count
      for (let i = 0; i < count; i += 1) {
        const win = new THREE.Mesh(
          new THREE.BoxGeometry(direction === 'front' ? gap * 0.54 : 0.045, height, direction === 'front' ? 0.045 : gap * 0.54),
          materials.blueGlass,
        )
        win.position.set(
          direction === 'front' ? x - width / 2 + gap * (i + 0.5) : x,
          y,
          direction === 'front' ? z : z - width / 2 + gap * (i + 0.5),
        )
        parent.add(win)
      }
    }

    const addTree = (x: number, z: number, scale = 1, dark = false) => {
      const tree = new THREE.Group()
      tree.position.set(x, 0.1, z)
      tree.scale.setScalar(scale)
      world.add(tree)
      cylinder(tree, 0.05, 0.075, 0.5, 6, materials.trunk, 0, 0.25, 0)
      const leaf = dark ? materials.leafDark : materials.leaf
      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.38, 0), leaf)
      crown.position.y = 0.68
      crown.scale.y = 0.9
      crown.castShadow = true
      tree.add(crown)
      const top = new THREE.Mesh(new THREE.IcosahedronGeometry(0.25, 0), leaf)
      top.position.set(0.15, 0.9, -0.06)
      top.castShadow = true
      tree.add(top)
    }

    // Library.
    {
      const group = new THREE.Group()
      group.position.set(-0.5, 0.12, -2.75)
      world.add(group)
      rbox(group, 4.2, 0.17, 2.6, 0.1, materials.stone, 0, 0.05, 0)
      rbox(group, 3.65, 1.9, 2.2, 0.09, materials.white, 0, 1.08, 0)
      rbox(group, 2.65, 0.95, 1.4, 0.06, materials.blueGlass, 0, 1.55, 0.55)
      addWindows(group, 2.2, 0.55, 0, 1.56, 1.27, 7)
      rbox(group, 3.9, 0.12, 2.44, 0.04, materials.roof, 0, 2.09, 0)
      rbox(group, 1.1, 0.45, 1.25, 0.05, materials.white, -1.0, 2.34, 0)
      rbox(group, 2.5, 0.4, 1.3, 0.05, materials.white, 0.8, 2.28, -0.45)
      rbox(group, 0.7, 0.75, 0.16, 0.03, materials.deepBlue, 0, 0.47, 1.14)
      register('library', group)
      addHitbox(group, 4.4, 2.7, 2.7, 1.3)
    }

    // Pusanika.
    {
      const group = new THREE.Group()
      group.position.set(0.65, 0.12, 0.6)
      world.add(group)
      rbox(group, 3.7, 0.14, 2.3, 0.08, materials.stone, 0, 0.04, 0)
      rbox(group, 3.15, 1.15, 1.85, 0.1, materials.cream, 0, 0.72, 0)
      rbox(group, 2.75, 0.4, 1.45, 0.05, materials.blueGlass, 0, 1.03, 0.23)
      rbox(group, 3.4, 0.12, 2.0, 0.06, materials.white, 0, 1.36, 0)
      // Roof terrace and umbrellas.
      rbox(group, 1.0, 0.06, 0.8, 0.04, materials.path, -0.75, 1.43, -0.55)
      cylinder(group, 0.025, 0.03, 0.8, 7, materials.charcoal, 0.95, 1.65, -0.55)
      const canopy = new THREE.Mesh(new THREE.ConeGeometry(0.52, 0.23, 8), materials.orange)
      canopy.position.set(0.95, 2.0, -0.55)
      canopy.castShadow = true
      group.add(canopy)
      register('pusanika', group)
      addHitbox(group, 3.9, 2.5, 2.1, 1.05)
    }

    // FEP.
    {
      const group = new THREE.Group()
      group.position.set(-4.05, 0.12, -2.2)
      world.add(group)
      rbox(group, 3.1, 0.12, 2.2, 0.06, materials.stone, 0, 0.05, 0)
      rbox(group, 2.5, 1.65, 1.65, 0.08, materials.white, -0.2, 0.91, 0)
      rbox(group, 1.4, 1.2, 1.3, 0.06, materials.cream, 1.15, 0.69, 0.25)
      addWindows(group, 1.8, 0.8, -0.2, 0.91, 0.84, 5)
      addWindows(group, 0.9, 0.5, 1.15, 0.7, 0.92, 3)
      rbox(group, 2.75, 0.12, 1.8, 0.04, materials.roof, -0.2, 1.82, 0)
      register('fep', group)
      addHitbox(group, 3.2, 2.3, 2.4, 1.2)
    }

    // FSSK.
    {
      const group = new THREE.Group()
      group.position.set(-4.2, 0.12, 0.55)
      world.add(group)
      rbox(group, 3.3, 0.13, 2.1, 0.06, materials.stone, 0, 0.05, 0)
      rbox(group, 2.8, 1.45, 1.5, 0.08, materials.white, 0, 0.82, 0)
      rbox(group, 1.55, 0.85, 1.2, 0.06, materials.cream, 1.45, 0.5, 0.1)
      addWindows(group, 2.1, 0.65, 0, 0.86, 0.77, 6)
      rbox(group, 3.0, 0.1, 1.7, 0.04, materials.roof, 0, 1.62, 0)
      cylinder(group, 0.22, 0.23, 0.7, 8, materials.white, -0.65, 2.05, -0.2)
      register('fssk', group)
      addHitbox(group, 3.4, 2.2, 2.4, 1.2)
    }

    // Kolej Za'ba.
    {
      const group = new THREE.Group()
      group.position.set(4.2, 0.12, 0.5)
      world.add(group)
      rbox(group, 3.5, 0.13, 2.6, 0.07, materials.stone, 0, 0.05, 0)
      const towerSpecs = [
        [-1.05, 1.55, 1.1, 2.4],
        [0, 1.75, 1.15, 2.9],
        [1.05, 1.4, 1.08, 2.15],
      ]
      for (const [x, h, w, top] of towerSpecs) {
        rbox(group, w, h, 1.5, 0.06, materials.white, x, h / 2 + 0.12, 0)
        rbox(group, w + 0.1, 0.09, 1.6, 0.03, materials.roof, x, top + 0.17, 0)
        for (let floor = 0; floor < 3; floor += 1) {
          rbox(group, w * 0.72, 0.18, 0.05, 0.015, materials.blueGlass, x, 0.55 + floor * 0.55, 0.78)
        }
      }
      register('zaaba', group)
      addHitbox(group, 3.8, 2.8, 3.5, 1.7)
    }

    // Kolej Keris Mas.
    {
      const group = new THREE.Group()
      group.position.set(2.3, 0.12, 3.4)
      world.add(group)
      rbox(group, 3.0, 0.13, 2.0, 0.06, materials.stone, 0, 0.05, 0)
      rbox(group, 2.4, 1.75, 1.28, 0.07, materials.white, -0.3, 0.97, 0)
      rbox(group, 1.25, 1.2, 1.1, 0.06, materials.cream, 1.15, 0.7, 0.15)
      for (let floor = 0; floor < 3; floor += 1) {
        rbox(group, 1.9, 0.17, 0.04, 0.015, materials.blueGlass, -0.3, 0.48 + floor * 0.43, 0.66)
      }
      rbox(group, 2.7, 0.1, 1.5, 0.03, materials.roof, -0.3, 1.9, 0)
      register('kkm', group)
      addHitbox(group, 3.2, 2.2, 2.7, 1.3)
    }

    // Health centre.
    {
      const group = new THREE.Group()
      group.position.set(-1.85, 0.12, 3.02)
      world.add(group)
      rbox(group, 2.2, 0.11, 1.7, 0.05, materials.stone, 0, 0.04, 0)
      rbox(group, 1.8, 1.0, 1.2, 0.07, materials.white, 0, 0.6, 0)
      rbox(group, 0.56, 0.045, 0.18, 0.01, materials.deepBlue, -0.22, 1.03, 0.61)
      rbox(group, 0.18, 0.045, 0.56, 0.01, materials.deepBlue, -0.22, 1.03, 0.61)
      rbox(group, 1.92, 0.08, 1.3, 0.03, materials.roof, 0, 1.13, 0)
      register('health', group)
      addHitbox(group, 2.4, 1.9, 1.8, 0.9)
    }

    // Bus terminal.
    {
      const group = new THREE.Group()
      group.position.set(0.25, 0.12, 4.05)
      world.add(group)
      rbox(group, 2.6, 0.09, 1.1, 0.06, materials.stone, 0, 0.04, 0)
      rbox(group, 2.1, 0.12, 0.9, 0.04, materials.roof, 0, 1.12, 0)
      for (const x of [-0.85, 0.85]) {
        for (const z of [-0.32, 0.32]) {
          cylinder(group, 0.035, 0.04, 1.02, 8, materials.charcoal, x, 0.6, z)
        }
      }
      rbox(group, 1.4, 0.48, 0.55, 0.08, materials.blueGlass, 0.25, 0.5, 0)
      register('bus', group)
      addHitbox(group, 2.8, 1.4, 1.4, 0.7)
    }

    // Danau.
    {
      const group = new THREE.Group()
      group.position.set(6.2, 0.12, -2.0)
      group.userData.noSelect = false
      world.add(group)
      const pond = new THREE.Mesh(new THREE.CircleGeometry(1.3, 32), materials.water)
      pond.rotation.x = -Math.PI / 2
      pond.scale.set(1, 0.7, 1)
      pond.position.y = 0.05
      group.add(pond)
      const edge = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.36, 32), materials.path)
      edge.rotation.x = -Math.PI / 2
      edge.scale.set(1, 0.7, 1)
      edge.position.y = 0.055
      group.add(edge)
      register('danau', group)
      const hit = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 0.5, 12),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }),
      )
      hit.position.y = 0.25
      hit.userData.locationId = 'danau'
      group.add(hit)
      hitboxes.push(hit)
    }

    // Sports complex marker group (mostly green field prepared earlier).
    {
      const group = new THREE.Group()
      group.position.set(-5.1, 0.12, 2.7)
      world.add(group)
      rbox(group, 0.9, 0.9, 1.4, 0.05, materials.white, 1.8, 0.55, 0.9)
      register('sports', group)
      const hit = new THREE.Mesh(
        new THREE.BoxGeometry(4.2, 0.8, 3),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }),
      )
      hit.position.y = 0.45
      hit.userData.locationId = 'sports'
      group.add(hit)
      hitboxes.push(hit)
    }

    // Trees and small site details.
    const treePositions: Array<[number, number, number]> = [
      [-8.4, -4.3, 1],
      [-7.4, -3.7, 0.82],
      [-6.5, -4.8, 1.1],
      [-3.0, -4.8, 0.85],
      [1.8, -4.9, 1.0],
      [3.5, -4.4, 1.1],
      [7.7, -4.5, 0.9],
      [8.6, -3.8, 1.2],
      [9.0, 0.4, 0.85],
      [8.7, 3.2, 1.0],
      [7.2, 4.9, 0.8],
      [4.8, 5.2, 1.0],
      [2.9, 1.8, 0.7],
      [-2.4, 1.8, 0.8],
      [-6.7, 1.1, 0.9],
      [-8.6, 2.4, 1.05],
      [-3.0, 5.1, 0.8],
      [-1.0, -0.6, 0.65],
      [3.0, -1.2, 0.7],
      [1.5, 2.1, 0.65],
    ]
    for (const [x, z, scale] of treePositions) addTree(x, z, scale, Math.random() > 0.55)

    // Lamp posts around the plaza.
    for (let i = 0; i < 6; i += 1) {
      const angle = (i / 6) * Math.PI * 2
      const x = 0.6 + Math.cos(angle) * 2.2
      const z = 0.55 + Math.sin(angle) * 1.7
      cylinder(world, 0.02, 0.025, 0.75, 6, materials.charcoal, x, 0.6, z)
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), materials.glow)
      lamp.position.set(x, 1.02, z)
      world.add(lamp)
    }

    // Selected marker ring.
    const selectedRing = new THREE.Mesh(
      new THREE.RingGeometry(0.48, 0.62, 40),
      new THREE.MeshBasicMaterial({
        color: '#1769ff',
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    )
    selectedRing.rotation.x = -Math.PI / 2
    selectedRing.position.y = 0.28
    world.add(selectedRing)

    // World-space anchors for labels.
    const anchors = locations.map((location) => {
      const group = buildingGroups[location.id]
      return {
        location,
        vector: new THREE.Vector3(
          group?.position.x ?? (location.x / 100 - 0.5) * 21,
          ANCHOR_HEIGHTS[location.id] ?? 2,
          group?.position.z ?? (location.y / 100 - 0.5) * 14,
        ),
      }
    })

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let hovered: string | null = null
    let downPoint: { x: number; y: number } | null = null

    const getHit = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(hitboxes, false)
      return (hits[0]?.object.userData.locationId as string | undefined) ?? null
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const hit = getHit(event.clientX, event.clientY)
      if (hit !== hovered) {
        hovered = hit
        renderer.domElement.style.cursor = hit ? 'pointer' : 'grab'
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      downPoint = { x: event.clientX, y: event.clientY }
    }

    const onPointerUp = (event: PointerEvent) => {
      if (!downPoint) return
      const moved = Math.hypot(event.clientX - downPoint.x, event.clientY - downPoint.y)
      downPoint = null
      if (moved > 6) return
      const hit = getHit(event.clientX, event.clientY)
      if (hit) {
        const location = locations.find((item) => item.id === hit)
        if (location) onSelectRef.current(location)
      }
    }

    let resumeTimer = 0
    const onControlStart = () => {
      controls.autoRotate = false
      window.clearTimeout(resumeTimer)
    }
    const onControlEnd = () => {
      resumeTimer = window.setTimeout(() => {
        if (!reducedMotion) controls.autoRotate = true
      }, 7000)
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointerup', onPointerUp)
    controls.addEventListener('start', onControlStart)
    controls.addEventListener('end', onControlEnd)

    let width = 1
    let height = 1
    const cameraDirection = new THREE.Vector3(0.62, 0.66, 0.72).normalize()
    const cameraTarget = new THREE.Vector3(0, 0.35, 0)
    const resize = () => {
      width = Math.max(1, host.clientWidth)
      height = Math.max(1, host.clientHeight)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      const vFov = THREE.MathUtils.degToRad(camera.fov)
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect)
      const distance = Math.max(
        16.8 / (2 * Math.tan(vFov / 2)),
        23.7 / (2 * Math.tan(hFov / 2)),
      )
      camera.position.copy(cameraTarget).addScaledVector(cameraDirection, distance * 1.07)
      controls.target.copy(cameraTarget)
      controls.update()
    }
    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)

    const resetView = () => {
      controls.autoRotate = !reducedMotion
      resize()
    }
    resetRef.current = resetView

    const projected = new THREE.Vector3()
    let frameId = 0
    let firstFrame = true
    const start = performance.now()

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const elapsed = (performance.now() - start) / 1000
      controls.update()

      const active = locations.find((location) => location.id === selectedRef.current)
      if (active) {
        const activeGroup = buildingGroups[active.id]
        selectedRing.position.x =
          activeGroup?.position.x ?? (active.x / 100 - 0.5) * 21
        selectedRing.position.z =
          activeGroup?.position.z ?? (active.y / 100 - 0.5) * 14
        const ringMat = selectedRing.material as THREE.MeshBasicMaterial
        ringMat.color.set(categoryColors[active.category])
        ringMat.opacity = 0.38 + Math.sin(elapsed * 2.4) * 0.12
      }
      selectedRing.scale.setScalar(1 + Math.sin(elapsed * 2.2) * 0.06)

      for (const anchor of anchors) {
        const marker = markerRefs.current[anchor.location.id]
        if (!marker) continue
        projected.copy(anchor.vector).project(camera)
        const screenX = (projected.x * 0.5 + 0.5) * width
        const screenY = (-projected.y * 0.5 + 0.5) * height
        const visible =
          projected.z < 1 && screenX > 12 && screenX < width - 12 && screenY > 20 && screenY < height - 12
        marker.style.opacity = visible ? '1' : '0'
        marker.style.pointerEvents = visible ? 'auto' : 'none'
        marker.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -100%)`
      }

      renderer.render(scene, camera)
      if (firstFrame) {
        firstFrame = false
        setReady(true)
      }
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.clearTimeout(resumeTimer)
      resizeObserver.disconnect()
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointerup', onPointerUp)
      controls.removeEventListener('start', onControlStart)
      controls.removeEventListener('end', onControlEnd)
      controls.dispose()
      resetRef.current = null
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry?.dispose()
          const material = object.material
          if (Array.isArray(material)) material.forEach((item) => item.dispose())
          else material?.dispose()
        }
      })
      Object.values(materials).forEach((material) => material.dispose())
      selectedRing.geometry.dispose()
      ;(selectedRing.material as THREE.Material).dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [locations])

  return (
    <div className="map-stage map-stage--3d">
      <div className="map3d-host" ref={hostRef} />
      {!ready && !failed && (
        <div className="map3d-loading">
          <span className="map3d-loading__cube">
            <i />
            <i />
            <i />
          </span>
          <p>正在搭建 3D 校园…</p>
        </div>
      )}
      {failed && (
        <div className="map3d-failed">
          <p>当前浏览器无法加载 3D 校园。切换到 2D 地图也可以继续探索。</p>
        </div>
      )}

      <div className="map3d-ui">
        <span className="map3d-chip">
          <span className="live-dot" /> 3D CAMPUS · UKM BANGI
        </span>
        <button className="map3d-reset" onClick={() => resetRef.current?.()}>
          <RotateCcw size={14} strokeWidth={2} /> 重置视角
        </button>
      </div>

      <div className="map3d-pins" aria-label="3D 校园地点">
        {locations.map((location) => {
          const Icon = locationIconMap[location.icon]
          const active = location.id === selected.id
          return (
            <button
              key={location.id}
              ref={(element) => {
                markerRefs.current[location.id] = element
              }}
              className={cn('map3d-pin', active && 'is-active')}
              style={
                {
                  '--pin-color': categoryColors[location.category],
                } as CSSProperties
              }
              onClick={() => onSelect(location)}
              aria-label={`${location.name}，${location.category}`}
              aria-pressed={active}
            >
              <span className="map3d-pin__dot">
                <Icon size={13} strokeWidth={2.2} />
              </span>
              <span className="map3d-pin__label">
                <strong>{location.name}</strong>
                <small>{location.category}</small>
              </span>
            </button>
          )
        })}
      </div>

      <div className="map3d-hint">
        <Move3d size={14} strokeWidth={2} />
        拖拽旋转
        <i />
        <Maximize2 size={13} strokeWidth={2} />
        滚轮缩放
      </div>
    </div>
  )
}
