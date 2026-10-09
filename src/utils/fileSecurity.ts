/**
 * Client-Side Upload Security and Integrity Verification Pipeline
 * Enforces magic-byte verification, MIME type allowlists, and size limitations.
 */

export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB strict limit
export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface FileValidationResult {
  valid: boolean;
  sanitizedName: string;
  errorMessage?: string;
  detectedMime?: string;
}

/**
 * Checks file header magic bytes to verify genuine file type against spoofed extensions.
 */
export async function verifyMagicBytes(file: File): Promise<{ matches: boolean; detectedType?: string }> {
  try {
    const slice = file.slice(0, 16);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    if (bytes.length < 4) {
      return { matches: false };
    }

    // JPEG Signature: FF D8 FF
    if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
      return { matches: true, detectedType: 'image/jpeg' };
    }

    // PNG Signature: 89 50 4E 47 0D 0A 1A 0A
    if (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4E &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0D &&
      bytes[5] === 0x0A &&
      bytes[6] === 0x1A &&
      bytes[7] === 0x0A
    ) {
      return { matches: true, detectedType: 'image/png' };
    }

    // WebP Signature: RIFF .... WEBP
    // 0-3: 'RIFF' (0x52, 0x49, 0x46, 0x46)
    // 8-11: 'WEBP' (0x57, 0x45, 0x42, 0x50)
    if (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    ) {
      return { matches: true, detectedType: 'image/webp' };
    }

    return { matches: false };
  } catch {
    return { matches: false };
  }
}

/**
 * Sanitizes input file name: strips paths, non-alphanumeric chars, prevents traversal.
 */
export function sanitizeFileName(rawName: string): string {
  // Strip paths
  const base = rawName.split(/[/\\]/).pop() || 'uploaded-image';
  // Remove dangerous control characters or HTML tags
  const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, '_');
  // Truncate to reasonable length
  return cleaned.slice(0, 100);
}

/**
 * Full security validation pipeline for uploaded image files.
 */
export async function validateImageFile(file: File): Promise<FileValidationResult> {
  const sanitizedName = sanitizeFileName(file.name);

  // 1. File size check
  if (file.size <= 0) {
    return {
      valid: false,
      sanitizedName,
      errorMessage: 'The selected file is empty (0 bytes). Please upload a valid image.',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      sanitizedName,
      errorMessage: `File size (${sizeMb}MB) exceeds the maximum allowed limit of 15MB.`,
    };
  }

  // 2. Extension check
  const extMatch = sanitizedName.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch ? `.${extMatch[1].toLowerCase()}` : '';
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      sanitizedName,
      errorMessage: `Unsupported file extension (${ext || 'none'}). Only .jpg, .png, and .webp images are accepted.`,
    };
  }

  // 3. MIME type check
  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      sanitizedName,
      errorMessage: `Unsupported MIME type (${file.type}). Expected image/jpeg, image/png, or image/webp.`,
    };
  }

  // 4. Magic byte verification
  const magicResult = await verifyMagicBytes(file);
  if (!magicResult.matches) {
    return {
      valid: false,
      sanitizedName,
      errorMessage: 'File header integrity check failed. The file content does not match genuine JPEG, PNG, or WebP magic bytes.',
    };
  }

  return {
    valid: true,
    sanitizedName,
    detectedMime: magicResult.detectedType,
  };
}
