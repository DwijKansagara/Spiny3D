import React from 'react';
import { LegalPageLayout } from './LegalPageLayout';

export const PrivacyPolicy: React.FC = () => {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="Comprehensive data governance and processing architecture compliant with India's Digital Personal Data Protection (DPDP) Act, 2023."
      lastUpdated="October 9, 2026"
    >
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-100 font-mono">
          1. Data Fiduciary & Scope
        </h2>
        <p>
          Spiny3D is an application developed and maintained by Dwij Kansagara (Rajkot, Gujarat, India). This Privacy Policy governs the processing of digital personal data when you interact with Spiny3D across web and hybrid mobile packaging (Capacitor). We strictly respect your digital sovereignty and operate under the tenets of data minimization, purpose limitation, and storage limitation as mandated by India&apos;s Digital Personal Data Protection (DPDP) Act, 2023.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-100 font-mono">
          2. Image Processing Lifecycle & Zero Permanent Retention
        </h2>
        <p>
          When you upload an image to Spiny3D, the following processing lifecycle occurs:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-zinc-300">
          <li>
            <strong>Client-Side Validation:</strong> Uploaded files are immediately evaluated in the browser buffer for magic byte integrity (JPEG, PNG, WebP) and size compliance (maximum 15MB). No payload is dispatched until header validity is confirmed.
          </li>
          <li>
            <strong>Local Reconstruction (Default):</strong> When using the default Local Mock 3D engine, the image is parsed entirely within client memory utilizing HTML5 Canvas pixel analysis. No raster image data leaves your local machine or device.
          </li>
          <li>
            <strong>Zero Permanent Server Storage:</strong> For unauthenticated public generation, Spiny3D maintains exactly zero (0) persistent disk or database storage for uploaded images or generated 3D meshes. Once your browser session or tab closes, memory blobs are garbage collected.
          </li>
          <li>
            <strong>Ephemeral Discard:</strong> Intermediate depth calculations and point cloud structures are released from memory immediately upon mesh instantiation.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-100 font-mono">
          3. Third-Party Gateway Data Flows
        </h2>
        <p>
          If you explicitly select an external third-party generation engine (such as Tripo3D, Meshy, or LGM) and provide an API gateway configuration:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-zinc-300">
          <li>
            Image payloads are transmitted securely via TLS 1.3 encrypted REST requests directly to the designated third-party endpoint.
          </li>
          <li>
            Spiny3D never logs, caches, or inspects the transmitted payloads on intermediate proxy relays.
          </li>
          <li>
            We do not sell, rent, or monetize your images, metadata, or generated 3D assets to any data brokers or advertisers.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-100 font-mono">
          4. Local Storage & Functional State
        </h2>
        <p>
          Spiny3D utilizes browser <code>localStorage</code> strictly for non-sensitive functional preferences:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
          <li>Viewport lighting preset selection</li>
          <li>Auto-spin toggle state preference</li>
          <li>Wireframe inspection toggle preference</li>
        </ul>
        <p>
          No fingerprinting identifiers, tracking cookies, or cross-site advertising beacons are deployed.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-100 font-mono">
          5. Rights of the Data Principal (DPDP Act)
        </h2>
        <p>
          Under the DPDP Act 2023, you hold enforceable rights as a Data Principal, including:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
          <li>Right to access summary information regarding data processed.</li>
          <li>Right to correction and erasure of personal data.</li>
          <li>Right of grievance redressal.</li>
          <li>Right to nominate an individual in the event of death or incapacity.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-100 font-mono">
          6. Grievance Redressal & Contact
        </h2>
        <p>
          If you have inquiries or wish to exercise your statutory rights under the DPDP Act, contact our Grievance Officer:
        </p>
        <div className="p-4 rounded-xl bg-oled-surface border border-oled-border font-mono text-xs space-y-1 text-zinc-300">
          <div>Data Fiduciary: Dwij Kansagara</div>
          <div>Location: Rajkot, Gujarat, India</div>
          <div>Public Grievance Email: <a href="mailto:work.dwijkansagara@gmail.com" className="text-emerald-400 underline">work.dwijkansagara@gmail.com</a></div>
        </div>
      </section>
    </LegalPageLayout>
  );
};
