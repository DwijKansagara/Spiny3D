import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { UpgradeModal } from '../components/UpgradeModal';
import { AuthModal } from '../components/AuthModal';
import { ApiSettingsModal } from '../components/ApiSettingsModal';
import { useAuth } from '../context/AuthContext';
import type { BillingCycle, Currency, EngineProvider } from '../types';
import {
  Check,
  Zap,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Mail,
  HelpCircle,
  Clock,
  Cpu,
} from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { user } = useAuth();

  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [engine, setEngine] = useState<EngineProvider>('mock_local');

  // Pricing calculations
  // Pro: $15/mo or $12/mo ($144/yr) | INR: ₹1,199/mo or ₹959/mo (₹11,500/yr)
  const isYearly = billingCycle === 'yearly';
  const isINR = currency === 'INR';

  const proPriceMonthly = isINR ? '₹1,199' : '$15';
  const proPriceYearlyMonthly = isINR ? '₹959' : '$12';
  const proBilledTotal = isINR ? '₹11,500 / year' : '$144 / year';

  return (
    <div className="min-h-screen bg-oled-bg text-zinc-100 flex flex-col">
      <Header
        currentEngine={engine}
        onEngineChange={setEngine}
        onOpenApiSettings={() => setIsApiSettingsOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-oled-surface border border-oled-border text-xs font-mono text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Honest & Predictable Pricing</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-100 font-mono">
            Choose Your 3D Creation Tier
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
            From quick volumetric prototypes to high-poly studio exports. Free daily conversions for all creators, with zero hidden telemetry or lock-in.
          </p>

          {/* Toggle Controls: Billing Cycle & Currency */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Monthly / Yearly Toggle */}
            <div className="inline-flex items-center p-1 rounded-xl bg-oled-surface border border-oled-border text-xs font-mono">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg font-medium transition-colors ${
                  !isYearly
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  isYearly
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                  Save 20%
                </span>
              </button>
            </div>

            {/* Currency Selector */}
            <div className="inline-flex items-center p-1 rounded-xl bg-oled-surface border border-oled-border text-xs font-mono">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  !isINR
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  isINR
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                INR (₹)
              </button>
            </div>
          </div>
        </div>

        {/* 3-Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto">
          {/* =========================================
              Tier 1: Free Tier ("Hobbyist")
              ========================================= */}
          <div className="p-6 sm:p-8 rounded-2xl bg-oled-surface border border-oled-border flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Hobbyist
                </span>
                <h2 className="text-xl font-bold font-mono text-zinc-100 mt-1">
                  Free Tier
                </h2>
                <p className="text-xs text-zinc-400 font-sans mt-1">
                  Ideal for casual experimentation, learning 3D concepts, and quick prototypes.
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-zinc-100">
                    {isINR ? '₹0' : '$0'}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">/ month</span>
                </div>
                <p className="text-[11px] font-mono text-zinc-500 mt-1">
                  Free forever &bull; No credit card required
                </p>
              </div>

              <div className="border-t border-oled-border pt-4 space-y-3 text-xs font-mono">
                <div className="flex items-start gap-2.5 text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>5 Volumetric 3D conversions per day</span>
                </div>
                <div className="flex items-start gap-2.5 text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Standard resolution mesh output (.GLB)</span>
                </div>
                <div className="flex items-start gap-2.5 text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Interactive 360° touch and mouse orbit canvas</span>
                </div>
                <div className="flex items-start gap-2.5 text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Studio Daylight & Rim Light presets</span>
                </div>
                <div className="flex items-start gap-2.5 text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Turnaround PNG camera frame capture</span>
                </div>
                <div className="flex items-start gap-2.5 text-zinc-500">
                  <span className="w-4 text-center shrink-0">&bull;</span>
                  <span>Community support & standard public queue</span>
                </div>
              </div>
            </div>

            <div>
              {user.plan === 'free' && !user.isGuest ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 text-zinc-400 border border-zinc-700 font-mono text-xs font-semibold cursor-default"
                >
                  Current Active Plan
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-oled-panel hover:bg-zinc-800 text-zinc-200 border border-oled-border font-mono text-xs font-semibold transition-colors"
                >
                  {user.isGuest ? 'Start Free Plan' : 'Free Tier Active'}
                </button>
              )}
            </div>
          </div>

          {/* =========================================
              Tier 2: Pro Tier ("Creator") - Highlighted
              ========================================= */}
          <div className="p-6 sm:p-8 rounded-2xl bg-oled-surface border-2 border-emerald-500/50 flex flex-col justify-between space-y-6 relative shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-zinc-950 text-[10px] font-mono font-bold uppercase tracking-wider">
              Most Popular
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                  Creator
                </span>
                <h2 className="text-xl font-bold font-mono text-zinc-100 mt-1">
                  Pro Tier
                </h2>
                <p className="text-xs text-zinc-400 font-sans mt-1">
                  For 3D artists, game designers, and indie devs needing high-poly exports and zero limits.
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-zinc-100">
                    {isYearly ? proPriceYearlyMonthly : proPriceMonthly}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">/ month</span>
                </div>
                <p className="text-[11px] font-mono text-emerald-400/90 mt-1">
                  {isYearly ? `Billed ${proBilledTotal} (Save 20%)` : 'Billed monthly &bull; Cancel anytime'}
                </p>
              </div>

              <div className="border-t border-oled-border pt-4 space-y-3 text-xs font-mono">
                <div className="flex items-start gap-2.5 text-zinc-200">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-semibold text-zinc-100">Unlimited Volumetric Conversions</span>
                </div>
                <div className="flex items-start gap-2.5 text-zinc-200">
                  <Layers className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>High-poly watertight reconstruction (up to 50k tris)</span>
                </div>
                <div className="flex items-start gap-2.5 text-zinc-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Full export formats: Binary .GLB & Wavefront .OBJ</span>
                </div>
                <div className="flex items-start gap-2.5 text-zinc-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>USDZ Quick Look & WebXR AR inspection support</span>
                </div>
                <div className="flex items-start gap-2.5 text-zinc-200">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Priority processing queue (reduced wait times)</span>
                </div>
                <div className="flex items-start gap-2.5 text-zinc-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Commercial usage rights for generated models</span>
                </div>
              </div>
            </div>

            <div>
              {user.plan === 'pro' ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-950/60 border border-emerald-600/50 text-emerald-300 font-mono text-xs font-semibold cursor-default flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Active Pro Subscription</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-mono text-xs font-bold transition-transform active:scale-[0.98] shadow-subtle flex items-center justify-center gap-2"
                >
                  <span>Upgrade to Pro</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* =========================================
              Tier 3: Studio Tier ("Developer / API")
              ========================================= */}
          <div className="p-6 sm:p-8 rounded-2xl bg-oled-surface border border-oled-border flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Developer & Team
                </span>
                <h2 className="text-xl font-bold font-mono text-zinc-100 mt-1">
                  Studio Tier
                </h2>
                <p className="text-xs text-zinc-400 font-sans mt-1">
                  For automated production pipelines, batch catalogs, and direct API server keys.
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-zinc-100">
                    Custom
                  </span>
                </div>
                <p className="text-[11px] font-mono text-zinc-500 mt-1">
                  Tailored pipeline limits &bull; Dedicated compute
                </p>
              </div>

              <div className="border-t border-oled-border pt-4 space-y-3 text-xs font-mono">
                <div className="flex items-start gap-2.5 text-zinc-300">
                  <Cpu className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>REST API programmatic access & SDK integration</span>
                </div>
                <div className="flex items-start gap-2.5 text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Batch conversion endpoints & Webhook status callbacks</span>
                </div>
                <div className="flex items-start gap-2.5 text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Custom rate limits & dedicated GPU worker nodes</span>
                </div>
                <div className="flex items-start gap-2.5 text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Dedicated developer email channel</span>
                </div>
                <div className="flex items-start gap-2.5 text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Custom shader and baking configurations</span>
                </div>
              </div>
            </div>

            <div>
              <a
                href="mailto:work.dwijkansagara@gmail.com?subject=Spiny3D%20Studio%20Tier%20Inquiry"
                className="w-full py-2.5 px-4 rounded-xl bg-oled-panel hover:bg-zinc-800 text-zinc-200 border border-oled-border font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Contact Sales</span>
              </a>
            </div>
          </div>
        </div>

        {/* Feature Matrix / Comparison Table */}
        <div className="max-w-4xl mx-auto space-y-4 pt-6">
          <h2 className="text-lg font-bold font-mono text-zinc-100 text-center">
            Detailed Feature Comparison
          </h2>

          <div className="rounded-2xl border border-oled-border bg-oled-surface overflow-hidden text-xs font-mono">
            <div className="grid grid-cols-4 p-4 border-b border-oled-border bg-oled-panel/50 text-zinc-400 font-semibold uppercase text-[11px]">
              <div>Feature</div>
              <div className="text-center">Free</div>
              <div className="text-center text-emerald-400">Pro</div>
              <div className="text-center">Studio</div>
            </div>

            <div className="divide-y divide-oled-border">
              <div className="grid grid-cols-4 p-3.5 items-center">
                <span className="text-zinc-200">Daily Conversions</span>
                <span className="text-center text-zinc-400">5 / day</span>
                <span className="text-center text-emerald-400 font-bold">Unlimited</span>
                <span className="text-center text-zinc-300">Custom Quota</span>
              </div>
              <div className="grid grid-cols-4 p-3.5 items-center">
                <span className="text-zinc-200">Mesh Reconstruction</span>
                <span className="text-center text-zinc-400">Standard 360°</span>
                <span className="text-center text-emerald-400 font-bold">High-Poly Watertight</span>
                <span className="text-center text-zinc-300">Custom LODs</span>
              </div>
              <div className="grid grid-cols-4 p-3.5 items-center">
                <span className="text-zinc-200">Export Formats</span>
                <span className="text-center text-zinc-400">.GLB only</span>
                <span className="text-center text-emerald-400 font-bold">.GLB + .OBJ + USDZ</span>
                <span className="text-center text-zinc-300">All + Raw Assets</span>
              </div>
              <div className="grid grid-cols-4 p-3.5 items-center">
                <span className="text-zinc-200">Processing Priority</span>
                <span className="text-center text-zinc-400">Standard Queue</span>
                <span className="text-center text-emerald-400 font-bold">High Priority</span>
                <span className="text-center text-zinc-300">Dedicated Worker</span>
              </div>
              <div className="grid grid-cols-4 p-3.5 items-center">
                <span className="text-zinc-200">API & Webhooks</span>
                <span className="text-center text-zinc-500">&mdash;</span>
                <span className="text-center text-zinc-500">&mdash;</span>
                <span className="text-center text-emerald-400 font-bold">Full Access</span>
              </div>
              <div className="grid grid-cols-4 p-3.5 items-center">
                <span className="text-zinc-200">Commercial License</span>
                <span className="text-center text-zinc-400">Personal / Eval</span>
                <span className="text-center text-emerald-400 font-bold">Included</span>
                <span className="text-center text-emerald-400 font-bold">Enterprise</span>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Disclosures, FAQ & Legal Compliance */}
        <div className="max-w-4xl mx-auto space-y-6 pt-6 border-t border-oled-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono text-zinc-400">
            <div className="p-4 rounded-xl bg-oled-surface border border-oled-border space-y-2">
              <div className="flex items-center gap-2 text-zinc-200 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Transparent Billing & Sandbox Mode</span>
              </div>
              <p className="text-zinc-400 font-sans leading-relaxed text-xs">
                Payments are currently processed in sandbox simulation mode for developer testing. Subscriptions can be canceled at any time from your account settings without penalties.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-oled-surface border border-oled-border space-y-2">
              <div className="flex items-center gap-2 text-zinc-200 font-semibold">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>India DPDP Act & Privacy Disclosures</span>
              </div>
              <p className="text-zinc-400 font-sans leading-relaxed text-xs">
                Zero permanent server storage for unauthenticated images. See our{' '}
                <Link to="/refund" className="text-emerald-400 hover:underline">
                  Refund Policy
                </Link>
                ,{' '}
                <Link to="/privacy" className="text-emerald-400 hover:underline">
                  DPDP Privacy Policy
                </Link>
                , and{' '}
                <Link to="/terms" className="text-emerald-400 hover:underline">
                  Terms of Service
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Developer Attribution Card */}
          <div className="text-center text-xs font-mono text-zinc-500 pt-4">
            <span>
              Engineered by Dwij Kansagara (Rajkot, Gujarat, India) &bull; Direct Contact:{' '}
              <a
                href="mailto:work.dwijkansagara@gmail.com"
                className="text-emerald-400 hover:underline"
              >
                work.dwijkansagara@gmail.com
              </a>
            </span>
          </div>
        </div>
      </main>

      <Footer />

      {/* Auth Modal for sign in / register */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="register"
      />

      {/* Upgrade Modal for sandbox Pro checkout */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

      {/* API Key Modal */}
      <ApiSettingsModal
        isOpen={isApiSettingsOpen}
        onClose={() => setIsApiSettingsOpen(false)}
        tripoKey={sessionStorage.getItem('spiny3d_tripo_key') || ''}
        meshyKey={sessionStorage.getItem('spiny3d_meshy_key') || ''}
        onSaveKeys={(keys) => {
          if (keys.tripo) sessionStorage.setItem('spiny3d_tripo_key', keys.tripo);
          else sessionStorage.removeItem('spiny3d_tripo_key');
          if (keys.meshy) sessionStorage.setItem('spiny3d_meshy_key', keys.meshy);
          else sessionStorage.removeItem('spiny3d_meshy_key');
        }}
      />
    </div>
  );
};
