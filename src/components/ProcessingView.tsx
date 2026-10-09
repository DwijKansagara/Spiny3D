import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Check, Clock, XCircle, Sparkles, Box } from 'lucide-react';
import type { GenerationProgress } from '../types';
import { BorderBeam } from './BorderBeam';
import { springTactile } from '../utils/motion';

interface ProcessingViewProps {
  progress: GenerationProgress;
  onCancel: () => void;
  fileName?: string;
  sourceImageUrl?: string;
}

const STAGE_STEPS = [
  { key: 'analyzing_depth', label: 'Analyzing depth map', desc: 'Synthesizing surface depth and normals' },
  { key: 'generating_pointcloud', label: 'Generating point cloud', desc: 'Triangulating 360° watertight manifold topology' },
  { key: 'baking_textures', label: 'Baking textures', desc: 'Projecting PBR roughness and diffuse coordinates' },
  { key: 'finalizing_mesh', label: 'Finalizing 3D mesh', desc: 'Normalizing bounds to 2.0 units and centering at origin' },
];

export const ProcessingView: React.FC<ProcessingViewProps> = ({
  progress,
  onCancel,
  fileName,
  sourceImageUrl,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-oled-surface border border-oled-border space-y-6 shadow-elevated relative overflow-hidden"
      role="status"
      aria-live="polite"
    >
      {/* Laser Border Accent */}
      <BorderBeam size={220} duration={6} colorFrom="#10b981" colorTo="#06b6d4" />

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-oled-border pb-4 relative z-10">
        <div>
          <h2 className="text-base font-semibold text-zinc-100 font-mono flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Volumetric 3D Neural Reconstruction</span>
          </h2>
          {fileName && (
            <p className="text-xs text-zinc-400 font-mono mt-0.5 truncate max-w-sm">
              Source Asset: {fileName}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-oled-panel border border-oled-border text-xs font-mono text-zinc-300">
          <Clock className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span>{progress.elapsedSeconds}s elapsed</span>
        </div>
      </div>

      {/* Stage Visualizer & Laser Scan (AnimMasterLib Style) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center relative z-10">
        {/* Left Column (2 Cols): 2D Image Scan Frame with Laser Beam */}
        <div className="md:col-span-2 flex flex-col items-center">
          <div className="w-full aspect-square max-w-[220px] rounded-2xl bg-zinc-950 border border-zinc-800 relative overflow-hidden flex items-center justify-center shadow-inner">
            {sourceImageUrl ? (
              <img
                src={sourceImageUrl}
                alt="Source preview under laser scan"
                className="w-full h-full object-contain p-2 select-none"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-zinc-600">
                <Box className="w-12 h-12 text-zinc-700 animate-pulse" />
                <span className="text-[10px] font-mono">Synthesizing Mesh...</span>
              </div>
            )}

            {/* Matrix / Blueprint Scan Grid Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            />

            {/* AnimMasterLib Horizontal Scanning Laser Beam */}
            {!shouldReduceMotion && (
              <>
                <motion.div
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_14px_#34d399] z-20 pointer-events-none"
                  animate={{ top: ['0%', '98%', '0%'] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                {/* Soft fading emerald trail */}
                <motion.div
                  className="absolute left-0 right-0 h-10 bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-transparent pointer-events-none z-10"
                  animate={{ top: ['-20%', '85%', '-20%'] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </>
            )}

            {/* Corner Bracket Reticles */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-500/80 pointer-events-none" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-500/80 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-500/80 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-500/80 pointer-events-none" />
          </div>

          <span className="text-[11px] font-mono text-zinc-500 mt-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Scanning 2D Geometry</span>
          </span>
        </div>

        {/* Right Column (3 Cols): Step-by-Step Progress with AnimatePresence */}
        <div className="md:col-span-3 space-y-2.5">
          {STAGE_STEPS.map((step, idx) => {
            const stepNumber = idx + 1;
            const isDone = progress.stepNumber > stepNumber;
            const isCurrent = progress.stepNumber === stepNumber;

            return (
              <div
                key={step.key}
                className={`relative flex items-center justify-between p-3 rounded-2xl border text-xs font-mono transition-all overflow-hidden ${
                  isCurrent
                    ? 'bg-emerald-950/40 border-emerald-500/70 text-emerald-200 shadow-[0_0_16px_rgba(16,185,129,0.12)]'
                    : isDone
                    ? 'bg-oled-panel/60 border-oled-border/60 text-zinc-400'
                    : 'bg-zinc-900/30 border-zinc-800/40 text-zinc-600'
                }`}
              >
                {/* Active scan line along step */}
                {isCurrent && !shouldReduceMotion && (
                  <motion.div
                    layoutId="activeStepGlow"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 shadow-[0_0_8px_#10b981]"
                  />
                )}

                <div className="flex items-center gap-3 relative z-10">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 transition-colors ${
                      isDone
                        ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/60'
                        : isCurrent
                        ? 'bg-emerald-500 text-zinc-950 font-bold shadow-[0_0_8px_#10b981]'
                        : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : (
                      <span>{stepNumber}</span>
                    )}
                  </div>

                  <div>
                    <span className={`block font-semibold ${isCurrent ? 'text-zinc-100' : ''}`}>
                      {step.label}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">{step.desc}</span>
                  </div>
                </div>

                <div className="relative z-10">
                  {isCurrent && (
                    <AnimatePresence mode="wait">
                      <motion.span
                        key="in-progress"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                        className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Active</span>
                      </motion.span>
                    </AnimatePresence>
                  )}
                  {isDone && <span className="text-[11px] text-zinc-500">Done</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Progress Operation Card with AnimatePresence */}
      <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5 text-xs relative z-10">
        <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500">
          <span className="uppercase">Pipeline Progress</span>
          <span className="text-emerald-400 font-bold">{progress.percent}%</span>
        </div>

        {/* Progress Bar with Spring Ease */}
        <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_8px_#10b981]"
            initial={{ width: 0 }}
            animate={{ width: `${progress.percent}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={progress.message}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-zinc-300 font-sans pt-1"
          >
            {progress.message || 'Processing image data...'}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Cancel Action Button */}
      <div className="pt-2 flex justify-end relative z-10">
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.02, y: -1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
          transition={springTactile}
          className="px-4 py-2 rounded-xl bg-oled-panel hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 border border-oled-border text-xs font-mono flex items-center gap-2 transition-colors"
        >
          <XCircle className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
          <span>Cancel processing</span>
        </motion.button>
      </div>
    </div>
  );
};
