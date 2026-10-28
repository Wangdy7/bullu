import { Suspense, type MutableRefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'
import { BullParticles } from './BullParticles'
import type { IntroQuality } from './quality'
import type { IntroState } from './useIntroTimeline'

interface BullSceneProps {
  stateRef: MutableRefObject<IntroState>
  quality: IntroQuality
  onReady: () => void
}

function CameraRig({ stateRef }: { stateRef: MutableRefObject<IntroState> }) {
  const { camera } = useThree()

  useFrame(({ clock }) => {
    const state = stateRef.current
    const time = clock.elapsedTime
    const shake = state.charge * 0.008 + state.impact * 0.055
    camera.position.x = Math.sin(time * 37.0) * shake
    camera.position.y = 1.45 + state.charge * 0.08 + Math.cos(time * 29.0) * shake * 0.5
    camera.position.z = 7.4 - state.charge * 2.0 - state.impact * 1.7
    camera.lookAt(0, 1.15, 0)
  })

  return null
}

function SceneContent({ stateRef, quality, onReady }: BullSceneProps) {
  return (
    <>
      <color attach="background" args={['#02050c']} />
      <CameraRig stateRef={stateRef} />
      <Suspense fallback={null}>
        <BullParticles stateRef={stateRef} quality={quality} onReady={onReady} />
      </Suspense>
      {quality.bloom && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={1.3}
            luminanceThreshold={0.16}
            luminanceSmoothing={0.32}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  )
}

export function BullScene({ stateRef, quality, onReady }: BullSceneProps) {
  return (
    <Canvas
      className="bull-intro3d__canvas"
      dpr={quality.dpr}
      camera={{ position: [0, 1.45, 7.4], fov: 42, near: 0.1, far: 60 }}
      gl={{
        antialias: quality.antialias,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.NoToneMapping,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor('#02050c', 1)
      }}
    >
      <SceneContent stateRef={stateRef} quality={quality} onReady={onReady} />
    </Canvas>
  )
}
