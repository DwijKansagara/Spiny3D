import React, { useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { UploadCloud, Camera, AlertCircle, CheckCircle2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { validateImageFile } from '../utils/fileSecurity';
import { BorderBeam } from './BorderBeam';
import { springTactile } from '../utils/motion';
import type { ModelArchetype } from '../types';

interface UploadZoneProps {
  onImageSelected: (file: File, archetype: ModelArchetype) => void;
  isProcessing: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onImageSelected,
  isProcessing,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [selectedArchetype, setSelectedArchetype] = useState<ModelArchetype>('auto');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    setErrorMessage(null);
    setIsValidating(true);

    try {
      const validation = await validateImageFile(file);
      if (!validation.valid) {
        setErrorMessage(validation.errorMessage || 'Invalid file uploaded.');
        setIsValidating(false);
        return;
      }

      onImageSelected(file, selectedArchetype);
    } catch (err) {
      console.error('File validation exception:', err);
      setErrorMessage('A security exception occurred during file verification.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (isProcessing || isValidating) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Drop Zone Card with Animated Border & Spring Dynamics */}
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                scale: isDragOver ? 1.01 : 1,
              }
        }
        transition={springTactile}
        className={`relative rounded-2xl p-8 sm:p-12 transition-all text-center flex flex-col items-center justify-center bg-oled-surface overflow-hidden border ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-950/20 shadow-[0_0_24px_rgba(16,185,129,0.2)]'
            : 'border-oled-border hover:border-zinc-700 shadow-elevated'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        role="region"
        aria-label="Image upload dropzone"
      >
        {/* Aceternity UI-Style Laser Border Beam on normal idle state */}
        {!isDragOver && <BorderBeam duration={10} size={180} />}

        {/* Animated SVG Pulsing Dashed Border on Drag Over (Josh Comeau / Aceternity style) */}
        {isDragOver && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl z-20"
            style={{ width: '100%', height: '100%' }}
            aria-hidden="true"
          >
            <rect
              x="2"
              y="2"
              width="calc(100% - 4px)"
              height="calc(100% - 4px)"
              rx="16"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeDasharray="10 8"
              className="animate-dash-pulse"
            />
          </svg>
        )}

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileProcess(e.target.files[0]);
            }
          }}
          disabled={isProcessing || isValidating}
          id="file-upload-input"
        />

        {/* Camera capture input for mobile devices */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileProcess(e.target.files[0]);
            }
          }}
          disabled={isProcessing || isValidating}
          id="camera-capture-input"
        />

        {/* Upload Icon with micro-spring hover */}
        <motion.div
          whileHover={shouldReduceMotion ? undefined : { scale: 1.08, rotate: [0, -3, 3, 0] }}
          transition={springTactile}
          className="w-16 h-16 rounded-2xl bg-oled-panel border border-oled-border flex items-center justify-center mb-4 text-emerald-400 shadow-subtle relative z-10"
        >
          <UploadCloud className="w-8 h-8" aria-hidden="true" />
        </motion.div>

        <h2 className="text-lg sm:text-xl font-semibold text-zinc-100 mb-2 font-mono relative z-10">
          Drop your 2D image here or browse
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mb-5 leading-relaxed relative z-10">
          Supports high-resolution JPEG, PNG, and WebP (up to 15MB). Header magic bytes are screened client-side.
        </p>

        {/* Model Archetype Target Selector */}
        <div className="mb-6 p-2 rounded-xl bg-oled-panel border border-oled-border flex flex-col sm:flex-row items-center gap-2 text-xs font-mono relative z-10">
          <div className="flex items-center gap-1.5 text-zinc-400 px-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target Archetype:</span>
          </div>
          <select
            value={selectedArchetype}
            onChange={(e) => setSelectedArchetype(e.target.value as ModelArchetype)}
            className="bg-oled-surface text-zinc-200 border border-oled-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer text-xs"
            aria-label="Select target 3D model archetype or auto-detection"
          >
            <option value="auto">Auto-Detect from image & filename</option>
            <option value="dog">Dog / Canine Companion</option>
            <option value="cat">Cat / Fox / Wildlife</option>
            <option value="sneaker">Sneaker / Footwear</option>
            <option value="mug">Ceramic Mug / Dishware</option>
            <option value="duck">Duck / Mascot Toy</option>
            <option value="toycar">Vehicle / Toy Car</option>
            <option value="robot">Industrial Robot / Hardware</option>
            <option value="furniture">Furniture / Object Box</option>
          </select>
        </div>

        {/* Action Buttons with Josh Comeau Tactile Physics */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-sm relative z-10">
          <motion.button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing || isValidating}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.02, y: -1 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            transition={springTactile}
            className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-medium text-sm flex items-center justify-center gap-2 shadow-subtle disabled:opacity-50"
          >
            <ImageIcon className="w-4 h-4" aria-hidden="true" />
            <span>Upload image</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            disabled={isProcessing || isValidating}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.02, y: -1 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            transition={springTactile}
            className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-oled-panel hover:bg-zinc-800 text-zinc-200 border border-oled-border font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Camera className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Capture photo</span>
          </motion.button>
        </div>

        {isValidating && (
          <div className="mt-4 text-xs font-mono text-emerald-400 flex items-center gap-2 relative z-10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Verifying header magic bytes and integrity...
          </div>
        )}
      </motion.div>

      {/* Validation Error Alert */}
      {errorMessage && (
        <div
          className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs sm:text-sm flex items-start gap-3"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <strong className="font-semibold block font-mono">Upload Screening Error</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Concrete Visual Best Practices Guide */}
      <div className="rounded-2xl bg-oled-surface border border-oled-border p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
            Best Practices for Optimal 3D Mesh Output
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-400">
          <div className="p-3.5 rounded-xl bg-oled-bg border border-oled-border/60 space-y-1.5">
            <span className="font-medium text-zinc-200 font-mono block">1. Clear Single Subject</span>
            <p className="leading-relaxed">
              Place the object centered without overlapping background items, shadows, or cluttered elements.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-oled-bg border border-oled-border/60 space-y-1.5">
            <span className="font-medium text-zinc-200 font-mono block">2. High Contrast Background</span>
            <p className="leading-relaxed">
              Use a neutral, clean, or white background that distinguishes crisp object contours and silhouette edges.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-oled-bg border border-oled-border/60 space-y-1.5">
            <span className="font-medium text-zinc-200 font-mono block">3. Balanced Lighting</span>
            <p className="leading-relaxed">
              Ensure even, diffuse natural light without harsh directional blowouts or deep dark occlusions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
