import {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  Suspense,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  ContactShadows,
  Center,
  Bounds,
  useBounds,
  PerspectiveCamera,
} from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';
import { LightingRig } from './LightingRig';
import { ModelRenderer } from './ModelRenderer';
import type { LightingPreset } from '../types';

export interface Viewer3DHandle {
  resetCamera: () => void;
  getCanvasElement: () => HTMLCanvasElement | null;
}

interface Viewer3DProps {
  modelObject: THREE.Object3D | null;
  lightingPreset: LightingPreset;
  isWireframe: boolean;
  isAutoSpin: boolean;
}

// Controller inside Canvas for smooth camera reset tween and bounds fit
function CameraTweenController({
  resetTrigger,
  controlsRef,
  onTweenFinish,
}: {
  resetTrigger: number;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  onTweenFinish: () => void;
}) {
  const { camera } = useThree();
  const bounds = useBounds();
  const shouldReduceMotion = useReducedMotion();
  const isTweeningRef = useRef(false);

  const targetPosition = useMemo(() => new THREE.Vector3(0, 1.5, 4.0), []);
  const targetLookAt = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useEffect(() => {
    if (resetTrigger > 0) {
      if (shouldReduceMotion) {
        // Snap instantly if user prefers reduced motion
        camera.position.copy(targetPosition);
        if (controlsRef.current) {
          controlsRef.current.target.copy(targetLookAt);
          controlsRef.current.update();
        }
        bounds?.refresh().clip().fit();
        onTweenFinish();
      } else {
        isTweeningRef.current = true;
      }
    }
  }, [resetTrigger, camera, controlsRef, targetPosition, targetLookAt, bounds, onTweenFinish, shouldReduceMotion]);

  useFrame((_, delta) => {
    if (isTweeningRef.current) {
      // Smoothly damp camera position towards default coordinates
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPosition.x, 9, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPosition.y, 9, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPosition.z, 9, delta);

      if (controlsRef.current) {
        // Smoothly damp target towards origin
        controlsRef.current.target.x = THREE.MathUtils.damp(controlsRef.current.target.x, targetLookAt.x, 9, delta);
        controlsRef.current.target.y = THREE.MathUtils.damp(controlsRef.current.target.y, targetLookAt.y, 9, delta);
        controlsRef.current.target.z = THREE.MathUtils.damp(controlsRef.current.target.z, targetLookAt.z, 9, delta);
        controlsRef.current.update();
      }

      const posDist = camera.position.distanceTo(targetPosition);
      const lookDist = controlsRef.current ? controlsRef.current.target.distanceTo(targetLookAt) : 0;

      // Completion threshold
      if (posDist < 0.02 && lookDist < 0.02) {
        camera.position.copy(targetPosition);
        if (controlsRef.current) {
          controlsRef.current.target.copy(targetLookAt);
          controlsRef.current.update();
        }
        isTweeningRef.current = false;
        bounds?.refresh().clip().fit();
        onTweenFinish();
      }
    }
  });

  return null;
}

// Controller for decoupled smooth auto-spin deceleration & acceleration
function DecoupledAutoSpinController({
  isAutoSpin,
  isUserInteracting,
  controlsRef,
}: {
  isAutoSpin: boolean;
  isUserInteracting: boolean;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const shouldReduceMotion = useReducedMotion();
  const currentSpeedRef = useRef(0);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (shouldReduceMotion) {
      controlsRef.current.autoRotate = false;
      return;
    }

    // When auto-spin is requested and user is not touching/dragging, accelerate to 1.2
    // When user drags, smoothly decelerate to 0 without snapping
    const targetSpeed = isAutoSpin && !isUserInteracting ? 1.2 : 0;

    currentSpeedRef.current = THREE.MathUtils.damp(
      currentSpeedRef.current,
      targetSpeed,
      targetSpeed === 0 ? 12 : 3, // fast deceleration, gentle acceleration
      delta
    );

    controlsRef.current.autoRotateSpeed = currentSpeedRef.current;
    controlsRef.current.autoRotate = currentSpeedRef.current > 0.01;
  });

  return null;
}

export const Viewer3D = forwardRef<Viewer3DHandle, Viewer3DProps>(
  ({ modelObject, lightingPreset, isWireframe, isAutoSpin }, ref) => {
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const [resetSignal, setResetSignal] = useState(0);

    // Frame optimization state: frameloop="demand" when idle, "always" when active
    const [isInteracting, setIsInteracting] = useState(false);
    const [isTweening, setIsTweening] = useState(false);
    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const wakeRenderer = useCallback(() => {
      setIsInteracting(true);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setIsInteracting(false);
      }, 1200);
    }, []);

    useImperativeHandle(ref, () => ({
      resetCamera: () => {
        setIsTweening(true);
        setResetSignal((prev) => prev + 1);
      },
      getCanvasElement: () => {
        return canvasContainerRef.current?.querySelector('canvas') || null;
      },
    }));

    // Frameloop switch: continuous when auto-spinning, interacting, or camera tweening
    const frameloopMode = isAutoSpin || isInteracting || isTweening ? 'always' : 'demand';

    return (
      <div
        ref={canvasContainerRef}
        onPointerDown={wakeRenderer}
        onPointerMove={() => {
          if (isInteracting) wakeRenderer();
        }}
        onWheel={wakeRenderer}
        className="relative w-full h-full min-h-[400px] bg-gradient-to-b from-[#090a0f] to-[#12141c] overflow-hidden select-none canvas-interactive rounded-2xl border border-oled-border"
        role="region"
        aria-label="Interactive 3D model viewport. Use touch or mouse drag to orbit 360 degrees."
        tabIndex={0}
      >
        <Canvas
          frameloop={frameloopMode}
          shadows={{ type: THREE.PCFShadowMap }}
          gl={{
            antialias: true,
            alpha: false,
            preserveDrawingBuffer: true,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Calibrated Perspective Camera with fov=45 */}
          <PerspectiveCamera makeDefault position={[0, 1.5, 4.0]} fov={45} />

          {/* Lighting Environment */}
          <LightingRig preset={lightingPreset} />

          {/* Orbit Controls with Damping */}
          <OrbitControls
            ref={controlsRef}
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={0.5}
            maxDistance={12.0}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            target={[0, 0, 0]}
            onStart={() => {
              setIsInteracting(true);
            }}
            onEnd={() => {
              setIsInteracting(false);
            }}
            makeDefault
          />

          {/* Decoupled Smooth Auto-Spin Controller */}
          <DecoupledAutoSpinController
            isAutoSpin={isAutoSpin}
            isUserInteracting={isInteracting}
            controlsRef={controlsRef}
          />

          {/* Camera Smooth Slerp Tween Controller */}
          <CameraTweenController
            resetTrigger={resetSignal}
            controlsRef={controlsRef}
            onTweenFinish={() => setIsTweening(false)}
          />

          {/* Model Auto-Bounds Normalization & Auto-Fit */}
          <Suspense fallback={null}>
            {modelObject && (
              <Bounds fit clip observe margin={1.2}>
                <Center position={[0, 0, 0]}>
                  <ModelRenderer
                    modelObject={modelObject}
                    isWireframe={isWireframe}
                  />
                </Center>
              </Bounds>
            )}
          </Suspense>

          {/* Horizontal Ground Contact Shadow at base (y = -1.02, cleanly beneath the 2.0-unit model) */}
          <ContactShadows
            position={[0, -1.02, 0]}
            opacity={0.65}
            scale={7}
            blur={2.0}
            far={3.5}
            color="#000000"
          />

          {/* Horizontal Shadow Receiver Plane */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1.025, 0]}
            receiveShadow
          >
            <planeGeometry args={[20, 20]} />
            <shadowMaterial opacity={0.3} />
          </mesh>

          {/* Ground Grid for spatial orientation */}
          <gridHelper
            args={[12, 16, '#2a3044', '#181b26']}
            position={[0, -1.03, 0]}
          />
        </Canvas>

        {/* Orbit Control Accessibility Guidance Badge */}
        <div className="absolute bottom-3 left-3 pointer-events-none z-10 hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-oled-surface/80 backdrop-blur-md border border-oled-border/60 text-[11px] font-mono text-zinc-400">
          <span>Full 360° Orbit (Drag)</span>
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <span>Pinch / Scroll (Zoom)</span>
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <span>Right-drag / Two-finger (Pan)</span>
        </div>
      </div>
    );
  }
);

Viewer3D.displayName = 'Viewer3D';
