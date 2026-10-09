import React from 'react';
import { LegalPageLayout } from './LegalPageLayout';

export const CookiePolicy: React.FC = () => {
  return (
    <LegalPageLayout
      title="Cookie & Local Storage Policy"
      subtitle="Transparent disclosure of client-side storage keys and complete absence of nonessential tracking scripts."
      lastUpdated="October 9, 2026"
    >
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-100 font-mono">
          1. Zero Third-Party Tracking Cookies
        </h2>
        <p>
          Spiny3D deploys <strong>zero (0) third-party advertising cookies, zero marketing trackers, and zero behavioral telemetry beacons</strong>. We do not integrate surveillance analytics networks (such as Google Analytics or Meta Pixel) that follow visitors across domains.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-100 font-mono">
          2. Inventory of Functional Client-Side Keys
        </h2>
        <p>
          We utilize browser <code>localStorage</code> strictly for functional viewport state so your preferences persist between sessions:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border border-oled-border rounded-xl">
            <thead className="bg-oled-panel text-zinc-300">
              <tr>
                <th className="p-3 border-b border-oled-border">Storage Key</th>
                <th className="p-3 border-b border-oled-border">Purpose</th>
                <th className="p-3 border-b border-oled-border">Category</th>
                <th className="p-3 border-b border-oled-border">Lifespan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-oled-border text-zinc-400">
              <tr>
                <td className="p-3 text-emerald-400">spiny3d_lighting_preset</td>
                <td className="p-3">Remembers chosen 3D lighting environment (Daylight, Rim, Key)</td>
                <td className="p-3">Functional</td>
                <td className="p-3">Persistent until cleared</td>
              </tr>
              <tr>
                <td className="p-3 text-emerald-400">spiny3d_wireframe_pref</td>
                <td className="p-3">Stores last active mesh wireframe toggle state</td>
                <td className="p-3">Functional</td>
                <td className="p-3">Persistent until cleared</td>
              </tr>
              <tr>
                <td className="p-3 text-emerald-400">spiny3d_autospin_pref</td>
                <td className="p-3">Stores idle 3D camera auto-spin rotation preference</td>
                <td className="p-3">Functional</td>
                <td className="p-3">Persistent until cleared</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-100 font-mono">
          3. How to Clear Local Storage
        </h2>
        <p>
          You can purge all stored preferences at any time through your browser settings by navigating to Developer Tools &gt; Application &gt; Local Storage &gt; Clear All, or via your browser privacy preferences. Clearing these keys will simply restore Spiny3D to its clean default state without interrupting core functionality.
        </p>
      </section>
    </LegalPageLayout>
  );
};
