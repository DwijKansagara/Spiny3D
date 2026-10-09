import React from 'react';
import { Link } from 'react-router-dom';
import { BrandMascot } from './BrandMascot';
import { Shield, FileText, Cookie, Receipt, Mail, MapPin, User, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-oled-surface border-t border-oled-border text-zinc-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-1 space-y-4">
            <BrandMascot size="md" showLabel={true} />
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              High-utility web and hybrid mobile tool for generating interactive, rotatable 3D meshes from 2D images with responsive touch and mouse orbit controls.
            </p>
            <div className="pt-2 text-[11px] font-mono text-zinc-500">
              Built with React, TypeScript, Three.js & Tailwind CSS.
            </div>
          </div>

          {/* Col 2: Legal & DPDP Compliance */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 font-mono">
              Compliance & Legal
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/privacy"
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                  <span>Privacy Policy (DPDP Act)</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Cookie className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
                  <span>Cookie & Storage Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/refund"
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Receipt className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
                  <span>Refund Policy</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Developer Disclosure */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 font-mono">
              Developer Attribution
            </h3>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
                <span className="text-zinc-200 font-medium">Dwij Kansagara</span>
                <span className="text-zinc-500 text-[11px]">(He/Him)</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Terminal className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
                <span>10th-standard student</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
                <span>Rajkot, Gujarat, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <a
                  href="mailto:work.dwijkansagara@gmail.com"
                  className="text-zinc-300 hover:text-emerald-400 underline underline-offset-2 transition-colors font-mono text-[11px]"
                >
                  work.dwijkansagara@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Open Source Licenses & Architecture */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 font-mono">
              Open Source Attributions
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Three.js (MIT), @react-three/fiber (MIT), @react-three/drei (MIT), Lucide Icons (ISC), Tailwind CSS (MIT).
            </p>
            <div className="p-2.5 rounded-lg bg-oled-bg border border-oled-border text-[11px] font-mono text-zinc-400 leading-normal">
              Security: Max 15MB client-validated buffer. Magic-byte verification active. Zero unauthenticated telemetry.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-oled-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div>
            &copy; 2026 Spiny3D &bull; Maintained by Dwij Kansagara (Rajkot, India).
          </div>
          <div className="flex items-center gap-4">
            <span>India DPDP Act Ready</span>
            <span>&bull;</span>
            <span>Capacitor Hybrid Target</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
