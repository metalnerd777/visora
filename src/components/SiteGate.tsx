function SiteGate({
  title = "Sitio en construcción",
  message = "Este portfolio aún no está publicado. Vuelve pronto.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-20 text-neutral-900 transition-colors dark:text-[#F5F3FF]">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-neutral-200 bg-white/70 text-2xl backdrop-blur-2xl dark:border-[#27243A]/70 dark:bg-[#161327]/70">
          ⚙
        </div>
        <h1 className="mt-6 text-3xl font-light tracking-tight">{title}</h1>
        <p className="mt-3 text-neutral-500 dark:text-[#A8A3B8]">{message}</p>
      </div>
    </main>
  );
}

export default SiteGate;