import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'
import type { IntroQuality } from './quality'
import type { IntroState } from './useIntroTimeline'
import { bullParticleFragmentShader, bullParticleVertexShader } from './particleShaders'

const MODEL_URL = './models/bull.glb'
const BULL_HEIGHT = 2.3

interface BullParticlesProps {
  stateRef: MutableRefObject<IntroState>
  quality: IntroQuality
  onReady?: () => void
}

interface ParticleGeometry {
  geometry: THREE.BufferGeometry
  targetPositions: Float32Array
}

export function BullParticles({ stateRef, quality, onReady }: BullParticlesProps) {
  const gltf = useGLTF(MODEL_URL)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const mesh = useMemo(() => {
    let selected: THREE.Mesh | null = null
    gltf.scene.updateMatrixWorld(true)
    gltf.scene.traverse((object) => {
      const candidate = object as THREE.Mesh
      if (!candidate.isMesh || !candidate.geometry?.attributes.position) return
      const count = candidate.geometry.attributes.position.count
      const selectedCount = selected?.geometry.attributes.position.count ?? 0
      if (!selected || count > selectedCount) selected = candidate
    })
    return selected as THREE.Mesh | null
  }, [gltf.scene])

  const particleData = useMemo<ParticleGeometry | null>(() => {
    if (!mesh) return null

    const sampler = new MeshSurfaceSampler(mesh).build()
    const box = new THREE.Box3().setFromObject(mesh)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const scale = BULL_HEIGHT / Math.max(0.001, size.y)
    const normalizedWidth = size.x * scale
    const normalizedLength = size.z * scale

    const count = quality.particleCount
    const positions = new Float32Array(count * 3)
    const starts = new Float32Array(count * 3)
    const directions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    const parts = new Float32Array(count)

    const sample = new THREE.Vector3()
    const world = new THREE.Vector3()
    const direction = new THREE.Vector3()

    for (let index = 0; index < count; index += 1) {
      sampler.sample(sample)
      world.copy(sample).applyMatrix4(mesh.matrixWorld)

      const x = (world.x - center.x) * scale
      const y = (world.y - box.min.y) * scale
      // The source asset faces Blender -Y, which becomes glTF -Z. Flip it
      // so the head faces the camera and the charge reads as a front charge.
      const z = -(world.z - center.z) * scale

      const nx = x / Math.max(0.001, normalizedWidth)
      const ny = y / BULL_HEIGHT
      const nz = z / Math.max(0.001, normalizedLength)

      let part = 0
      const isLeg = ny < 0.43 && Math.abs(nz) < 0.66 && Math.abs(nx) > 0.09
      if (isLeg) {
        part = nz > 0 ? (nx < 0 ? 1 : 2) : (nx < 0 ? 3 : 4)
      } else if (nz > 0.56 && ny > 0.22) {
        part = 5
      } else if (nz < -0.5 && ny > 0.58) {
        part = 6
      }

      const angle = Math.random() * Math.PI * 2
      const radius = 4.2 + Math.random() * 4.2
      const startX = Math.cos(angle) * radius
      const startY = 0.35 + Math.random() * 3.3
      const startZ = 2.0 + Math.sin(angle) * 2.2 + Math.random() * 4.0

      direction.set(
        x * 1.4 + (Math.random() - 0.5) * 1.8,
        (y - 1.1) * 1.3 + (Math.random() - 0.5) * 1.8,
        z * 1.1 + (Math.random() - 0.5) * 1.8,
      ).normalize()

      positions[index * 3] = x
      positions[index * 3 + 1] = y
      positions[index * 3 + 2] = z
      starts[index * 3] = startX
      starts[index * 3 + 1] = startY
      starts[index * 3 + 2] = startZ
      directions[index * 3] = direction.x
      directions[index * 3 + 1] = direction.y
      directions[index * 3 + 2] = direction.z
      seeds[index] = Math.random()
      parts[index] = part
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aStart', new THREE.BufferAttribute(starts, 3))
    geometry.setAttribute('aDir', new THREE.BufferAttribute(directions, 3))
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    geometry.setAttribute('aPart', new THREE.BufferAttribute(parts, 1))
    geometry.computeBoundingSphere()

    return { geometry, targetPositions: positions }
  }, [mesh, quality.particleCount])

  const uniforms = useMemo(
    () => ({
      uForm: { value: 0 },
      uRun: { value: 0 },
      uCharge: { value: 0 },
      uImpact: { value: 0 },
      uFade: { value: 1 },
      uTime: { value: 0 },
      uSize: { value: quality.pointSize },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, quality.dpr[1]) },
    }),
    [quality.dpr, quality.pointSize],
  )

  useEffect(() => {
    if (!particleData) return
    onReady?.()
  }, [onReady, particleData])

  useEffect(
    () => () => {
      particleData?.geometry.dispose()
      materialRef.current?.dispose()
    },
    [particleData],
  )

  useFrame((_, delta) => {
    const material = materialRef.current
    if (!material) return
    const state = stateRef.current
    const uniformsRef = material.uniforms
    uniformsRef.uTime.value += Math.min(delta, 0.033)
    uniformsRef.uForm.value = state.form
    uniformsRef.uRun.value = state.run
    uniformsRef.uCharge.value = state.charge
    uniformsRef.uImpact.value = state.impact
    uniformsRef.uFade.value = state.fade
  })

  if (!particleData) return null

  return (
    <points geometry={particleData.geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={bullParticleVertexShader}
        fragmentShader={bullParticleFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

useGLTF.preload(MODEL_URL)
