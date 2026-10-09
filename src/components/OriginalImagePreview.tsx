import React, { useState } from 'react';
import { Eye, EyeOff, Image as ImageIcon } from 'lucide-react';

interface OriginalImagePreviewProps {
  imageUrl?: string;
  fileName?: string;
  altText: string;
}

export const OriginalImagePreview: React.FC<OriginalImagePreviewProps> = ({
  imageUrl,
  fileName,
  altText,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!imageUrl) {
    return (
      <div className="p-4 rounded-xl bg-oled-surface border border-oled-border text-xs text-zinc-500 font-mono flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-zinc-600" aria-hidden="true" />
        <span>Pre-bundled 3D asset (no source 2D raster uploaded)</span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-oled-surface border border-oled-border space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <h3 className="text-xs font-semibold text-zinc-200 uppercase font-mono tracking-wider">
            Original 2D Source Image
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="text-zinc-400 hover:text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
          aria-expanded={isVisible}
        >
          {isVisible ? (
            <>
              <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Collapse</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Show</span>
            </>
          )}
        </button>
      </div>

      {isVisible && (
        <div className="space-y-2">
          {/* Reserved aspect ratio box to eliminate Cumulative Layout Shift (CLS) */}
          <div className="relative w-full aspect-square max-h-56 bg-oled-panel rounded-lg overflow-hidden border border-oled-border flex items-center justify-center">
            <img
              src={imageUrl}
              alt={altText}
              loading="lazy"
              width={224}
              height={224}
              className="w-full h-full object-contain"
            />
          </div>

          {fileName && (
            <div className="text-[11px] font-mono text-zinc-400 truncate" title={fileName}>
              File: <span className="text-zinc-300">{fileName}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
