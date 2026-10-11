import React, { useState, useRef, useEffect } from 'react';
import type * as THREE from 'three';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { UploadZone } from '../components/UploadZone';
import { PresetGallery, PRESET_DEMOS } from '../components/PresetGallery';
import { ProcessingView } from '../components/ProcessingView';
import { Viewer3D, type Viewer3DHandle } from '../canvas/Viewer3D';
import { ControlsToolbar } from '../components/ControlsToolbar';
import { ExportPanel } from '../components/ExportPanel';
import { OriginalImagePreview } from '../components/OriginalImagePreview';
import { ApiSettingsModal } from '../components/ApiSettingsModal';
import { UpgradeModal } from '../components/UpgradeModal';
import { useAuth } from '../context/AuthContext';
import { generate3DModel } from '../api/generate3d';
import {
  createSneakerMesh,
  createCeramicMugMesh,
  createLowPolyDogMesh,
  createIndustrialRobotMesh,
  loadGLBModel,
  calculateObjectStats,
} from '../utils/proceduralMeshes';
import type {
  EngineProvider,
  GenerationConfig,
  GenerationProgress,
  Generated3DModel,
  LightingPreset,
  ModelArchetype,
} from '../types';
import { ArrowLeft, Box, Sparkles, AlertCircle } from 'lucide-react';

export const Home: React.FC = () => {
  // App State: 'upload' | 'processing' | 'viewer'
  const [viewState, setViewState] = useState<'upload' | 'processing' | 'viewer'>('upload');

  // Engine selection
  const [currentEngine, setCurrentEngine] = useState<EngineProvider>('mock_local');

  // API Credentials State (Cloud keys disabled in client demo mode)
  const [tripoKey, setTripoKey] = useState<string>('');
  const [meshyKey, setMeshyKey] = useState<string>('');
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [engineNotice, setEngineNotice] = useState<string | null>(null);

  // Active Model
  const [activeModel, setActiveModel] = useState<Generated3DModel | null>(null);
  const [processingImageUrl, setProcessingImageUrl] = useState<string | null>(null);
  const [processingFileName, setProcessingFileName] = useState<string | null>(null);

  // Processing Progress
  const [progress, setProgress] = useState<GenerationProgress>({
    stage: 'idle',
    stageName: 'Idle',
    stepNumber: 0,
    totalSteps: 4,
    percent: 0,
    message: '',
    elapsedSeconds: 0,
  });

  // Viewer Preferences (stored in localStorage per Cookie & Storage Policy)
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>(() => {
    return (localStorage.getItem('spiny3d_lighting_preset') as LightingPreset) || 'studio_daylight';
  });
  const [isWireframe, setIsWireframe] = useState<boolean>(() => {
    return localStorage.getItem('spiny3d_wireframe_pref') === 'true';
  });
  const [isAutoSpin, setIsAutoSpin] = useState<boolean>(() => {
    return localStorage.getItem('spiny3d_autospin_pref') === 'true';
  });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const viewerRef = useRef<Viewer3DHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isCancelledRef = useRef<boolean>(false);

  // API modal notice handler
  const handleSaveApiKeys = (_keys: { tripo: string; meshy: string }) => {
    setTripoKey('');
    setMeshyKey('');
    setEngineNotice(null);
    setIsApiModalOpen(false);
  };

  // Sync functional preferences to localStorage
  useEffect(() => {
    localStorage.setItem('spiny3d_lighting_preset', lightingPreset);
  }, [lightingPreset]);

  useEffect(() => {
    localStorage.setItem('spiny3d_wireframe_pref', String(isWireframe));
  }, [isWireframe]);

  useEffect(() => {
    localStorage.setItem('spiny3d_autospin_pref', String(isAutoSpin));
  }, [isAutoSpin]);

  // Handle engine change
  const handleEngineChange = (engine: EngineProvider) => {
    setCurrentEngine(engine);
    setEngineNotice(null);
    if (engine === 'tripo3d' || engine === 'meshy') {
      setEngineNotice('Cloud providers are disabled in this client-side demo to protect API credentials. Running local procedural reconstruction engine.');
    }
  };

  const { canConvert, incrementConversionCount } = useAuth();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<string>('');

  // Handle User Image Upload with Archetype and daily quota check
  const handleImageSelected = async (file: File, archetype: ModelArchetype = 'auto') => {
    // Check daily conversion limit
    if (!canConvert()) {
      setUpgradeReason('You have reached the free limit of 5 daily volumetric conversions. Upgrade to Pro for unlimited conversions.');
      setIsUpgradeModalOpen(true);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setProcessingImageUrl(previewUrl);
    setProcessingFileName(file.name);
    setViewState('processing');
    isCancelledRef.current = false;

    const config: GenerationConfig = {
      engine: currentEngine,
      archetype,
      textureResolution: 1024,
      targetPolycount: 'standard',
      wireframeDefault: false,
      apiKeys: {
        tripo: tripoKey,
        meshy: meshyKey,
      },
    };

    try {
      const generated = await generate3DModel(file, config, (p) => {
        if (!isCancelledRef.current) {
          setProgress(p);
        }
      });

      if (!isCancelledRef.current) {
        incrementConversionCount();
        setActiveModel(generated);
        setViewState('viewer');
      }
    } catch (err: unknown) {
      console.error('Generation pipeline failed:', err);
      const errMsg = err instanceof Error ? err.message : 'Unknown generation failure.';
      alert(`Generation encountered an error: ${errMsg}\nCheck your API key or use Local Mock 3D.`);
      setViewState('upload');
    }
  };

  // Handle Preset Demo Selection
  const handleSelectPreset = async (presetId: string) => {
    const demo = PRESET_DEMOS.find((d) => d.id === presetId);
    if (!demo) return;

    let meshObject: THREE.Group;
    switch (presetId) {
      case 'demo-dog':
        try {
          meshObject = await loadGLBModel('/models/sample-animal.glb');
        } catch {
          meshObject = createLowPolyDogMesh();
        }
        break;
      case 'demo-sneaker':
        meshObject = createSneakerMesh();
        break;
      case 'demo-mug':
        meshObject = createCeramicMugMesh();
        break;
      case 'demo-robot':
      default:
        meshObject = createIndustrialRobotMesh();
        break;
    }

    const stats = calculateObjectStats(meshObject);

    const presetModel: Generated3DModel = {
      id: demo.id,
      name: demo.name,
      meshObject,
      stats: {
        vertices: stats.vertices || demo.stats.vertices,
        triangles: stats.triangles || demo.stats.triangles,
        format: 'GLB',
        fileSizeBytes: demo.stats.fileSizeBytes,
      },
      createdAt: new Date().toISOString(),
    };

    setActiveModel(presetModel);
    setViewState('viewer');
  };

  const handleCancelProcessing = () => {
    isCancelledRef.current = true;
    setViewState('upload');
  };

  const handleResetToUpload = () => {
    setViewState('upload');
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-oled-bg text-zinc-100 flex flex-col">
      <Header
        currentEngine={currentEngine}
        onEngineChange={handleEngineChange}
        onResetToUpload={handleResetToUpload}
        onOpenApiSettings={() => setIsApiModalOpen(true)}
        hasCustomKeys={Boolean(tripoKey || meshyKey)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col justify-start">
        {/* API Notification notice */}
        {engineNotice && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{engineNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsApiModalOpen(true)}
              className="px-3 py-1 rounded-lg bg-emerald-600 text-zinc-950 font-medium text-xs hover:bg-emerald-500 font-mono"
            >
              Configure Key
            </button>
          </div>
        )}

        {/* ========================================================
            SCREEN 1: UPLOAD & PRESET DEMO GALLERY
            ======================================================== */}
        {viewState === 'upload' && (
          <div className="space-y-10">
            {/* Semantic Hero Heading */}
            <div className="space-y-3 text-center sm:text-left max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-oled-surface border border-oled-border text-xs font-mono text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>360° Volumetric 3D Mesh Reconstruction</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-100 font-mono">
                Transform 2D Images into Interactive 3D Models
              </h1>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
                Generate full 360° standalone 3D models with responsive touch and mouse orbit controls. Inspect solid topology from every angle, test studio lighting, and export standard binary .GLB assets instantly.
              </p>
            </div>

            {/* Upload Zone */}
            <UploadZone
              onImageSelected={handleImageSelected}
              isProcessing={false}
            />

            {/* Quick Demo Preset Gallery */}
            <PresetGallery
              onSelectPreset={handleSelectPreset}
              isLoading={false}
            />
          </div>
        )}

        {/* ========================================================
            SCREEN 2: REAL PROCESSING PIPELINE STATE
            ======================================================== */}
        {viewState === 'processing' && (
          <div className="py-12 flex items-center justify-center">
            <ProcessingView
              progress={progress}
              onCancel={handleCancelProcessing}
              fileName={processingFileName || activeModel?.originalFileName}
              sourceImageUrl={processingImageUrl || activeModel?.sourceImageUrl}
            />
          </div>
        )}

        {/* ========================================================
            SCREEN 3: INTERACTIVE 3D HERO CANVAS & EXPORT
            ======================================================== */}
        {viewState === 'viewer' && activeModel && (
          <div className="space-y-6">
            {/* Top Toolbar / Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-oled-border pb-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetToUpload}
                  className="p-2 rounded-xl bg-oled-surface hover:bg-oled-panel border border-oled-border text-zinc-300 hover:text-zinc-100 transition-colors flex items-center gap-2 text-xs font-mono"
                  title="Upload a new 2D image"
                >
                  <ArrowLeft className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  <span>New Model</span>
                </button>

                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  <h2 className="text-base font-semibold font-mono text-zinc-100 truncate max-w-xs sm:max-w-md">
                    {activeModel.name}
                  </h2>
                </div>
              </div>

              {/* Viewport Controls Bar */}
              <ControlsToolbar
                isWireframe={isWireframe}
                onToggleWireframe={() => setIsWireframe(!isWireframe)}
                isAutoSpin={isAutoSpin}
                onToggleAutoSpin={() => setIsAutoSpin(!isAutoSpin)}
                lightingPreset={lightingPreset}
                onChangeLighting={setLightingPreset}
                onResetCamera={() => viewerRef.current?.resetCamera()}
                isFullscreen={isFullscreen}
                onToggleFullscreen={handleToggleFullscreen}
              />
            </div>

            {/* Main Stage: 3D Viewport with Side Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              {/* Primary 3D Canvas (Spans 3 cols on desktop) */}
              <div className="lg:col-span-3 w-full h-[480px] sm:h-[600px] relative">
                <Viewer3D
                  ref={viewerRef}
                  modelObject={activeModel.meshObject || null}
                  lightingPreset={lightingPreset}
                  isWireframe={isWireframe}
                  isAutoSpin={isAutoSpin}
                />
              </div>

              {/* Side Panel: 2D Source Image & Export Controls */}
              <div className="lg:col-span-1 space-y-4">
                {/* Original 2D raster preview thumbnail */}
                <OriginalImagePreview
                  imageUrl={activeModel.sourceImageUrl}
                  fileName={activeModel.originalFileName}
                  altText={`Original 2D photograph for ${activeModel.name}`}
                />

                {/* Export actions & AR launcher */}
                <ExportPanel
                  modelObject={activeModel.meshObject || null}
                  modelName={activeModel.name}
                  stats={activeModel.stats}
                  getCanvasElement={() => viewerRef.current?.getCanvasElement() || null}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Cloud API Key Settings Modal */}
      <ApiSettingsModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        tripoKey={tripoKey}
        meshyKey={meshyKey}
        onSaveKeys={handleSaveApiKeys}
      />

      {/* Upgrade Gate Modal for daily conversion limits */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        reason={upgradeReason}
      />

      <Footer />
    </div>
  );
};
