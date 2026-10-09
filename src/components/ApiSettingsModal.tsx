import React, { useState } from 'react';
import { Key, X, Check, ExternalLink, ShieldCheck } from 'lucide-react';

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
  tripoKey,
  meshyKey,
  onSaveKeys,
}) => {
  const [currentTripo, setCurrentTripo] = useState(tripoKey);
  const [currentMeshy, setCurrentMeshy] = useState(meshyKey);
  const [saveFeedback, setSaveFeedback] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKeys({
      tripo: currentTripo.trim(),
      meshy: currentMeshy.trim(),
    });
    setSaveFeedback(true);
    setTimeout(() => {
      setSaveFeedback(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setCurrentTripo('');
    setCurrentMeshy('');
    onSaveKeys({ tripo: '', meshy: '' });
  };

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
            <span>Client-Isolated Credential Storage</span>
          </div>
          <p className="leading-relaxed">
            API keys are kept strictly in session memory and transmitted directly via TLS to the chosen generation API endpoint. In <strong>Local Mock 3D (Default)</strong>, no cloud API key is required.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Tripo3D Key Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="tripo-key-input" className="text-xs font-mono text-zinc-200">
                Tripo3D API Key (<code className="text-emerald-400">TRIPO_API_KEY</code>)
              </label>
              <a
                href="https://platform.tripo3d.ai"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                <span>Get key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              id="tripo-key-input"
              type="password"
              placeholder="eyJhbGciOi... or tpo_..."
              value={currentTripo}
              onChange={(e) => setCurrentTripo(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-oled-bg border border-oled-border text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
              autoComplete="off"
            />
          </div>

          {/* Meshy.ai Key Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="meshy-key-input" className="text-xs font-mono text-zinc-200">
                Meshy.ai API Key (<code className="text-emerald-400">MESHY_API_KEY</code>)
              </label>
              <a
                href="https://meshy.ai"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                <span>Get key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              id="meshy-key-input"
              type="password"
              placeholder="msy_..."
              value={currentMeshy}
              onChange={(e) => setCurrentMeshy(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-oled-bg border border-oled-border text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
              autoComplete="off"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-mono text-zinc-400 hover:text-red-400 transition-colors"
            >
              Clear keys
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-oled-panel hover:bg-oled-card text-zinc-300 text-xs font-medium border border-oled-border transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 text-xs font-medium font-mono flex items-center gap-1.5 transition-colors shadow-subtle"
              >
                {saveFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved</span>
                  </>
                ) : (
                  <span>Save Configuration</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
