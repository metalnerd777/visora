import { useCallback, useState } from "react";

import type { Photo } from "../types/portfolio";

export function usePhotoViewer(photos: Photo[]) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const openViewer = useCallback(
    (photoId: string) => {
      const index = photos.findIndex((photo) => photo.id === photoId);

      if (index !== -1) {
        setViewerIndex(index);
      }
    },
    [photos],
  );

  const closeViewer = useCallback(() => setViewerIndex(null), []);

  const showPrevious = useCallback(() => {
    setViewerIndex((current) => {
      if (current === null || current <= 0) return current;

      return current - 1;
    });
  }, []);

  const showNext = useCallback(() => {
    setViewerIndex((current) => {
      if (current === null || current >= photos.length - 1) return current;

      return current + 1;
    });
  }, [photos.length]);

  return { viewerIndex, openViewer, closeViewer, showPrevious, showNext };
}