import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';

/**
 * Downloads a binary blob as a named file in the browser.
 */
function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * Exports a Three.js 3D Object to a binary standard .GLB file.
 */
export async function exportToGLB(object: THREE.Object3D, fileName: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const exporter = new GLTFExporter();
      exporter.parse(
        object,
        (gltf) => {
          if (gltf instanceof ArrayBuffer) {
            const blob = new Blob([gltf], { type: 'model/gltf-binary' });
            triggerFileDownload(blob, `${fileName}.glb`);
            resolve(true);
          } else {
            const jsonString = JSON.stringify(gltf, null, 2);
            const blob = new Blob([jsonString], { type: 'model/gltf+json' });
            triggerFileDownload(blob, `${fileName}.gltf`);
            resolve(true);
          }
        },
        (error) => {
          console.error('GLTF Export error:', error);
          reject(error);
        },
        { binary: true }
      );
    } catch (err) {
      console.error('GLTFExporter execution failure:', err);
      reject(err);
    }
  });
}

/**
 * Exports a Three.js 3D Object to a Wavefront .OBJ file.
 */
export async function exportToOBJ(object: THREE.Object3D, fileName: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const exporter = new OBJExporter();
      const result = exporter.parse(object);
      const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
      triggerFileDownload(blob, `${fileName}.obj`);
      resolve(true);
    } catch (err) {
      console.error('OBJExporter execution failure:', err);
      reject(err);
    }
  });
}

/**
 * Captures a high-resolution snapshot frame of the active WebGL canvas for turnaround review.
 */
export function captureCanvasSnapshot(canvasElement: HTMLCanvasElement | null, fileName: string): void {
  if (!canvasElement) {
    console.warn('Canvas element not available for turnaround capture.');
    return;
  }
  try {
    const dataUrl = canvasElement.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${fileName}-turnaround-frame.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Turnaround snapshot capture failed:', err);
  }
}

/**
 * Checks for WebXR / AR Quick Look compatibility on mobile or browser.
 */
export function checkARAvailability(): { supported: boolean; method: 'webxr' | 'quicklook' | 'scene-viewer' | 'none' } {
  if (typeof window === 'undefined') return { supported: false, method: 'none' };

  // iOS Safari USDZ Quick Look support
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
  if (isIOS) {
    const a = document.createElement('a');
    if (a.relList && a.relList.supports && a.relList.supports('ar')) {
      return { supported: true, method: 'quicklook' };
    }
  }

  // Android Scene Viewer
  const isAndroid = /android/i.test(navigator.userAgent);
  if (isAndroid) {
    return { supported: true, method: 'scene-viewer' };
  }

  // WebXR Device API
  if ('xr' in navigator && (navigator as unknown as { xr?: { isSessionSupported?: (mode: string) => Promise<boolean> } }).xr?.isSessionSupported) {
    return { supported: true, method: 'webxr' };
  }

  return { supported: false, method: 'none' };
}
