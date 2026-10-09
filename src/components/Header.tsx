import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandMascot } from './BrandMascot';
import { Cpu, ShieldCheck, Mail, Key } from 'lucide-react';
import type { EngineProvider } from '../types';

interface HeaderProps {
  currentEngine: EngineProvider;
  onEngineChange: (engine: EngineProvider) => void;
  onResetToUpload?: () => void;
  onOpenApiSettings: () => void;
  hasCustomKeys?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentEngine,
  onEngineChange,
  onResetToUpload,
  onOpenApiSettings,
  hasCustomKeys,
}) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 w-full bg-oled-bg/90 backdrop-blur-md border-b border-oled-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            onClick={onResetToUpload}
            className="flex items-center gap-2 group transition-opacity hover:opacity-90"
            aria-label="Spiny3D Home"
          >
            <BrandMascot size="sm" showLabel={true} />
          </Link>

          {/* Quick Nav for desktop */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                isHome
                  ? 'bg-oled-surface text-zinc-100 border border-oled-border'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-oled-surface/50'
              }`}
            >
              Studio
            </Link>
            <Link
              to="/privacy"
              className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-oled-surface/50 transition-colors"
            >
              DPDP Privacy
            </Link>
            <Link
              to="/terms"
              className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-oled-surface/50 transition-colors"
            >
              Terms & IP
            </Link>
          </nav>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 3D Engine Selector */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-oled-surface border border-oled-border text-xs font-mono">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <label htmlFor="engine-select" className="hidden sm:inline text-zinc-400">
              Engine:
            </label>
            <select
              id="engine-select"
              value={currentEngine}
              onChange={(e) => onEngineChange(e.target.value as EngineProvider)}
              className="bg-transparent text-zinc-200 font-sans text-xs focus:outline-none cursor-pointer"
              aria-label="Select 3D generation engine provider"
            >
              <option value="mock_local" className="bg-oled-surface text-zinc-100">
                Local Mock 3D (360° Mesh)
              </option>
              <option value="tripo3d" className="bg-oled-surface text-zinc-100">
                Tripo3D Cloud
              </option>
              <option value="meshy" className="bg-oled-surface text-zinc-100">
                Meshy.ai Cloud
              </option>
            </select>
          </div>

          {/* Cloud API Keys Config Button */}
          <button
            type="button"
            onClick={onOpenApiSettings}
            className="px-2.5 py-1.5 rounded-lg bg-oled-surface hover:bg-oled-panel border border-oled-border text-xs font-mono text-zinc-300 hover:text-zinc-100 flex items-center gap-1.5 transition-colors"
            title="Configure Tripo3D or Meshy.ai API credentials"
          >
            <Key className={`w-3.5 h-3.5 ${hasCustomKeys ? 'text-emerald-400' : 'text-zinc-400'}`} aria-hidden="true" />
            <span className="hidden sm:inline">API Keys</span>
            {hasCustomKeys && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
          </button>

          {/* Privacy Security Status */}
          <div
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-[11px] font-mono text-emerald-300"
            title="Zero unauthenticated server retention. Fully client-verified pipeline."
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span>Zero Server Retention</span>
          </div>

          {/* Direct Developer Email */}
          <a
            href="mailto:work.dwijkansagara@gmail.com"
            className="p-2 rounded-lg bg-oled-surface border border-oled-border text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors"
            aria-label="Email developer Dwij Kansagara directly"
            title="work.dwijkansagara@gmail.com"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
