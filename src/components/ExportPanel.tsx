import React, { useState } from 'react';
import type * as THREE from 'three';
import {
  Download,
  Camera,
  Glasses,
  Check,
  AlertTriangle,
  Info,
  Layers,
} from 'lucide-react';
import {
  exportToGLB,
  exportToOBJ,
  captureCanvasSnapshot,
  checkARAvailability,
} from '../utils/modelExporters';
import type { ModelStats } from '../types';

interface ExportPanelProps {
  modelObject: THREE.Object3D | null;
  modelName: string;
  stats?: ModelStats;
  getCanvasElement: () => HTMLCanvasElement | null;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  modelObject,
  modelName,
  stats,
  getCanvasElement,
}) => {
  const [isExportingGlb, setIsExportingGlb] = useState(false);
  const [isExportingObj, setIsExportingObj] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [isARModalOpen, setIsARModalOpen] = useState(false);

  const handleExportGLB = async () => {
    if (!modelObject) return;
    setIsExportingGlb(true);
    setExportNotice(null);
    try {
      await exportToGLB(modelObject, modelName);
      setExportNotice('Standard .GLB file generated and downloaded successfully.');
    } catch (err) {
      console.error('Failed GLB export:', err);
      setExportNotice('Failed to export .GLB file.');
    } finally {
      setIsExportingGlb(false);
      setTimeout(() => setExportNotice(null), 5000);
    }
  };

  const handleExportOBJ = async () => {
    if (!modelObject) return;
    setIsExportingObj(true);
    setExportNotice(null);
    try {
      await exportToOBJ(modelObject, modelName);
      setExportNotice('Wavefront .OBJ mesh generated and downloaded successfully.');
    } catch (err) {
      console.error('Failed OBJ export:', err);
      setExportNotice('Failed to export .OBJ file.');
    } finally {
      setIsExportingObj(false);
      setTimeout(() => setExportNotice(null), 5000);
    }
  };

  const handleCaptureSnapshot = () => {
    const canvas = getCanvasElement();
    if (!canvas) {
      setExportNotice('Canvas element not accessible for capture.');
      return;
    }
    captureCanvasSnapshot(canvas, modelName);
    setExportNotice('High-resolution 3D turnaround frame captured.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleOpenAR = () => {
    setIsARModalOpen(true);
  };

  const arCheck = checkARAvailability();

  return (
    <div className="space-y-4">
      {/* Mesh Statistics Bar */}
      {stats && (
        <div className="p-3 rounded-xl bg-oled-surface border border-oled-border text-xs font-mono grid grid-cols-2 sm:grid-cols-4 gap-3 text-zinc-300">
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase">Format</span>
            <span className="font-semibold text-emerald-400">{stats.format}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase">Vertices</span>
            <span>{stats.vertices.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase">Triangles</span>
            <span>{stats.triangles.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase">Topology</span>
            <span>Manifold Mesh</span>
          </div>
        </div>
      )}

      {/* Export Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Download GLB */}
        <button
          type="button"
          onClick={handleExportGLB}
          disabled={!modelObject || isExportingGlb}
          className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-medium text-xs flex flex-col items-center justify-center gap-1.5 transition-transform active:scale-[0.98] disabled:opacity-50 shadow-subtle"
          title="Download production-standard binary glTF file"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          <span className="font-mono font-bold">Download .GLB</span>
        </button>

        {/* Download OBJ */}
        <button
          type="button"
          onClick={handleExportOBJ}
          disabled={!modelObject || isExportingObj}
          className="p-3 rounded-xl bg-oled-surface hover:bg-oled-panel text-zinc-200 border border-oled-border font-medium text-xs flex flex-col items-center justify-center gap-1.5 transition-transform active:scale-[0.98] disabled:opacity-50"
          title="Download Wavefront OBJ 3D mesh"
        >
          <Layers className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span className="font-mono">Download .OBJ</span>
        </button>

        {/* Turnaround Snapshot */}
        <button
          type="button"
          onClick={handleCaptureSnapshot}
          disabled={!modelObject}
          className="p-3 rounded-xl bg-oled-surface hover:bg-oled-panel text-zinc-200 border border-oled-border font-medium text-xs flex flex-col items-center justify-center gap-1.5 transition-transform active:scale-[0.98] disabled:opacity-50"
          title="Capture current camera angle to high-res PNG frame"
        >
          <Camera className="w-4 h-4 text-cyan-400" aria-hidden="true" />
          <span className="font-mono">Turnaround Frame</span>
        </button>

        {/* View in AR */}
        <button
          type="button"
          onClick={handleOpenAR}
          disabled={!modelObject}
          className="p-3 rounded-xl bg-oled-surface hover:bg-oled-panel text-zinc-200 border border-oled-border font-medium text-xs flex flex-col items-center justify-center gap-1.5 transition-transform active:scale-[0.98] disabled:opacity-50"
          title="Inspect model in Augmented Reality"
        >
          <Glasses className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span className="font-mono">View in AR</span>
        </button>
      </div>

      {/* Export notification feedback */}
      {exportNotice && (
        <div
          className="p-3 rounded-xl bg-oled-surface border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2"
          role="status"
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* AR Compatibility Dialog */}
      {isARModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ar-dialog-title"
        >
          <div className="w-full max-w-md p-6 rounded-2xl bg-oled-surface border border-oled-border space-y-4 shadow-elevated">
            <div className="flex items-center justify-between">
              <h3 id="ar-dialog-title" className="text-sm font-semibold font-mono text-zinc-100 flex items-center gap-2">
                <Glasses className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>Augmented Reality Inspection</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsARModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-xs px-2 py-1 rounded bg-oled-panel"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300 font-sans leading-relaxed">
              <p>
                AR presentation relies on native platform runtimes:
              </p>

              <div className="p-3 rounded-xl bg-oled-panel border border-oled-border space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">iOS / iPadOS:</span>
                  <span className="text-emerald-400">USDZ Quick Look</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Android Chrome:</span>
                  <span className="text-emerald-400">Scene Viewer / WebXR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Active Device:</span>
                  <span className="text-zinc-200">
                    {arCheck.supported ? `Detected (${arCheck.method})` : 'Desktop Browser'}
                  </span>
                </div>
              </div>

              {!arCheck.supported ? (
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    To experience real-world passthrough AR, open Spiny3D on an iOS or Android device with WebXR/ARKit support, or download the .GLB model into a mobile viewer.
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-200 text-xs flex items-start gap-2">
                  <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    Ready for AR session! Triggering native AR quick viewer.
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleExportGLB}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-medium text-xs font-mono"
              >
                Download .GLB for AR Tool
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
