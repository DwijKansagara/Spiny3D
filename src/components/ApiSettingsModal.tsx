import React from 'react';
import { Key, X, ShieldCheck } from 'lucide-react';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripoKey: string;
  meshyKey: string;
  onSaveKeys: (keys: { tripo: string; meshy: string }) => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-modal-title"
    >
      <div className="w-full max-w-lg p-6 rounded-2xl bg-oled-surface border border-oled-border space-y-5 shadow-elevated">
        <div className="flex items-center justify-between border-b border-oled-border pb-4">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <h2 id="api-modal-title" className="text-base font-semibold font-mono text-zinc-100">
              Cloud 3D Generation Gateway Keys
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-oled-panel transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-oled-panel border border-oled-border text-xs text-zinc-300 font-sans space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-mono text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Credential Protection Active</span>
          </div>
          <p className="leading-relaxed">
            Direct client-side API keys are disabled in this web deployment to prevent browser-level exposure of third-party credentials. Spiny3D processes conversions directly in your browser using the local procedural 3D reconstruction engine with zero external data transmission.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 text-xs font-medium font-mono transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
