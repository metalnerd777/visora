import { useEffect, useRef } from "react";

import { FULL_CROP_RECT, type CropRect } from "../lib/cropRect";

const MIN = 0.06;

type DragMode =
  | "move"
  | "new"
  | "nw"
  | "ne"
  | "sw"
  | "se"
  | "n"
  | "s"
  | "e"
  | "w";

interface DragState {
  mode: DragMode;
  startX: number;
  startY: number;
  startRect: CropRect;
  moved: boolean;
}

const CURSORS: Record<DragMode, string> = {
  move: "move",
  new: "crosshair",
  nw: "nwse-resize",
  se: "nwse-resize",
  ne: "nesw-resize",
  sw: "nesw-resize",
  n: "ns-resize",
  s: "ns-resize",
  e: "ew-resize",
  w: "ew-resize",
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Ajusta el recorte a la proporción pedida, centrado en el recorte actual. */
function fitRect(
  naturalRatio: number,
  aspect: number | null,
  current: CropRect,
): CropRect {
  if (aspect === null) return current;

  const k = naturalRatio / aspect;
  const width = Math.min(1, 1 / k);
  const height = width * k;
  const centerX = current.x + current.width / 2;
  const centerY = current.y + current.height / 2;

  return {
    x: clamp(centerX - width / 2, 0, 1 - width),
    y: clamp(centerY - height / 2, 0, 1 - height),
    width,
    height,
  };
}

/** Rectángulo con proporción fija anclado en una esquina. */
function cornerRect(
  anchorX: number,
  anchorY: number,
  pointerX: number,
  pointerY: number,
  k: number,
): CropRect {
  const signX = pointerX >= anchorX ? 1 : -1;
  const signY = pointerY >= anchorY ? 1 : -1;

  const maxWidthX = signX > 0 ? 1 - anchorX : anchorX;
  const maxHeightY = signY > 0 ? 1 - anchorY : anchorY;
  const maxWidth = Math.min(maxWidthX, maxHeightY / k);

  let width = Math.max(
    Math.abs(pointerX - anchorX),
    Math.abs(pointerY - anchorY) / k,
  );

  width = Math.min(width, maxWidth);
  width = Math.max(width, Math.min(MIN, maxWidth));

  const height = width * k;

  return {
    x: signX > 0 ? anchorX : anchorX - width,
    y: signY > 0 ? anchorY : anchorY - height,
    width,
    height,
  };
}

function hitTest(
  x: number,
  y: number,
  rect: CropRect,
  tolX: number,
  tolY: number,
  lockRatio: boolean,
): DragMode {
  const inside =
    x >= rect.x &&
    x <= rect.x + rect.width &&
    y >= rect.y &&
    y <= rect.y + rect.height;

  if (!inside) return "new";

  const nearW = x - rect.x <= tolX;
  const nearE = rect.x + rect.width - x <= tolX;
  const nearN = y - rect.y <= tolY;
  const nearS = rect.y + rect.height - y <= tolY;

  if (nearN && nearW) return "nw";
  if (nearN && nearE) return "ne";
  if (nearS && nearW) return "sw";
  if (nearS && nearE) return "se";

  // Si el recorte ocupa toda la imagen, arrastrar dentro dibuja uno nuevo.
  const coversAll =
    rect.x < 0.01 &&
    rect.y < 0.01 &&
    rect.width > 0.98 &&
    rect.height > 0.98;

  if (coversAll) return "new";

  if (!lockRatio) {
    if (nearW) return "w";
    if (nearE) return "e";
    if (nearN) return "n";
    if (nearS) return "s";
  }

  return "move";
}

function resizeFree(
  mode: DragMode,
  pointerX: number,
  pointerY: number,
  rect: CropRect,
): CropRect {
  let { x, y, width, height } = rect;

  if (mode.includes("w")) {
    const nextX = clamp(pointerX, 0, x + width - MIN);
    width = x + width - nextX;
    x = nextX;
  } else if (mode.includes("e")) {
    width = clamp(pointerX - x, MIN, 1 - x);
  }

  if (mode.includes("n")) {
    const nextY = clamp(pointerY, 0, y + height - MIN);
    height = y + height - nextY;
    y = nextY;
  } else if (mode.includes("s")) {
    height = clamp(pointerY - y, MIN, 1 - y);
  }

  // Corrige redondeos del clamp para no salir del área.
  width = Math.min(width, 1 - x);
  height = Math.min(height, 1 - y);

  return { x, y, width, height };
}

function computeRect(
  drag: DragState,
  pointerX: number,
  pointerY: number,
  k: number | null,
): CropRect {
  if (drag.mode === "move") {
    return {
      x: clamp(
        drag.startRect.x + (pointerX - drag.startX),
        0,
        1 - drag.startRect.width,
      ),
      y: clamp(
        drag.startRect.y + (pointerY - drag.startY),
        0,
        1 - drag.startRect.height,
      ),
      width: drag.startRect.width,
      height: drag.startRect.height,
    };
  }

  if (k !== null) {
    if (drag.mode === "new") {
      return cornerRect(drag.startX, drag.startY, pointerX, pointerY, k);
    }

    const anchorX = drag.mode.includes("w")
      ? drag.startRect.x + drag.startRect.width
      : drag.startRect.x;
    const anchorY = drag.mode.includes("n")
      ? drag.startRect.y + drag.startRect.height
      : drag.startRect.y;

    return cornerRect(anchorX, anchorY, pointerX, pointerY, k);
  }

  if (drag.mode === "new") {
    const x0 = Math.min(drag.startX, pointerX);
    const x1 = Math.max(drag.startX, pointerX);
    const y0 = Math.min(drag.startY, pointerY);
    const y1 = Math.max(drag.startY, pointerY);

    const width = Math.max(MIN, x1 - x0);
    const height = Math.max(MIN, y1 - y0);

    return {
      x: clamp(x0, 0, 1 - width),
      y: clamp(y0, 0, 1 - height),
      width,
      height,
    };
  }

  return resizeFree(drag.mode, pointerX, pointerY, drag.startRect);
}

function ImageCropBox({
  src,
  aspect,
  rect,
  onChange,
}: {
  src: string;
  aspect: number | null;
  rect: CropRect;
  onChange: (rect: CropRect) => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const rectRef = useRef(rect);

  useEffect(() => {
    rectRef.current = rect;
  }, [rect]);

  // Ajusta el recorte al cargar la imagen o al cambiar la proporción: si es
  // libre se conserva el recorte actual, si es fija se encaja la proporción.
  useEffect(() => {
    const img = imgRef.current;

    if (!img) return;

    const apply = () => {
      if (!img.naturalWidth || !img.naturalHeight) return;

      const ratio = img.naturalWidth / img.naturalHeight;

      onChange(
        fitRect(
          ratio,
          aspect,
          aspect === null ? rectRef.current : FULL_CROP_RECT,
        ),
      );
    };

    if (img.complete && img.naturalWidth > 0) {
      apply();
      return;
    }

    img.addEventListener("load", apply);

    return () => img.removeEventListener("load", apply);
  }, [src, aspect, onChange]);

  const naturalRatio = () => {
    const img = imgRef.current;

    if (!img || !img.naturalWidth || !img.naturalHeight) return null;

    return img.naturalWidth / img.naturalHeight;
  };

  const getPoint = (event: React.PointerEvent<HTMLDivElement>) => {
    const img = imgRef.current;

    if (!img) return null;

    const bounds = img.getBoundingClientRect();

    if (bounds.width === 0 || bounds.height === 0) return null;

    return {
      x: clamp((event.clientX - bounds.left) / bounds.width, 0, 1),
      y: clamp((event.clientY - bounds.top) / bounds.height, 0, 1),
      tolX: 12 / bounds.width,
      tolY: 12 / bounds.height,
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const point = getPoint(event);

    if (!point) return;

    const mode = hitTest(
      point.x,
      point.y,
      rect,
      point.tolX,
      point.tolY,
      aspect !== null,
    );

    dragRef.current = {
      mode,
      startX: point.x,
      startY: point.y,
      startRect: rect,
      moved: false,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.style.cursor = CURSORS[mode];
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const point = getPoint(event);

    if (!point) return;

    const drag = dragRef.current;

    if (!drag) {
      const mode = hitTest(
        point.x,
        point.y,
        rect,
        point.tolX,
        point.tolY,
        aspect !== null,
      );

      event.currentTarget.style.cursor = CURSORS[mode];
      return;
    }

    const distance = Math.max(
      Math.abs(point.x - drag.startX),
      Math.abs(point.y - drag.startY),
    );

    if (!drag.moved && distance < 0.004) return;

    drag.moved = true;

    const ratio = naturalRatio();
    const k = aspect !== null && ratio !== null ? ratio / aspect : null;

    onChange(computeRect(drag, point.x, point.y, k));
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className="flex w-full justify-center">
      <div className="relative inline-block max-w-full overflow-hidden rounded-xl bg-neutral-950">
        <img
          ref={imgRef}
          src={src}
          alt=""
          draggable={false}
          className="block max-h-[420px] w-auto max-w-full select-none"
        />

        <div
          className="pointer-events-none absolute border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]"
          style={{
            left: `${rect.x * 100}%`,
            top: `${rect.y * 100}%`,
            width: `${rect.width * 100}%`,
            height: `${rect.height * 100}%`,
          }}
        >
          <div aria-hidden="true" className="absolute inset-0 opacity-50">
            <div className="absolute top-0 left-1/3 h-full w-px bg-white/60" />
            <div className="absolute top-0 left-2/3 h-full w-px bg-white/60" />
            <div className="absolute top-1/3 left-0 h-px w-full bg-white/60" />
            <div className="absolute top-2/3 left-0 h-px w-full bg-white/60" />
          </div>

          {[
            ["nw", "0%", "0%"],
            ["ne", "100%", "0%"],
            ["sw", "0%", "100%"],
            ["se", "100%", "100%"],
          ].map(([key, left, top]) => (
            <span
              key={key}
              aria-hidden="true"
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-black/30 bg-white shadow"
              style={{ left, top }}
            />
          ))}

          {aspect === null &&
            [
              ["n", "50%", "0%"],
              ["s", "50%", "100%"],
              ["w", "0%", "50%"],
              ["e", "100%", "50%"],
            ].map(([key, left, top]) => (
              <span
                key={key}
                aria-hidden="true"
                className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/30 bg-white shadow"
                style={{ left, top }}
              />
            ))}
        </div>

        <div
          role="application"
          aria-label="Área de recorte: arrastra para dibujar, mover o redimensionar el recorte"
          className="absolute inset-0 touch-none"
          style={{ cursor: "crosshair" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>
    </div>
  );
}

export default ImageCropBox;
