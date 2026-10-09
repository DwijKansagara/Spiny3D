import React from 'react';
import type { LightingPreset } from '../types';

interface LightingRigProps {
  preset: LightingPreset;
}

export const LightingRig: React.FC<LightingRigProps> = ({ preset }) => {
  switch (preset) {
    case 'soft_rim':
      return (
        <group name="lighting-soft-rim">
          <ambientLight intensity={0.35} color="#cbd5e1" />
          {/* Subtle Key Light */}
          <directionalLight
            position={[2, 3, 3]}
            intensity={0.65}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          {/* Strong Rim Light from behind */}
          <directionalLight position={[-3, 4, -4]} intensity={2.2} color="#38bdf8" />
          <directionalLight position={[3, -2, -3]} intensity={1.2} color="#10b981" />
        </group>
      );

    case 'high_contrast':
      return (
        <group name="lighting-high-contrast">
          <ambientLight intensity={0.15} color="#94a3b8" />
          {/* Intense Directed Key Light */}
          <directionalLight
            position={[5, 6, 4]}
            intensity={2.8}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.5}
            shadow-camera-far={20}
          />
          {/* Very low fill */}
          <directionalLight position={[-4, -2, 2]} intensity={0.2} color="#64748b" />
        </group>
      );

    case 'studio_daylight':
    default:
      return (
        <group name="lighting-studio-daylight">
          <ambientLight intensity={0.7} color="#f8fafc" />
          {/* Primary Key Light */}
          <directionalLight
            position={[4, 5, 4]}
            intensity={1.4}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          {/* Soft Fill Light */}
          <directionalLight position={[-4, 2, -2]} intensity={0.6} color="#e2e8f0" />
          {/* Ground bounce */}
          <directionalLight position={[0, -4, 0]} intensity={0.3} color="#94a3b8" />
        </group>
      );
  }
};
