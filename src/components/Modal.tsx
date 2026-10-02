import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
  actions?: React.ReactNode;
}

function Modal({ open, onClose, title, children, wide, actions }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        className={`relative flex h-[90dvh] max-h-[90dvh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl dark:bg-[#161327] sm:rounded-2xl ${
          wide ? "w-full sm:max-w-5xl" : "w-full sm:max-w-lg"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-neutral-100 px-6 py-4 dark:border-[#27243A]">
          <h2 className="min-w-0 flex-1 truncate text-lg font-medium tracking-tight">
            {title}
          </h2>

          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-[#6F6A80] dark:hover:bg-white/5 dark:hover:text-[#F5F3FF]"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
