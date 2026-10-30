import { hasTransparency } from "./image";

export interface CroppedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Recorta una imagen usando las coordenadas devueltas por react-easy-crop y
 * devuelve un data URL con el tamaño final indicado. Conserva la transparencia
 * (WebP/PNG) cuando la imagen de origen la tiene.
 */
export async function cropImage(
  imageSrc: string,
  pixelCrop: CroppedArea,
  outputSize: { width: number; height: number },
): Promise<string> {  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = outputSize.width;
  canvas.height = outputSize.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas no disponible");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize.width,
    outputSize.height,
  );

  if (await hasTransparency(imageSrc)) {
    const webp = canvas.toDataURL("image/webp", 0.92);

    if (webp.startsWith("data:image/webp")) return webp;

    return canvas.toDataURL("image/png");
  }

  return canvas.toDataURL("image/jpeg", 0.9);
}

/** Dimensiones naturales de una imagen. */
export async function imageSize(
  src: string,
): Promise<{ width: number; height: number }> {
  const image = await loadImage(src);

  return { width: image.naturalWidth, height: image.naturalHeight };
}

