/**
 * Client-side canvas image compression utilities for progress photos.
 * Downscales large smartphone photos and exports compact WebP/JPEG files
 * to prevent IndexedDB bloat and browser storage quota exhaustion.
 */

export interface CompressImageOptions {
  /** Maximum width or height in pixels. Defaults to 1080. */
  maxDimension?: number;
  /** Initial export quality between 0 and 1. Defaults to 0.8. */
  quality?: number;
  /** Target maximum output size in bytes. Defaults to 150KB (153600 bytes). */
  maxSizeBytes?: number;
  /** Preferred output MIME type. Falls back to image/jpeg if unsupported. */
  preferredMimeType?: 'image/webp' | 'image/jpeg';
}

const DEFAULT_MAX_DIMENSION = 1080;
const DEFAULT_QUALITY = 0.8;
const DEFAULT_MAX_SIZE_BYTES = 150 * 1024;
const MIN_QUALITY = 0.5;
const QUALITY_STEP = 0.1;

interface ImageSourceResult {
  source: CanvasImageSource;
  width: number;
  height: number;
  cleanup: () => void;
}

/**
 * Computes proportional target dimensions that fit within maxDimension
 * without upscaling smaller images.
 */
export function calculateScaledDimensions(
  width: number,
  height: number,
  maxDimension: number = DEFAULT_MAX_DIMENSION
): { width: number; height: number } {
  if (width <= 0 || height <= 0) {
    throw new Error('Image dimensions must be positive numbers.');
  }
  if (maxDimension <= 0) {
    throw new Error('maxDimension must be a positive number.');
  }

  if (width <= maxDimension && height <= maxDimension) {
    return { width, height };
  }

  const scale = Math.min(maxDimension / width, maxDimension / height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/**
 * Decodes an image Blob using createImageBitmap when available (which
 * natively applies EXIF orientation), falling back to HTMLImageElement.
 */
async function loadImageSource(file: Blob): Promise<ImageSourceResult> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file);
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        cleanup: () => {
          if (typeof bitmap.close === 'function') {
            bitmap.close();
          }
        },
      };
    } catch {
      // Fall through to HTMLImageElement if createImageBitmap fails
    }
  }

  return new Promise<ImageSourceResult>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      resolve({
        source: img,
        width,
        height,
        cleanup: () => URL.revokeObjectURL(objectUrl),
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to decode image file.'));
    };

    img.src = objectUrl;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });
}

function buildQualitySteps(initialQuality: number): number[] {
  const clamped = Math.min(1, Math.max(MIN_QUALITY, initialQuality));
  const steps: number[] = [clamped];
  let current = Number((clamped - QUALITY_STEP).toFixed(2));
  while (current >= MIN_QUALITY) {
    steps.push(current);
    current = Number((current - QUALITY_STEP).toFixed(2));
  }
  return steps;
}

async function encodeWithTargetSize(
  canvas: HTMLCanvasElement,
  preferredMimeType: 'image/webp' | 'image/jpeg',
  initialQuality: number,
  maxSizeBytes: number
): Promise<Blob> {
  const qualitySteps = buildQualitySteps(initialQuality);
  const mimeCandidates: Array<'image/webp' | 'image/jpeg'> =
    preferredMimeType === 'image/webp' ? ['image/webp', 'image/jpeg'] : ['image/jpeg'];

  let smallestBlob: Blob | null = null;

  for (const mimeType of mimeCandidates) {
    for (const q of qualitySteps) {
      const blob = await canvasToBlob(canvas, mimeType, q);
      if (!blob || blob.type !== mimeType) {
        // Browser does not support this MIME type (e.g. older Safari falling back to PNG)
        break;
      }

      if (!smallestBlob || blob.size < smallestBlob.size) {
        smallestBlob = blob;
      }

      if (blob.size <= maxSizeBytes) {
        return blob;
      }
    }

    if (smallestBlob && smallestBlob.type === mimeType) {
      return smallestBlob;
    }
  }

  if (smallestBlob) {
    return smallestBlob;
  }

  throw new Error('Failed to encode compressed image.');
}

function replaceFileExtension(fileName: string, mimeType: string): string {
  const ext = mimeType === 'image/webp' ? 'webp' : 'jpg';
  const baseName = fileName.replace(/\.[^/.]+$/, '') || 'photo';
  return `${baseName}.${ext}`;
}

/**
 * Compresses an image File on an offscreen HTML5 canvas, downscaling to fit
 * within maxDimension while preserving aspect ratio and EXIF orientation.
 */
export async function compressImage(
  file: File,
  options: CompressImageOptions = {}
): Promise<File> {
  if (file.type && !file.type.startsWith('image/')) {
    throw new Error('Unsupported file type. Please select an image.');
  }

  const maxDimension = options.maxDimension ?? DEFAULT_MAX_DIMENSION;
  const quality = options.quality ?? DEFAULT_QUALITY;
  const maxSizeBytes = options.maxSizeBytes ?? DEFAULT_MAX_SIZE_BYTES;
  const preferredMimeType = options.preferredMimeType ?? 'image/webp';

  const { source, width, height, cleanup } = await loadImageSource(file);

  try {
    const target = calculateScaledDimensions(width, height, maxDimension);
    const canvas = document.createElement('canvas');
    canvas.width = target.width;
    canvas.height = target.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context is unavailable.');
    }

    ctx.drawImage(source, 0, 0, target.width, target.height);

    const compressedBlob = await encodeWithTargetSize(
      canvas,
      preferredMimeType,
      quality,
      maxSizeBytes
    );

    const outputName = replaceFileExtension(file.name, compressedBlob.type);
    return new File([compressedBlob], outputName, {
      type: compressedBlob.type,
      lastModified: Date.now(),
    });
  } finally {
    cleanup();
  }
}
