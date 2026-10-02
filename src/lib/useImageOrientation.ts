import { useEffect, useState } from "react";

export type ImageOrientation = "landscape" | "portrait" | "square";

export function useImageOrientation(
  url: string | undefined,
): ImageOrientation | null {
  const [orientation, setOrientation] = useState<ImageOrientation | null>(null);

  useEffect(() => {
    if (!url) return;

    const img = new Image();

    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;

      setOrientation(w === h ? "square" : w > h ? "landscape" : "portrait");
    };

    img.src = url;
  }, [url]);

  return orientation;
}