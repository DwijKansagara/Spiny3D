# Spiny3D

**Spiny3D** is a high-utility, production-grade web and hybrid mobile application engineered to convert 2D raster images into interactive, rotatable 3D models with responsive touch and mouse orbit controls.

Built with an OLED-optimized dark theme, zero telemetry, and strict client-side validation, Spiny3D provides immediate 3D visualization without requiring third-party cloud accounts or permanent server storage.

---

## Key Capabilities

- **Interactive 3D WebGL Canvas**: Touch and mouse OrbitControls powered by Three.js, `@react-three/fiber`, and `@react-three/drei`. Supports 360° horizontal/vertical orbit, inertia damping, pinch-to-zoom, and boundary restraints.
- **Client-Side Security Pipeline**: Strict header magic byte screening (`validateImageFile`) for JPEG, PNG, and WebP assets with a hard 15MB buffer ceiling.
- **Procedural & Depth-Map 3D Gateway**: Local Mock 3D Service reconstructs organic 3D relief meshes directly in browser memory using pixel luminance analysis. Compatible with external REST adapters (Tripo3D, Meshy, LGM).
- **Quick Demo Preset Gallery**: Bundled standard 3D assets (Athletic Sneaker, Ceramic Tableware Mug, Low-Poly Companion Dog, Industrial Robot) for instant testing without image uploads.
- **Multi-Format 3D Exporters**: Export active models to standard binary `.GLB`, Wavefront `.OBJ`, high-resolution turnaround frame snapshots, and AR Quick-Look/WebXR inspect modes.
- **Lighting & Topology Inspection**: Toggle between solid textured rendering and wireframe mesh view; switch between Studio Neutral Daylight, Soft Rim Light, and High-Contrast Key Light presets.
- **India DPDP Act Compliance**: Dedicated crawlable routes (`/privacy`, `/terms`, `/cookies`, `/refund`) documenting zero unauthenticated server data retention and functional-only local storage.

---

## Tech Stack & Architecture

```
Spiny3D
├── /src
│   ├── /api
│   │   └── generate3d.ts          # REST 3D gateway & mock pipeline
│   ├── /canvas
│   │   ├── LightingRig.tsx        # Daylight, Rim, Key lighting presets
│   │   ├── ModelRenderer.tsx      # Mesh auto-centering & wireframe toggle
│   │   └── Viewer3D.tsx           # WebGL canvas with touch OrbitControls
│   ├── /components
│   │   ├── BrandMascot.tsx        # Original Spiny SVG mascot with d* emblem
│   │   ├── ControlsToolbar.tsx    # Tactile viewport toolbar
│   │   ├── ExportPanel.tsx        # GLB/OBJ download & AR dialog
│   │   ├── Footer.tsx             # Legal, DPDP, and developer attribution
│   │   ├── Header.tsx             # Brand navigation and engine selector
│   │   ├── OriginalImagePreview.tsx # Side-by-side comparison thumbnail
│   │   ├── PresetGallery.tsx      # Quick demo standard assets
│   │   ├── ProcessingView.tsx     # 4-stage reconstruction tracker
│   │   └── UploadZone.tsx         # Drag-and-drop & mobile camera picker
│   ├── /legal
│   │   ├── CookiePolicy.tsx       # Functional storage key inventory
│   │   ├── LegalPageLayout.tsx    # Accessible layout wrapper
│   │   ├── PrivacyPolicy.tsx      # India DPDP Act (2023) compliance
│   │   ├── RefundPolicy.tsx       # Core free service disclosure
│   │   └── TermsOfService.tsx     # IP ownership of generated assets
│   ├── /pages
│   │   └── Home.tsx               # Primary application coordinator
│   ├── /types
│   │   └── index.ts               # Shared TypeScript schemas
│   └── /utils
│       ├── fileSecurity.ts        # Magic byte verification (JPEG/PNG/WebP)
│       ├── modelExporters.ts      # Three.js GLTFExporter & OBJExporter
│       └── proceduralMeshes.ts    # Standard preset meshes & depth extruders
```

---

## Local Development & Setup

### Prerequisites
- Node.js 18+ (tested on Node v24 LTS)
- npm 9+

### Installation
```bash
# Clone the repository
git clone https://github.com/dwijkansagara/spiny3d.git

# Navigate into project directory
cd spiny3d

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

### Production Build
```bash
npm run build
```
Production assets are generated in `/dist` with production source maps stripped for security.

### Preview Production Build
```bash
npm run preview
```

---

## Mobile Packaging (Capacitor)

Spiny3D is engineered for hybrid packaging on mobile viewports:
- Safe area inset padding (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`).
- Tested against iPhone 15 Pro (393x852) and Google Pixel 8 (412x915) screen dimensions.
- Native mobile camera capture trigger via `capture="environment"`.

To package with Capacitor:
```bash
npm install @capacitor/core @capacitor/cli
npx cap init Spiny3D com.dwijkansagara.spiny3d
npm run build
npx cap add ios
npx cap add android
```

---

## Security & Privacy Baseline

- **Zero Unauthenticated Server Retention**: No raster files or generated 3D meshes are stored permanently on server disks for unauthenticated users.
- **Client-Side Magic Byte Screening**: File extensions alone are never trusted; raw binary headers are verified prior to buffer allocation.
- **Local Storage Disclosure**: Only functional settings (`spiny3d_lighting_preset`, `spiny3d_wireframe_pref`, `spiny3d_autospin_pref`) are stored locally.
- **No Third-Party Analytics**: Zero behavioral trackers or ad network scripts.

---

## Verified Limitations

1. **Hardware Acceleration**: Smooth 60fps WebGL rendering requires hardware-accelerated GPU support. Devices running software rasterizers may experience lower framerates.
2. **Watertightness for CNC**: Generated meshes are optimized for visual and real-time interactive rendering; they are not certified for industrial load-bearing manufacturing or subtractive milling without manual CAD inspection.
3. **Monocular Occlusion**: Single 2D images lack rear-facing depth data. The procedural generator constructs an organic volumetric backing based on surface normals.

---

## Developer Attribution & Contact

- **Developer**: Dwij Kansagara (He/Him)
- **Status**: 10th-standard student
- **Location**: Rajkot, Gujarat, India
- **Public Contact Email**: [work.dwijkansagara@gmail.com](mailto:work.dwijkansagara@gmail.com)
- **Identity & Mascot**: Original Spiny faceted 3D hedgehog mascot and the `d*` brand mark.

For security reports, vulnerability disclosures, or inquiries, please contact `work.dwijkansagara@gmail.com`.

---

## License

This software is released under the [MIT License](LICENSE).
Open source dependencies:
- Three.js — MIT License
- @react-three/fiber & @react-three/drei — MIT License
- Lucide React — ISC License
- React — MIT License
- Tailwind CSS — MIT License
