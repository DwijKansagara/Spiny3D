import React from 'react';
import { Loader2, Check, Clock, XCircle } from 'lucide-react';
import type { GenerationProgress } from '../types';

interface ProcessingViewProps {
  progress: GenerationProgress;
  onCancel: () => void;
  fileName?: string;
}

const STAGE_STEPS = [
  { key: 'analyzing_depth', label: '1. Analyzing depth map' },
  { key: 'generating_pointcloud', label: '2. Generating point cloud' },
  { key: 'baking_textures', label: '3. Baking textures' },
  { key: 'finalizing_mesh', label: '4. Finalizing mesh' },
];

export const ProcessingView: React.FC<ProcessingViewProps> = ({
  progress,
  onCancel,
  fileName,
}) => {
  return (
    <div
      className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-2xl bg-oled-surface border border-oled-border space-y-6 shadow-elevated"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between border-b border-oled-border pb-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-100 font-mono flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" aria-hidden="true" />
            <span>3D Reconstruction Pipeline</span>
          </h2>
          {fileName && (
            <p className="text-xs text-zinc-400 font-mono mt-0.5 truncate max-w-sm">
              Source: {fileName}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-oled-panel border border-oled-border text-xs font-mono text-zinc-400">
          <Clock className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
          <span>{progress.elapsedSeconds}s elapsed</span>
        </div>
      </div>

      {/* Pipeline Steps Tracker */}
      <div className="space-y-3">
        {STAGE_STEPS.map((step, idx) => {
          const stepNumber = idx + 1;
          const isDone = progress.stepNumber > stepNumber;
          const isCurrent = progress.stepNumber === stepNumber;

          return (
            <div
              key={step.key}
              className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition-colors ${
                isCurrent
                  ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-200'
                  : isDone
                  ? 'bg-oled-panel/60 border-oled-border/60 text-zinc-400'
                  : 'bg-oled-bg/40 border-oled-border/30 text-zinc-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    isDone
                      ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'
                      : isCurrent
                      ? 'bg-emerald-500 text-zinc-950 font-bold'
                      : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                <span className={isCurrent ? 'font-semibold' : ''}>{step.label}</span>
              </div>

              <div>
                {isCurrent && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-800/40">
                    In progress
                  </span>
                )}
                {isDone && <span className="text-[11px] text-zinc-500">Done</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Message */}
      <div className="p-3.5 rounded-xl bg-oled-bg border border-oled-border/60 text-xs text-zinc-300 font-sans leading-relaxed">
        <span className="font-mono text-zinc-500 block text-[11px] uppercase mb-1">
          Current Operation
        </span>
        {progress.message || 'Processing image data...'}
      </div>

      {/* Cancel Action */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl bg-oled-panel hover:bg-oled-card text-zinc-300 hover:text-zinc-100 border border-oled-border text-xs font-medium flex items-center gap-2 transition-colors"
        >
          <XCircle className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
          <span>Cancel processing</span>
        </button>
      </div>
    </div>
  );
};
