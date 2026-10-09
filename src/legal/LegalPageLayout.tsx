import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Calendar, Mail, MapPin, User } from 'lucide-react';

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  title,
  subtitle,
  lastUpdated,
  children,
}) => {
  return (
    <div className="min-h-screen bg-oled-bg text-zinc-100 flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-oled-surface border border-oled-border text-xs font-mono text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to Spiny3D Studio</span>
          </Link>
        </div>

        {/* Header Banner */}
        <header className="border-b border-oled-border pb-6 mb-8 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
            <Shield className="w-4 h-4" aria-hidden="true" />
            <span>Compliance & Legal Documentation</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-zinc-100">
            {title}
          </h1>

          <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 pt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              Effective Date: {lastUpdated}
            </span>
            <span>&bull;</span>
            <span className="text-emerald-400">India DPDP Act (2023) Compliant</span>
          </div>
        </header>

        {/* Content Body */}
        <article className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed text-zinc-300">
          {children}
        </article>

        {/* Developer Attribution Card */}
        <section
          className="mt-12 p-6 rounded-2xl bg-oled-surface border border-oled-border space-y-3 text-xs"
          aria-label="Developer Information"
        >
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 font-mono">
            Data Fiduciary & Developer Contact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-zinc-400 font-mono">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
              <span>Dwij Kansagara</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
              <span>Rajkot, Gujarat, India</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <a
                href="mailto:work.dwijkansagara@gmail.com"
                className="text-zinc-300 hover:text-emerald-400 underline underline-offset-2"
              >
                work.dwijkansagara@gmail.com
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
