import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandMascot } from './BrandMascot';
import { AuthModal } from './AuthModal';
import { UpgradeModal } from './UpgradeModal';
import { useAuth } from '../context/AuthContext';
import {
  Cpu,
  ShieldCheck,
  Mail,
  Key,
  User,
  LogOut,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { tactileButtonVariants, reducedMotionVariants, springTactile } from '../utils/motion';
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
  const { user, isAuthenticated, logout } = useAuth();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const motionProps = shouldReduceMotion
    ? { variants: reducedMotionVariants }
    : { variants: tactileButtonVariants, transition: springTactile };

  const isHome = location.pathname === '/';
  const isPricing = location.pathname === '/pricing' || location.pathname === '/plans';

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-oled-bg/95 backdrop-blur-md border-b border-oled-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Identity & Main Nav */}
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
              to="/pricing"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                isPricing
                  ? 'bg-oled-surface text-zinc-100 border border-oled-border'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-oled-surface/50'
              }`}
            >
              Pricing & Plans
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
          {/* Mobile Pricing Quick Link */}
          <Link
            to="/pricing"
            className="md:hidden px-2.5 py-1.5 rounded-lg bg-oled-surface border border-oled-border text-xs font-mono text-zinc-300"
          >
            Plans
          </Link>

          {/* 3D Engine Selector */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-oled-surface border border-oled-border text-xs font-mono">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <label htmlFor="engine-select" className="hidden lg:inline text-zinc-400">
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
                Local Mock 3D (360°)
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
          <motion.button
            type="button"
            whileHover="hover"
            whileTap="tap"
            {...motionProps}
            onClick={onOpenApiSettings}
            className="px-2.5 py-1.5 rounded-lg bg-oled-surface hover:bg-oled-panel border border-oled-border text-xs font-mono text-zinc-300 hover:text-zinc-100 flex items-center gap-1.5 transition-colors"
            title="Configure Tripo3D or Meshy.ai API credentials"
          >
            <Key className={`w-3.5 h-3.5 ${hasCustomKeys ? 'text-emerald-400' : 'text-zinc-400'}`} aria-hidden="true" />
            <span className="hidden sm:inline">API Keys</span>
            {hasCustomKeys && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
          </motion.button>

          {/* Privacy Security Status */}
          <div
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-[11px] font-mono text-emerald-300"
            title="Zero unauthenticated server retention. Fully client-verified pipeline."
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span>Zero Retention</span>
          </div>

          {/* User Account / Auth Button */}
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <motion.button
                type="button"
                whileHover="hover"
                whileTap="tap"
                {...motionProps}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-xl bg-oled-surface hover:bg-oled-panel border border-oled-border text-xs font-mono text-zinc-200 transition-colors"
                aria-expanded={isUserMenuOpen}
                aria-label="User account menu"
              >
                <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-200 uppercase">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="hidden sm:inline max-w-[80px] truncate">{user.name}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    user.plan === 'pro'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : user.plan === 'studio'
                      ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {user.plan}
                </span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </motion.button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 p-3 rounded-2xl bg-oled-surface border border-oled-border shadow-elevated z-50 space-y-3 font-mono text-xs animate-fade-in">
                  <div className="border-b border-oled-border pb-2.5">
                    <p className="font-semibold text-zinc-100 truncate">{user.name}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{user.email || 'No email attached'}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500">Plan:</span>
                      <span className="text-emerald-400 font-semibold uppercase">{user.plan}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500">Daily Usage:</span>
                      <span className="text-zinc-300">
                        {user.plan === 'free'
                          ? `${user.conversionsToday} / ${user.maxDailyConversions} used`
                          : 'Unlimited'}
                      </span>
                    </div>
                  </div>

                  {user.plan === 'free' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsUpgradeOpen(true);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Upgrade to Pro</span>
                    </button>
                  )}

                  <div className="space-y-1">
                    <Link
                      to="/pricing"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-3 py-1.5 rounded-lg text-zinc-300 hover:text-zinc-100 hover:bg-oled-panel transition-colors text-xs"
                    >
                      View All Plans & Features
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 transition-colors text-xs"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                whileHover="hover"
                whileTap="tap"
                {...motionProps}
                onClick={() => setIsAuthOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-mono font-bold text-xs flex items-center gap-1.5 shadow-subtle"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </motion.button>
            </div>
          )}

          {/* Direct Developer Email */}
          <motion.a
            href="mailto:work.dwijkansagara@gmail.com"
            whileHover="hover"
            whileTap="tap"
            {...motionProps}
            className="p-2 rounded-lg bg-oled-surface border border-oled-border text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors inline-flex items-center justify-center"
            aria-label="Email developer Dwij Kansagara directly"
            title="work.dwijkansagara@gmail.com"
          >
            <Mail className="w-4 h-4" />
          </motion.a>
        </div>
      </div>

      {/* Auth Modal Trigger */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode="login"
      />

      {/* Upgrade Modal Trigger */}
      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />
    </header>
  );
};
