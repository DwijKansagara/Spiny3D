import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';

interface ModelRendererProps {
  modelObject: THREE.Object3D;
  isWireframe: boolean;
}

export const ModelRenderer: React.FC<ModelRendererProps> = ({
  modelObject,
  isWireframe,
}) => {
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

  return <primitive object={normalizedObject} />;
};
