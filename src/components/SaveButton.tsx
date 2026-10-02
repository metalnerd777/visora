function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 whitespace-nowrap rounded-[var(--visora-btn-radius)] bg-neutral-900 px-5 py-2.5 text-sm text-white transition-colors hover:bg-(--visora-accent) dark:bg-[#F5F3FF] dark:text-black dark:hover:bg-(--visora-accent) dark:hover:text-white"
    >
      Guardar
    </button>
  );
}

export default SaveButton;