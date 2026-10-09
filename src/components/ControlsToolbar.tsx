import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
import { springSlidingPill, springTactile } from '../utils/motion';

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

const LIGHTING_OPTIONS: { id: LightingPreset; label: string; icon: string }[] = [
  { id: 'studio_daylight', label: 'Studio', icon: '☀️' },
  { id: 'soft_rim', label: 'Soft Rim', icon: '🌙' },
  { id: 'high_contrast', label: 'Key Light', icon: '⚡' },
];

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
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-2.5 p-2 rounded-2xl bg-oled-surface border border-oled-border shadow-subtle"
      role="toolbar"
      aria-label="3D viewport display and lighting controls"
    >
      {/* Left controls: Inspection & Auto-spin */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Wireframe toggle with sliding active pill */}
        <motion.button
          type="button"
          onClick={onToggleWireframe}
          aria-pressed={isWireframe}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.02, y: -1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
          transition={springTactile}
          className={`relative px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 border transition-colors overflow-hidden ${
            isWireframe
              ? 'border-emerald-500/80 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.15)]'
              : 'border-oled-border bg-oled-panel text-zinc-300 hover:text-zinc-100'
          }`}
          title="Toggle solid textured mesh vs. wireframe topology"
        >
          {isWireframe && (
            <motion.div
              layoutId="wireframePill"
              transition={springSlidingPill}
              className="absolute inset-0 bg-emerald-950/60"
            />
          )}
          <Grid className="w-3.5 h-3.5 relative z-10 text-emerald-400" aria-hidden="true" />
          <span className="relative z-10">{isWireframe ? 'Wireframe: ON' : 'Wireframe: OFF'}</span>
        </motion.button>

        {/* Auto-spin toggle with sliding active pill */}
        <motion.button
          type="button"
          onClick={onToggleAutoSpin}
          aria-pressed={isAutoSpin}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.02, y: -1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
          transition={springTactile}
          className={`relative px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 border transition-colors overflow-hidden ${
            isAutoSpin
              ? 'border-emerald-500/80 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.15)]'
              : 'border-oled-border bg-oled-panel text-zinc-300 hover:text-zinc-100'
          }`}
          title="Toggle gentle 360° idle rotation"
        >
          {isAutoSpin && (
            <motion.div
              layoutId="autoSpinPill"
              transition={springSlidingPill}
              className="absolute inset-0 bg-emerald-950/60"
            />
          )}
          {isAutoSpin ? (
            <Pause className="w-3.5 h-3.5 relative z-10 text-emerald-400" aria-hidden="true" />
          ) : (
            <Play className="w-3.5 h-3.5 relative z-10 text-zinc-400" aria-hidden="true" />
          )}
          <span className="relative z-10">{isAutoSpin ? 'Auto-spin: ON' : 'Auto-spin: OFF'}</span>
        </motion.button>

        {/* Sliding Pill Segmented Control for Lighting Presets (Aceternity UI style) */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-oled-panel border border-oled-border text-xs font-mono">
          <div className="hidden sm:flex items-center gap-1 pl-1.5 pr-1 text-zinc-400">
            <Sun className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
            <span className="text-[11px]">Light:</span>
          </div>

          <div className="flex items-center gap-1 relative">
            {LIGHTING_OPTIONS.map((opt) => {
              const isSelected = lightingPreset === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChangeLighting(opt.id)}
                  className={`relative px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors z-10 ${
                    isSelected ? 'text-emerald-300 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  aria-pressed={isSelected}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeLightingPill"
                      transition={springSlidingPill}
                      className="absolute inset-0 rounded-lg bg-emerald-950/90 border border-emerald-500/60 shadow-sm"
                    />
                  )}
                  <span className="relative z-20 flex items-center gap-1">
                    <span>{opt.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right controls: Camera reset tween & Fullscreen */}
      <div className="flex items-center gap-1.5">
        <motion.button
          type="button"
          onClick={onResetCamera}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.02, y: -1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
          transition={springTactile}
          className="px-3 py-1.5 rounded-xl bg-oled-panel hover:bg-zinc-800 text-zinc-200 border border-oled-border text-xs font-mono flex items-center gap-1.5 transition-colors shadow-sm"
          title="Smoothly tween camera and look-at target back to center"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span>Reset camera</span>
        </motion.button>

        <motion.button
          type="button"
          onClick={onToggleFullscreen}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          transition={springTactile}
          className="p-2 rounded-xl bg-oled-panel hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 border border-oled-border transition-colors shadow-sm"
          title={isFullscreen ? 'Exit full screen' : 'View in full screen'}
          aria-label={isFullscreen ? 'Exit full screen' : 'View in full screen'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
          )}
        </motion.button>
      </div>
    </div>
  );
};
