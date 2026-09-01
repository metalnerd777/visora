function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          checked
            ? "bg-(--visora-accent)"
            : "bg-neutral-300 dark:bg-[#4A4468]"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>

      <span className="text-xs text-neutral-500 dark:text-[#A8A3B8]">
        {label}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
    </label>
  );
}

export default Toggle;
