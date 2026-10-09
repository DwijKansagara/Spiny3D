import type * as THREE from 'three';

export type PipelineStage = 
  | 'idle'
  | 'analyzing_depth'
  | 'generating_pointcloud'
  | 'baking_textures'
  | 'finalizing_mesh'
  | 'completed'
  | 'failed';

export interface GenerationProgress {
  stage: PipelineStage;
  stageName: string;
  stepNumber: number;
  totalSteps: number;
  percent: number;
  message: string;
  elapsedSeconds: number;
}

export type LightingPreset = 'studio_daylight' | 'soft_rim' | 'high_contrast';

export interface ModelStats {
  vertices: number;
  triangles: number;
  format: 'GLB' | 'OBJ' | 'Procedural Mesh';
  fileSizeBytes: number;
}

export interface Generated3DModel {
  id: string;
  name: string;
  sourceImageUrl?: string;
  originalFileName?: string;
  glbUrl?: string;
  objUrl?: string;
  meshObject?: THREE.Object3D;
  stats: ModelStats;
  depthMapUrl?: string;
  createdAt: string;
}

export interface PresetDemo {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnailUrl: string;
  stats: ModelStats;
}

export type EngineProvider = 'mock_local' | 'tripo3d' | 'meshy' | 'lgm';

export interface GenerationConfig {
  engine: EngineProvider;
  textureResolution: 1024 | 2048;
  targetPolycount: 'standard' | 'high';
  wireframeDefault: boolean;
  apiKeys?: {
    tripo?: string;
    meshy?: string;
  };
}
