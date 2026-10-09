import React from 'react';
import {
  RotateCcw,
  Sun,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Grid,
} from 'lucide-react';
import type { LightingPreset } from '../types';

interface ControlsToolbarProps {
  isWireframe: boolean;
  onToggleWireframe: () => void;
  isAutoSpin: boolean;
  onToggleAutoSpin: () => void;
  lightingPreset: LightingPreset;
  onChangeLighting: (preset: LightingPreset) => void;
  onResetCamera: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const ControlsToolbar: React.FC<ControlsToolbarProps> = ({
  isWireframe,
  onToggleWireframe,
  isAutoSpin,
  onToggleAutoSpin,
  lightingPreset,
  onChangeLighting,
  onResetCamera,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-oled-surface border border-oled-border"
      role="toolbar"
      aria-label="3D viewport display and lighting controls"
    >
      {/* Left controls: Inspection & Auto-spin */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Wireframe toggle */}
        <button
          type="button"
          onClick={onToggleWireframe}
          aria-pressed={isWireframe}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors border ${
            isWireframe
              ? 'bg-emerald-950/50 border-emerald-500/70 text-emerald-300 font-semibold'
              : 'bg-oled-panel border-oled-border text-zinc-300 hover:bg-oled-card hover:text-zinc-100'
          }`}
          title="Toggle between solid textured mesh and wireframe topology"
        >
          <Grid className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{isWireframe ? 'Wireframe: ON' : 'Wireframe: OFF'}</span>
        </button>

        {/* Auto-spin toggle */}
        <button
          type="button"
          onClick={onToggleAutoSpin}
          aria-pressed={isAutoSpin}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors border ${
            isAutoSpin
              ? 'bg-emerald-950/50 border-emerald-500/70 text-emerald-300 font-semibold'
              : 'bg-oled-panel border-oled-border text-zinc-300 hover:bg-oled-card hover:text-zinc-100'
          }`}
          title="Toggle gentle idle rotation"
        >
          {isAutoSpin ? (
            <Pause className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <Play className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          <span>{isAutoSpin ? 'Auto-spin: ON' : 'Auto-spin: OFF'}</span>
        </button>

        {/* Lighting Selector */}
        <div className="flex items-center gap-1 pl-1">
          <Sun className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" aria-hidden="true" />
          <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">Lighting:</span>
          <select
            value={lightingPreset}
            onChange={(e) => onChangeLighting(e.target.value as LightingPreset)}
            className="px-2.5 py-1.5 rounded-lg bg-oled-panel border border-oled-border text-xs text-zinc-200 font-mono focus:outline-none cursor-pointer"
            aria-label="Select lighting environment preset"
          >
            <option value="studio_daylight">Studio Daylight</option>
            <option value="soft_rim">Soft Rim Light</option>
            <option value="high_contrast">High-Contrast Key</option>
          </select>
        </div>
      </div>

      {/* Right controls: Camera reset & Fullscreen */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onResetCamera}
          className="px-3 py-1.5 rounded-lg bg-oled-panel hover:bg-oled-card text-zinc-300 hover:text-zinc-100 border border-oled-border text-xs font-mono flex items-center gap-1.5 transition-colors"
          title="Center model and reset camera angle"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset camera</span>
        </button>

        <button
          type="button"
          onClick={onToggleFullscreen}
          className="p-1.5 rounded-lg bg-oled-panel hover:bg-oled-card text-zinc-300 hover:text-zinc-100 border border-oled-border transition-colors"
          title={isFullscreen ? 'Exit full screen' : 'View in full screen'}
          aria-label={isFullscreen ? 'Exit full screen' : 'View in full screen'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Maximize2 className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
};
