import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ModelRendererProps {
  modelObject: THREE.Object3D;
  isWireframe: boolean;
}

export const ModelRenderer: React.FC<ModelRendererProps> = ({
  modelObject,
  isWireframe,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const mountScaleRef = useRef<number>(0.94);
  const isTransitioningRef = useRef<boolean>(true);

  // Clone object and apply strict bounding-box normalization
  const normalizedObject = useMemo(() => {
    const clone = modelObject.clone(true);

    // Compute bounding box using Three.js Box3
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Re-center model geometry to [0, 0, 0]
    clone.position.sub(center);

    // Calculate scale so its maximum dimension is strictly 2.0 units
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const scale = 2.0 / maxDim;
      clone.scale.multiplyScalar(scale);
      clone.position.multiplyScalar(scale);
    }

    // Final precision centering to guarantee exact [0, 0, 0] centroid
    const finalBox = new THREE.Box3().setFromObject(clone);
    const finalCenter = new THREE.Vector3();
    finalBox.getCenter(finalCenter);
    clone.position.sub(finalCenter);

    // Ensure cast & receive shadows
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return clone;
  }, [modelObject]);

  // Reset transition spring on new model mount
  useEffect(() => {
    mountScaleRef.current = 0.94;
    isTransitioningRef.current = true;
    if (groupRef.current) {
      groupRef.current.scale.setScalar(0.94);
    }
  }, [modelObject]);

  // Spring physics mount transition (AnimMasterLib / Josh Comeau style)
  useFrame((_, delta) => {
    if (isTransitioningRef.current && groupRef.current) {
      // Smoothly damp scale from 0.94 to 1.0 with spring ease
      mountScaleRef.current = THREE.MathUtils.damp(
        mountScaleRef.current,
        1.0,
        12, // Spring response velocity
        delta
      );

      groupRef.current.scale.setScalar(mountScaleRef.current);

      if (Math.abs(mountScaleRef.current - 1.0) < 0.001) {
        groupRef.current.scale.setScalar(1.0);
        isTransitioningRef.current = false;
      }
    }
  });

  // Apply or remove wireframe dynamically without mutating base textures
  useEffect(() => {
    normalizedObject.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            mat.wireframe = isWireframe;
          });
        } else {
          child.material.wireframe = isWireframe;
        }
      }
    });
  }, [normalizedObject, isWireframe]);

  return (
    <group ref={groupRef}>
      <primitive object={normalizedObject} />
    </group>
  );
};
