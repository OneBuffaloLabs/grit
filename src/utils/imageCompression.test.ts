import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateScaledDimensions, compressImage } from '@/utils/imageCompression';

describe('calculateScaledDimensions', () => {
  it('does not upscale images already within maxDimension', () => {
    expect(calculateScaledDimensions(800, 600, 1080)).toEqual({ width: 800, height: 600 });
    expect(calculateScaledDimensions(1080, 1080, 1080)).toEqual({ width: 1080, height: 1080 });
  });

  it('scales landscape images proportionally to fit maxDimension', () => {
    expect(calculateScaledDimensions(4032, 3024, 1080)).toEqual({ width: 1080, height: 810 });
  });

  it('scales portrait images proportionally to fit maxDimension', () => {
    expect(calculateScaledDimensions(3024, 4032, 1080)).toEqual({ width: 810, height: 1080 });
  });

  it('throws on non-positive dimensions', () => {
    expect(() => calculateScaledDimensions(0, 100)).toThrow();
    expect(() => calculateScaledDimensions(100, -5)).toThrow();
    expect(() => calculateScaledDimensions(100, 100, 0)).toThrow();
  });
});

describe('compressImage', () => {
  const originalCreateImageBitmap = globalThis.createImageBitmap;
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.createImageBitmap = originalCreateImageBitmap;
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });

  it('rejects non-image files', async () => {
    const textFile = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    await expect(compressImage(textFile)).rejects.toThrow(
      'Unsupported file type. Please select an image.'
    );
  });

  it('downscales oversized image and exports as WebP at 0.8 quality', async () => {
    const closeMock = vi.fn();
    globalThis.createImageBitmap = vi.fn().mockResolvedValue({
      width: 4032,
      height: 3024,
      close: closeMock,
    } as unknown as ImageBitmap);

    const drawImageMock = vi.fn();
    const toBlobMock = vi.fn((callback: BlobCallback, type?: string) => {
      callback(new Blob([new Uint8Array(50_000)], { type: type ?? 'image/webp' }));
    });

    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: () => ({ drawImage: drawImageMock }),
          toBlob: toBlobMock,
        } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    });

    const rawFile = new File([new Uint8Array(4_000_000)], 'IMG_1234.HEIC', {
      type: 'image/heic',
    });

    const result = await compressImage(rawFile);

    expect(drawImageMock).toHaveBeenCalledWith(expect.anything(), 0, 0, 1080, 810);
    expect(toBlobMock).toHaveBeenCalledWith(expect.any(Function), 'image/webp', 0.8);
    expect(result.name).toBe('IMG_1234.webp');
    expect(result.type).toBe('image/webp');
    expect(result.size).toBe(50_000);
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it('falls back to image/jpeg when browser does not support image/webp encoding', async () => {
    globalThis.createImageBitmap = vi.fn().mockResolvedValue({
      width: 1000,
      height: 2000,
      close: vi.fn(),
    } as unknown as ImageBitmap);

    const toBlobMock = vi.fn((callback: BlobCallback, type?: string) => {
      // Simulate Safari returning image/png when image/webp is requested
      const returnedType = type === 'image/webp' ? 'image/png' : 'image/jpeg';
      callback(new Blob([new Uint8Array(80_000)], { type: returnedType }));
    });

    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: () => ({ drawImage: vi.fn() }),
          toBlob: toBlobMock,
        } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    });

    const rawFile = new File([new Uint8Array(2_000_000)], 'portrait.jpg', {
      type: 'image/jpeg',
    });

    const result = await compressImage(rawFile);

    expect(toBlobMock).toHaveBeenNthCalledWith(1, expect.any(Function), 'image/webp', 0.8);
    expect(toBlobMock).toHaveBeenNthCalledWith(2, expect.any(Function), 'image/jpeg', 0.8);
    expect(result.type).toBe('image/jpeg');
    expect(result.name).toBe('portrait.jpg');
  });

  it('steps down quality when output exceeds maxSizeBytes', async () => {
    globalThis.createImageBitmap = vi.fn().mockResolvedValue({
      width: 2000,
      height: 2000,
      close: vi.fn(),
    } as unknown as ImageBitmap);

    const toBlobMock = vi.fn((callback: BlobCallback, type?: string, quality?: number) => {
      const size = (quality ?? 0.8) > 0.65 ? 180_000 : 120_000;
      callback(new Blob([new Uint8Array(size)], { type: type ?? 'image/webp' }));
    });

    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: () => ({ drawImage: vi.fn() }),
          toBlob: toBlobMock,
        } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    });

    const rawFile = new File([new Uint8Array(5_000_000)], 'detailed.png', {
      type: 'image/png',
    });

    const result = await compressImage(rawFile, { maxSizeBytes: 150 * 1024 });

    expect(toBlobMock).toHaveBeenCalledWith(expect.any(Function), 'image/webp', 0.8);
    expect(toBlobMock).toHaveBeenCalledWith(expect.any(Function), 'image/webp', 0.7);
    expect(toBlobMock).toHaveBeenCalledWith(expect.any(Function), 'image/webp', 0.6);
    expect(result.size).toBe(120_000);
  });

  it('falls back to HTMLImageElement and revokes object URL when createImageBitmap is unavailable', async () => {
    // @ts-expect-error simulating environment without createImageBitmap
    globalThis.createImageBitmap = undefined;

    const revokeSpy = vi.fn();
    URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-image');
    URL.revokeObjectURL = revokeSpy;

    class MockImage {
      naturalWidth = 1200;
      naturalHeight = 900;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_value: string) {
        this.onload?.();
      }
    }
    vi.stubGlobal('Image', MockImage);

    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: () => ({ drawImage: vi.fn() }),
          toBlob: (cb: BlobCallback) => cb(new Blob([new Uint8Array(40_000)], { type: 'image/webp' })),
        } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    });

    const rawFile = new File([new Uint8Array(1_000_000)], 'fallback.jpg', {
      type: 'image/jpeg',
    });

    const result = await compressImage(rawFile);

    expect(result.type).toBe('image/webp');
    expect(revokeSpy).toHaveBeenCalledWith('blob:mock-image');
    vi.unstubAllGlobals();
  });
});
