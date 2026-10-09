import React from 'react';
import { Box, Play, Layers } from 'lucide-react';
import type { PresetDemo } from '../types';

export const PRESET_DEMOS: PresetDemo[] = [
  {
    id: 'demo-sneaker',
    name: 'Sample Sneaker',
    category: 'Footwear & Apparel',
    description: 'Multi-part athletic sneaker mesh with segmented sole, laces, and collar geometry.',
    thumbnailUrl: '',
    stats: {
      vertices: 1840,
      triangles: 3420,
      format: 'GLB',
      fileSizeBytes: 245000,
    },
  },
  {
    id: 'demo-mug',
    name: 'Ceramic Tableware Mug',
    category: 'Industrial Design',
    description: 'Smooth ceramic coffee mug with curved ergonomic handle and liquid plane.',
    thumbnailUrl: '',
    stats: {
      vertices: 1560,
      triangles: 2880,
      format: 'GLB',
      fileSizeBytes: 180000,
    },
  },
  {
    id: 'demo-dog',
    name: 'Low-Poly Companion Dog',
    category: 'Character & Organic',
    description: 'Stylized canine model with faceted low-poly body topology, snout, and limbs.',
    thumbnailUrl: '',
    stats: {
      vertices: 1120,
      triangles: 2140,
      format: 'GLB',
      fileSizeBytes: 154000,
    },
  },
  {
    id: 'demo-robot',
    name: 'Industrial Toy Robot',
    category: 'Mechanical & Robotics',
    description: 'Precision mechanical robot with cylindrical torso gear and glowing emissive visor.',
    thumbnailUrl: '',
    stats: {
      vertices: 2480,
      triangles: 4620,
      format: 'GLB',
      fileSizeBytes: 310000,
    },
  },
];

interface PresetGalleryProps {
  onSelectPreset: (presetId: string) => void;
  isLoading: boolean;
}

export const PresetGallery: React.FC<PresetGalleryProps> = ({
  onSelectPreset,
  isLoading,
}) => {
  return (
    <section className="w-full space-y-4" aria-labelledby="preset-gallery-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 id="preset-gallery-heading" className="text-sm font-semibold uppercase tracking-wider text-zinc-200 font-mono flex items-center gap-2">
            <Box className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Quick Demo Presets</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Instant 3D models pre-bundled for immediate inspection without uploading a photo.
          </p>
        </div>
        <span className="text-[11px] font-mono text-zinc-500">
          4 standard assets available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRESET_DEMOS.map((demo) => (
          <div
            key={demo.id}
            className="flex flex-col justify-between p-4 rounded-xl bg-oled-surface border border-oled-border hover:border-zinc-500 transition-all group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span className="text-emerald-400/90 font-medium">{demo.category}</span>
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3 text-zinc-500" aria-hidden="true" />
                  {demo.stats.triangles.toLocaleString()} tris
                </span>
              </div>

              <h3 className="text-sm font-medium text-zinc-100 group-hover:text-emerald-300 transition-colors font-mono">
                {demo.name}
              </h3>

              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                {demo.description}
              </p>
            </div>

            <div className="pt-4 mt-2 border-t border-oled-border/60">
              <button
                type="button"
                onClick={() => onSelectPreset(demo.id)}
                disabled={isLoading}
                className="w-full py-2 px-3 rounded-lg bg-oled-panel hover:bg-oled-card text-zinc-200 text-xs font-medium border border-oled-border flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span>Load in 3D Viewer</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
