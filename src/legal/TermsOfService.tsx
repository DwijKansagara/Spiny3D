import React from 'react';
import { LegalPageLayout } from './LegalPageLayout';

export const TermsOfService: React.FC = () => {
  return (
    <LegalPageLayout
      title="Terms of Service"
      subtitle="Usage guidelines, intellectual property allocation, and liability disclaimers for Spiny3D."
      lastUpdated="October 9, 2026"
    >
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-100 font-mono">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or utilizing Spiny3D via web browsers or hybrid application wrappers, you agree to be bound by these Terms of Service. If you disagree with any portion of these terms, please discontinue use immediately.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-100 font-mono">
          2. Intellectual Property Rights Over Generated Assets
        </h2>
        <p>
          We assert no ownership claim over your content:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-zinc-300">
          <li>
            <strong>User Content Ownership:</strong> You retain complete, unrestricted intellectual property rights over any 2D images you upload to the service.
          </li>
          <li>
            <strong>Generated 3D Meshes (.GLB / .OBJ):</strong> All 3D meshes, textures, UV coordinate mappings, and turnaround renders generated from your source image belong exclusively to you for personal, commercial, or educational utilization.
          </li>
          <li>
            <strong>Spiny3D Platform IP:</strong> The Spiny3D software, custom algorithms, brand trademarks, and the &ldquo;d*&rdquo; emblem and mascot illustrations remain the intellectual property of developer Dwij Kansagara.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-100 font-mono">
          3. Acceptable Use and Rate Limits
        </h2>
        <p>
          You agree to abide by the following operational boundaries:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
          <li>Upload file size shall not exceed 15MB per asset.</li>
          <li>Do not transmit malicious code, corrupted binary headers, or exploits designed to trigger buffer overflow in WebGL parsers.</li>
          <li>Do not reverse-engineer or attempt to overwhelm generation endpoints with automated script flooding.</li>
          <li>Ensure you hold the legal right or copyright license to transform uploaded 2D subject matter into derivative 3D representations.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-100 font-mono">
          4. Technical Disclaimer of Warranties
        </h2>
        <p>
          Spiny3D is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. Real-time 3D triangulation and WebGL rendering are inherently hardware-dependent. We do not warrant that:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
          <li>Render performance will be uniform across legacy GPU hardware without hardware acceleration.</li>
          <li>Generated meshes are watertight or structurally certified for industrial CNC machining, injection molding, or load-bearing 3D printing without manual topology inspection in Blender or CAD.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-100 font-mono">
          5. Governing Law and Jurisdiction
        </h2>
        <p>
          These terms shall be governed by and construed in accordance with the laws of India. Any legal dispute or proceeding arising from these terms shall be subject to the exclusive jurisdiction of the competent courts in Rajkot, Gujarat, India.
        </p>
      </section>
    </LegalPageLayout>
  );
};
