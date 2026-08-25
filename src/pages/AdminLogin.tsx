function AdminLoginPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6 py-20 text-neutral-900 transition-colors dark:text-[#F5F3FF]">
      <div className="w-full max-w-md rounded-3xl border border-neutral-200/70 bg-white/70 p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-2xl dark:border-[#27243A]/70 dark:bg-[#161327]/70">
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 dark:text-[#6F6A80]">
          Administrador
        </p>

        <h1 className="mt-3 text-3xl font-light tracking-tight">
          Iniciar sesión
        </h1>

        <form className="mt-8 flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="admin-email"
              className="text-sm text-neutral-600 dark:text-[#A8A3B8]"
            >
              Correo
            </label>

            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              placeholder="tu@correo.com"
              className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-[#7C6CFF] dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="admin-password"
              className="text-sm text-neutral-600 dark:text-[#A8A3B8]"
            >
              Contraseña
            </label>

            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-[#7C6CFF] dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-full bg-neutral-900 px-6 py-3 text-sm text-white transition-colors duration-300 hover:bg-[#7C6CFF] dark:bg-[#F5F3FF] dark:text-black dark:hover:bg-[#7C6CFF] dark:hover:text-white"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-relaxed text-neutral-400 dark:text-[#6F6A80]">
          El acceso se activará al conectar Supabase Authentication.
        </p>
      </div>
    </main>
  );
}

export default AdminLoginPage;
