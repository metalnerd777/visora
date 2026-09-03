import { useCallback, useState } from "react";

/**
 * Devuelve los props de drag & drop para un área que acepta archivos de imagen.
 * Soporta arrastrar desde el explorador (no requiere abrir una carpeta).
 */
export function useImageDrop(
  onFiles: (files: File[]) => void
): {
  isDragging: boolean;
  dragProps: {
    onDragEnter: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
} {
  const [isDragging, setIsDragging] = useState(false);

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget === e.target) setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer?.files ?? []).filter(
        (f) => f.type.startsWith("image/") || f.type === "image/svg+xml"
      );
      if (files.length > 0) onFiles(files);
    },
    [onFiles]
  );

  return {
    isDragging,
    dragProps: { onDragEnter, onDragOver, onDragLeave, onDrop },
  };
}
