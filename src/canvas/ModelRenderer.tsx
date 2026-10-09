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
  // Clone object to avoid mutating cached geometry/material references
  const clonedObject = useMemo(() => {
    const clone = modelObject.clone(true);

    // Auto-center and normalize scale using bounding box
    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    // Reposition to world origin
    clone.position.sub(center);

    // Scale to standard view radius ~2.5
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const scaleFactor = 2.4 / maxDim;
      clone.scale.multiplyScalar(scaleFactor);
    }

    // Ensure cast/receive shadows
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return clone;
  }, [modelObject]);

  // Apply or remove wireframe dynamically
  useEffect(() => {
    clonedObject.traverse((child) => {
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
  }, [clonedObject, isWireframe]);

  return <primitive object={clonedObject} />;
};
