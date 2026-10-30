/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
  code?: 'INVALID_TYPE' | 'TOO_LARGE' | 'TOO_SMALL' | 'UNREADABLE' | 'SYSTEM_ERROR';
  dimensions?: { width: number; height: number };
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MIN_FILE_SIZE = 200; // 200 bytes

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml'
]);

/**
 * Validates a leaf photo for file type, file size, and actual image readability.
 * Ensures zero object URL memory leaks via try/finally guarantee.
 */
export async function validateLeafImage(file: File): Promise<ValidationResult> {
  // 1. Check file existence
  if (!file) {
    return { valid: false, error: 'No file selected. Please choose a leaf image.', code: 'INVALID_TYPE' };
  }

  // 2. Validate MIME type & extension
  const mime = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  const hasValidExt =
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg') ||
    name.endsWith('.png') ||
    name.endsWith('.webp') ||
    name.endsWith('.svg');

  if (!ALLOWED_MIME_TYPES.has(mime) && !hasValidExt) {
    return {
      valid: false,
      error: `Unsupported format "${file.type || 'unknown'}". Please select a JPEG, PNG, or WebP photo.`,
      code: 'INVALID_TYPE'
    };
  }

  // 3. Validate size limits
  if (file.size > MAX_FILE_SIZE) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size is ${sizeMb} MB. Please select an image under 10 MB.`,
      code: 'TOO_LARGE'
    };
  }

  if (file.size < MIN_FILE_SIZE) {
    return {
      valid: false,
      error: 'File is too small to contain readable leaf visual data. Please select a valid photo.',
      code: 'TOO_SMALL'
    };
  }

  // 4. Validate image readability (ensuring it's not a corrupted file or renamed binary)
  let objectUrl: string | null = null;
  try {
    objectUrl = URL.createObjectURL(file);
    const targetUrl = objectUrl;

    const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        reject(new Error('Corrupted or unreadable image file.'));
      };
      img.src = targetUrl;
    });

    if (dimensions.width < 30 || dimensions.height < 30) {
      return {
        valid: false,
        error: 'Image dimensions are too tiny for leaf inspection. Please upload a clear leaf photo.',
        code: 'UNREADABLE'
      };
    }

    return { valid: true, dimensions };
  } catch (err: any) {
    return {
      valid: false,
      error: 'Unable to decode this image. The file may be damaged, corrupted, or in an unreadable format.',
      code: 'UNREADABLE'
    };
  } finally {
    // Guaranteed cleanup regardless of onload or onerror
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  }
}

/**
 * Converts a File to Base64 string safely
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      resolve(res);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
