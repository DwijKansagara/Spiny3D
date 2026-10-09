import React from 'react';
import { LegalPageLayout } from './LegalPageLayout';

export const RefundPolicy: React.FC = () => {
  return (
    <LegalPageLayout
      title="Refund & Billing Policy"
      subtitle="Transparent fee structure and consumer policy regarding Spiny3D services."
      lastUpdated="October 9, 2026"
    >
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-100 font-mono">
          1. Current Free Utility Status
        </h2>
        <p>
          All current core features of Spiny3D—including 2D image upload validation, local 3D depth mesh reconstruction, WebGL orbit inspection, wireframe toggles, and standard .GLB / .OBJ file downloads—are provided <strong>completely free of charge</strong>. We do not require payment details, subscription credentials, or credit cards for these utilities.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-100 font-mono">
          2. Terms for Potential Premium Enterprise Features
        </h2>
        <p>
          Should Spiny3D introduce dedicated high-concurrency cloud GPU rendering tiers or premium dedicated API clusters in the future:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-zinc-300">
          <li>
            <strong>Pre-Billing Transparency:</strong> All pricing structures, credit quotas, and renewal terms will be explicitly displayed prior to checkout confirmation.
          </li>
          <li>
            <strong>Failed Generation Guarantees:</strong> In any future paid tier, if a generation job fails due to server-side exceptions, the computational credit will be automatically refunded to your balance.
          </li>
          <li>
            <strong>Voluntary Support & Sponsorships:</strong> Any voluntary donations or developer sponsorships received to offset hosting costs are considered non-refundable contributions.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-100 font-mono">
          3. Contact for Inquiries
        </h2>
        <p>
          For any billing questions or commercial licensing inquiries, contact:
        </p>
        <div className="p-4 rounded-xl bg-oled-surface border border-oled-border font-mono text-xs space-y-1 text-zinc-300">
          <div>Developer: Dwij Kansagara</div>
          <div>Location: Rajkot, Gujarat, India</div>
          <div>Email: <a href="mailto:work.dwijkansagara@gmail.com" className="text-emerald-400 underline">work.dwijkansagara@gmail.com</a></div>
        </div>
      </section>
    </LegalPageLayout>
  );
};
