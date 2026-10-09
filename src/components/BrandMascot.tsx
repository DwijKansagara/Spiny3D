import React from 'react';

interface BrandMascotProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const BrandMascot: React.FC<BrandMascotProps> = ({
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const dimensionMap = {
    sm: { width: 32, height: 32, textClass: 'text-base font-bold' },
    md: { width: 44, height: 44, textClass: 'text-lg font-bold' },
    lg: { width: 64, height: 64, textClass: 'text-2xl font-bold' },
  };

  const current = dimensionMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Original Spiny 3D Polygonal Mascot with d* Emblem */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-xl bg-oled-surface border border-oled-border p-1 shadow-subtle group"
        style={{ width: current.width, height: current.height }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform transition-transform duration-300 group-hover:scale-105"
        >
          {/* Faceted Spiny Body Geometries */}
          <polygon points="32,8 48,22 32,28" fill="#10b981" />
          <polygon points="32,8 16,22 32,28" fill="#059669" />
          <polygon points="16,22 8,38 24,38" fill="#047857" />
          <polygon points="48,22 56,38 40,38" fill="#34d399" />
          <polygon points="32,28 24,38 40,38" fill="#6ee7b7" />
          <polygon points="24,38 12,54 32,48" fill="#059669" />
          <polygon points="40,38 52,54 32,48" fill="#10b981" />
          <polygon points="32,48 32,58 20,54" fill="#047857" />
          <polygon points="32,48 32,58 44,54" fill="#065f46" />

          {/* Wireframe Facet Outlines */}
          <line x1="32" y1="8" x2="32" y2="48" stroke="#090a0f" strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="16" y1="22" x2="48" y2="22" stroke="#090a0f" strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="24" y1="38" x2="40" y2="38" stroke="#090a0f" strokeWidth="1.2" strokeOpacity="0.7" />

          {/* Precision Sensor Core */}
          <circle cx="32" cy="33" r="3.5" fill="#ffffff" />
          <circle cx="32" cy="33" r="1.5" fill="#065f46" />

          {/* Integrated d* Mark Accent */}
          <path
            d="M48,15 L52,11 M48,11 L52,15 M50,10 L50,16 M47,13 L53,13"
            stroke="#6ee7b7"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>

        {/* Subtle d* brand tag on corner */}
        <span
          className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-zinc-900 border border-emerald-500/50 rounded text-[9px] font-mono text-emerald-400 font-bold leading-tight"
          title="d* Verified Original Identity"
        >
          d*
        </span>
      </div>

      {showLabel && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`${current.textClass} text-zinc-100 tracking-tight font-mono`}>
              Spiny<span className="text-emerald-400">3D</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-oled-surface text-zinc-400 border border-oled-border">
              v1.0
            </span>
          </div>
          <span className="text-[11px] font-sans text-zinc-400 tracking-normal">
            2D to 3D Mesh Generator
          </span>
        </div>
      )}
    </div>
  );
};
