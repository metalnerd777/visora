function EditableSection({
  label,
  onEdit,
  children,
  addLabel,
  onAdd,
}: {
  label: string;
  onEdit: () => void;
  children: React.ReactNode;
  addLabel?: string;
  onAdd?: () => void;
}) {
  return (
    <div className="group/section relative">
      {children}

      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {addLabel && onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-white/80 px-3 py-1.5 text-xs font-medium text-green-600 shadow-lg backdrop-blur-md transition-colors hover:border-green-500 hover:bg-green-50 dark:bg-[#161327]/80 dark:text-green-400"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {addLabel}
          </button>
        )}

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-full border border-(--visora-accent)/30 bg-white/80 px-3 py-1.5 text-xs font-medium text-(--visora-accent) shadow-lg backdrop-blur-md transition-colors hover:border-(--visora-accent) hover:bg-(--visora-accent)/10 dark:bg-[#161327]/80"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          {label}
        </button>
      </div>
    </div>
  );
}

export default EditableSection;
