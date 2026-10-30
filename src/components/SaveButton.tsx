function SaveButton({
  onClick,
  disabled = false,
  label = "Guardar",
}: {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 whitespace-nowrap rounded-[var(--visora-btn-radius)] bg-neutral-900 px-5 py-2.5 text-sm text-white transition-colors hover:bg-(--visora-accent) disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#F5F3FF] dark:text-black dark:hover:bg-(--visora-accent) dark:hover:text-white"
    >
      {label}
    </button>
  );
}

export default SaveButton;
