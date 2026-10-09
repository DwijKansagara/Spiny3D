import { useRef, useState, useImperativeHandle, forwardRef, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Center, Bounds, useBounds, PerspectiveCamera } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
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

// Helper inside Bounds to trigger auto-fit when camera is reset or model is loaded
function BoundsAutoFitController({ trigger }: { trigger: number }) {
  const bounds = useBounds();

  useEffect(() => {
    if (bounds) {
      bounds.refresh().clip().fit();
    }
  }, [bounds, trigger]);

  return null;
}

export const Viewer3D = forwardRef<Viewer3DHandle, Viewer3DProps>(
  ({ modelObject, lightingPreset, isWireframe, isAutoSpin }, ref) => {
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const [resetSignal, setResetSignal] = useState(0);

    useImperativeHandle(ref, () => ({
      resetCamera: () => {
        if (controlsRef.current) {
          controlsRef.current.target.set(0, 0, 0);
          controlsRef.current.reset();
        }
        setResetSignal((prev) => prev + 1);
      },
      getCanvasElement: () => {
        return canvasContainerRef.current?.querySelector('canvas') || null;
      },
    }));

    return (
      <div
        ref={canvasContainerRef}
        className="relative w-full h-full min-h-[400px] bg-gradient-to-b from-[#090a0f] to-[#12141c] overflow-hidden select-none canvas-interactive rounded-2xl border border-oled-border"
        role="region"
        aria-label="Interactive 3D model viewport. Use touch or mouse drag to orbit 360 degrees."
        tabIndex={0}
      >
        <Canvas
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

          {/* Orbit Controls: Unrestricted 360° Horizontal & Vertical Orbit with Inertia */}
          <OrbitControls
            ref={controlsRef}
            enableDamping={true}
            dampingFactor={0.05}
            autoRotate={isAutoSpin}
            autoRotateSpeed={1.2}
            minDistance={0.5}
            maxDistance={12.0}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            target={[0, 0, 0]}
            makeDefault
          />

          {/* Model Auto-Bounds Normalization & Auto-Fit */}
          <Suspense fallback={null}>
            {modelObject && (
              <Bounds fit clip observe margin={1.2}>
                <BoundsAutoFitController trigger={resetSignal} />
                <Center position={[0, 0, 0]}>
                  <ModelRenderer
                    modelObject={modelObject}
                    isWireframe={isWireframe}
                  />
                </Center>
              </Bounds>
            )}
          </Suspense>

          {/* Horizontal Ground Contact Shadow at base (y = -1.02, never clips into back of normalized object) */}
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
