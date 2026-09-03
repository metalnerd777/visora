import { formatBytes } from "../lib/image";export type ProcessingStatus =
  | { state: "idle" }
  | { state: "loading"; message?: string }
  | { state: "done"; originalSize: number; finalSize: number }
  | { state: "error"; message: string };

export function ImageProcessingIndicator({
  status,
}: {
  status?: ProcessingStatus;
}) {
  if (!status || status.state === "idle") return null;

  if (status.state === "loading") {
    return (
      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-[#A8A3B8]">
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-neutral-300 border-t-transparent dark:border-[#4A4468] dark:border-t-transparent" />
        <span>{status.message ?? "Optimizando imagen…"}</span>
      </div>
    );
  }

  if (status.state === "error") {
    return (
      <div className="text-xs text-red-500 dark:text-red-400">
        {status.message}
      </div>
    );
  }

  return (
    <div className="text-xs text-neutral-500 dark:text-[#A8A3B8]">
      Original: {formatBytes(status.originalSize)} → Final:{" "}
      {formatBytes(status.finalSize)}
    </div>
  );
}

export default ImageProcessingIndicator;
