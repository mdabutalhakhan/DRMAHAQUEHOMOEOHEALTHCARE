/**
 * Client-Side Image Compression Utility
 * Resizes and converts images to WebP format with controlled quality
 * ensuring small file sizes (<150-200 KB) while preserving clinical readability.
 */

export interface CompressedImageResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
  fileName: string;
}

/**
 * Compresses an image file client-side using an HTML5 Canvas.
 * - Maximum dimension (width/height): 1280px (aspect-ratio preserved).
 * - Format: image/webp with 0.75 quality (or jpeg fallback if webp is not supported).
 * - Generates clean filename: presc_${patientId}_${Date.now()}.webp
 */
export async function compressImageToWebP(
  file: File,
  patientId: string = 'PAT',
  maxDimension = 1280,
  quality = 0.75
): Promise<CompressedImageResult> {
  return new Promise((resolve, reject) => {
    // Basic file type validation
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        return reject(new Error('Empty image file.'));
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Could not parse image for compression.'));

      img.onload = () => {
        let { naturalWidth: width, naturalHeight: height } = img;
        if (!width || !height) {
          width = img.width || 1280;
          height = img.height || 1280;
        }

        // Calculate aspect-ratio preserved dimensions constrained by maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        // Create in-memory canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Unable to create canvas 2D context.'));
        }

        // Clean white background behind transparent PNGs to prevent black background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // High-quality bicubic interpolation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Sanitize patient ID for clean filename
        const cleanPatientId = String(patientId || 'PAT')
          .replace(/[^a-zA-Z0-9_-]/g, '')
          .slice(0, 24);
        const fileName = `presc_${cleanPatientId}_${Date.now()}.webp`;

        // Attempt WebP conversion
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              // Fallback to JPEG 0.75 if WebP conversion fails on older browser
              canvas.toBlob(
                (jpegBlob) => {
                  if (!jpegBlob) {
                    return reject(new Error('Failed to create compressed image blob.'));
                  }
                  const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
                  resolve({
                    blob: jpegBlob,
                    dataUrl: jpegDataUrl,
                    width,
                    height,
                    originalSize: file.size,
                    compressedSize: jpegBlob.size,
                    fileName: fileName.replace(/\.webp$/, '.jpg'),
                  });
                },
                'image/jpeg',
                quality
              );
              return;
            }

            const dataUrl = canvas.toDataURL('image/webp', quality);
            resolve({
              blob,
              dataUrl,
              width,
              height,
              originalSize: file.size,
              compressedSize: blob.size,
              fileName,
            });
          },
          'image/webp',
          quality
        );
      };

      img.src = src;
    };

    reader.readAsDataURL(file);
  });
}
