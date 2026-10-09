import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Check,
  X,
  ShieldCheck,
  Zap,
  Layers,
  Glasses,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
  onSuccess?: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  reason,
  onSuccess,
}) => {
  const { upgradePlan } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  if (!isOpen) return null;

  const handleSimulatedCheckout = async () => {
    setIsProcessing(true);
    // Simulate payment transaction verification
    await new Promise((resolve) => setTimeout(resolve, 800));
    upgradePlan('pro');
    setIsProcessing(false);
    setIsComplete(true);
    setTimeout(() => {
      setIsComplete(false);
      onClose();
      if (onSuccess) onSuccess();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
    >
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-oled-surface border border-oled-border space-y-6 shadow-elevated relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 p-1.5 rounded-lg bg-oled-panel text-zinc-400 hover:text-zinc-100 border border-oled-border hover:border-zinc-700 transition-colors"
          aria-label="Close upgrade dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-[11px] font-mono text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Spiny3D Pro Creator</span>
          </div>

          <h2 id="upgrade-modal-title" className="text-xl font-bold font-mono text-zinc-100">
            Upgrade to Spiny3D Pro
          </h2>

          {reason ? (
            <p className="text-xs text-amber-300/90 font-mono bg-amber-950/30 border border-amber-800/40 p-2.5 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{reason}</span>
            </p>
          ) : (
            <p className="text-xs text-zinc-400 font-sans">
              Unlock unlimited 3D neural reconstructions, high-poly geometry, and complete studio export formats.
            </p>
          )}
        </div>

        {/* Feature List */}
        <div className="p-4 rounded-xl bg-oled-panel border border-oled-border space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2.5 text-zinc-200">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Unlimited Volumetric Conversions (no 5/day cap)</span>
          </div>
          <div className="flex items-center gap-2.5 text-zinc-200">
            <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Wavefront .OBJ & Apple USDZ Export Support</span>
          </div>
          <div className="flex items-center gap-2.5 text-zinc-200">
            <Glasses className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>AR Quick Look & Passthrough Inspection</span>
          </div>
          <div className="flex items-center gap-2.5 text-zinc-200">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Priority neural queue with high-poly watertight mesh</span>
          </div>
        </div>

        {/* Price & Sandbox Disclosure */}
        <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5 text-xs font-mono">
          <div className="flex items-baseline justify-between">
            <span className="text-zinc-400">Subscription Fee:</span>
            <span className="text-sm font-bold text-zinc-100">$15 / month (₹1,199 / mo)</span>
          </div>
          <p className="text-[11px] text-emerald-400/90">
            Sandbox Testing Active: Instant zero-cost activation for full feature review.
          </p>
        </div>

        {/* Action Button */}
        <div>
          {isComplete ? (
            <div className="w-full py-3 px-4 rounded-xl bg-emerald-950/60 border border-emerald-600/50 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Pro Plan Activated!</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSimulatedCheckout}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Activating Pro Plan...</span>
                </>
              ) : (
                <span>Activate Pro (Sandbox Simulation)</span>
              )}
            </button>
          )}
        </div>

        {/* Security / Compliance Footnote */}
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-1">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>No credit card required in sandbox</span>
          </div>
          <a href="/refund" className="hover:text-zinc-300 underline underline-offset-2">
            Refund Terms
          </a>
        </div>
      </div>
    </div>
  );
};
