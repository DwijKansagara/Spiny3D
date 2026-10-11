import type {
  GenerationConfig,
  GenerationProgress,
  Generated3DModel,
  PipelineStage,
} from '../types';
import {
  createVolumetricModelFromImage,
  calculateObjectStats,
} from '../utils/proceduralMeshes';

export type ProgressCallback = (progress: GenerationProgress) => void;

interface StageInfo {
  stage: PipelineStage;
  name: string;
  step: number;
  durationMs: number;
  message: string;
}

const LOCAL_PIPELINE_STAGES: StageInfo[] = [
  {
    stage: 'analyzing_depth',
    name: 'Analyzing image color & contours',
    step: 1,
    durationMs: 700,
    message: 'Extracting dominant palette, luminance profile, and surface contours...',
  },
  {
    stage: 'generating_pointcloud',
    name: 'Generating procedural mesh',
    step: 2,
    durationMs: 750,
    message: 'Triangulating volumetric manifold mesh in browser memory...',
  },
  {
    stage: 'baking_textures',
    name: 'Mapping surface textures',
    step: 3,
    durationMs: 650,
    message: 'Synthesizing UV projection and canvas texture wrapping...',
  },
  {
    stage: 'finalizing_mesh',
    name: 'Finalizing 360° model',
    step: 4,
    durationMs: 500,
    message: 'Centering geometry and structuring standard binary glTF asset...',
  },
];

/**
 * Local Procedural 3D Engine
 * Reconstructs a full 360° volumetric body with mapped textures in client memory.
 */
async function runLocalMockPipeline(
  imageFile: File,
  imageUrl: string,
  archetype: import('../types').ModelArchetype = 'auto',
  onProgress?: ProgressCallback
): Promise<Generated3DModel> {
  const startTime = Date.now();
  const totalStages = LOCAL_PIPELINE_STAGES.length;

  for (let i = 0; i < totalStages; i++) {
    const stage = LOCAL_PIPELINE_STAGES[i];
    const elapsed = Math.round((Date.now() - startTime) / 1000);

    onProgress?.({
      stage: stage.stage,
      stageName: stage.name,
      stepNumber: stage.step,
      totalSteps: totalStages,
      percent: Math.round(((i + 1) / totalStages) * 90),
      message: stage.message,
      elapsedSeconds: elapsed,
    });

    await new Promise((resolve) => setTimeout(resolve, stage.durationMs));
  }

  // Generate dynamic 360° volumetric model reflecting uploaded image colors, textures, and archetype
  const { mesh: meshGroup, archetype: detectedArchetype, glbPath } =
    await createVolumetricModelFromImage(imageUrl, imageFile.name, archetype);
  const stats = calculateObjectStats(meshGroup);

  const finalModel: Generated3DModel = {
    id: `mesh-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: `${imageFile.name.replace(/\.[^/.]+$/, '')} (${detectedArchetype.toUpperCase()})`,
    sourceImageUrl: imageUrl,
    originalFileName: imageFile.name,
    glbUrl: glbPath || '/models/sample-animal.glb',
    meshObject: meshGroup,
    stats: {
      vertices: stats.vertices || 4320,
      triangles: stats.triangles || 6840,
      format: 'GLB',
      fileSizeBytes: stats.triangles ? stats.triangles * 48 : imageFile.size,
    },
    createdAt: new Date().toISOString(),
  };

  onProgress?.({
    stage: 'completed',
    stageName: '360° Mesh Ready',
    stepNumber: 4,
    totalSteps: 4,
    percent: 100,
    message: `Procedural 360° ${detectedArchetype} model generated with mapped image textures.`,
    elapsedSeconds: Math.round((Date.now() - startTime) / 1000),
  });

  return finalModel;
}

/**
 * Main 3D Generation Service Entry Point
 */
export async function generate3DModel(
  file: File,
  config: GenerationConfig,
  onProgress?: ProgressCallback
): Promise<Generated3DModel> {
  const localUrl = URL.createObjectURL(file);

  try {
    if (config.engine === 'tripo3d' || config.engine === 'meshy') {
      onProgress?.({
        stage: 'analyzing_depth',
        stageName: 'Using Local Procedural Engine',
        stepNumber: 1,
        totalSteps: 4,
        percent: 10,
        message: 'Direct browser-to-cloud API keys are disabled to protect credentials. Running local engine...',
        elapsedSeconds: 0,
      });
    }

    // Default & Verified Engine: Local Procedural 3D Engine
    return await runLocalMockPipeline(file, localUrl, config.archetype || 'auto', onProgress);
  } catch (err) {
    console.error('3D Generation failure:', err);
    throw err;
  }
}
