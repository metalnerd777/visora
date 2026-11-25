import { useState } from "react";

import type { InitMode, InitialSetupData } from "../lib/initializePortfolio";
import type { ThemeId, ThemeMode } from "../types/portfolio";

const ACCENT_COLORS = [
  { name: "Índigo", value: "#6366F1" },
  { name: "Violeta", value: "#8B5CF6" },
  { name: "Esmeralda", value: "#10B981" },
  { name: "Ámbar", value: "#F59E0B" },
  { name: "Rosa", value: "#EC4899" },
  { name: "Neutro Carbón", value: "#262626" },
];

function WelcomeScreen({
  onSelect,
}: {
  onSelect: (mode: InitMode, setupData?: InitialSetupData) => void;
}) {
  const [selected, setSelected] = useState<InitMode | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form state del wizard
  const [brandName, setBrandName] = useState("");
  const [profession, setProfession] = useState("");
  const [location, setLocation] = useState("");
  const [theme, setTheme] = useState<ThemeId>("minimal");
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [primaryColor, setPrimaryColor] = useState("#6366F1");
  const [email, setEmail] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("");

  const chooseDemo = () => {
    if (selected) return;
    setSelected("demo");
    onSelect("demo");
  };

  const chooseEmptyDirect = () => {
    if (selected) return;
    setSelected("empty");
    onSelect("empty");
  };

  const handleFinishWizard = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) return;
    setSelected("empty");
    onSelect("empty", {
      brandName: brandName.trim() || "Mi portafolio",
      profession: profession.trim() || "Creativo visual",
      location: location.trim(),
      theme,
      mode,
      primaryColor,
      email: email.trim(),
      whatsappPhone: whatsappPhone.trim(),
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16 text-neutral-900 transition-colors dark:text-[#F5F3FF]">
      <div className="w-full max-w-4xl">
        <header className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-(--visora-accent)/25 bg-white/70 text-lg font-medium tracking-tight text-(--visora-accent) shadow-[0_12px_40px_rgba(0,0,0,0.06)] backdrop-blur-2xl dark:bg-[#161327]/70">
            V
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.35em] text-neutral-400 dark:text-[#6F6A80]">
            Visora
          </p>

          <h1 className="mt-3 text-4xl font-light tracking-tight sm:text-5xl">
            {showWizard
              ? "Configuración inicial de tu portafolio"
              : "Elige cómo quieres empezar"}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-neutral-500 dark:text-[#A8A3B8] sm:text-base">
            {showWizard
              ? "Completa los datos esenciales para personalizar tu portafolio. Podrás modificar cualquier ajuste más adelante."
              : "Puedes explorar un portfolio de ejemplo o configurar el tuyo desde cero. Todo el contenido es administrable."}
          </p>
        </header>

        {!showWizard ? (
          <>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <button
                type="button"
                onClick={chooseDemo}
                disabled={selected !== null}
                className="group flex h-full flex-col items-start rounded-3xl border border-neutral-200/70 bg-white/70 p-8 text-left shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-(--visora-accent)/40 hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)] disabled:pointer-events-none disabled:opacity-60 dark:border-[#27243A]/70 dark:bg-[#161327]/70"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-(--visora-accent)/25 bg-(--visora-accent)/10 text-(--visora-accent)">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="m10 8 5 4-5 4V8Z" />
                  </svg>
                </span>

                <span className="mt-6 text-xl font-light tracking-tight">
                  Explorar la demo
                </span>

                <span className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
                  Prueba Visora con el portfolio de ejemplo de Alex Morgan:
                  proyectos, publicaciones y fotografías listos para explorar.
                </span>

                <span className="mt-auto pt-6 text-xs uppercase tracking-[0.2em] text-(--visora-accent)">
                  Cargar contenido de ejemplo →
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowWizard(true)}
                disabled={selected !== null}
                className="group flex h-full flex-col items-start rounded-3xl border border-(--visora-accent)/30 bg-white/70 p-8 text-left shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-(--visora-accent) hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)] disabled:pointer-events-none disabled:opacity-60 dark:border-(--visora-accent)/40 dark:bg-[#161327]/70"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-(--visora-accent)/30 bg-(--visora-accent)/10 text-(--visora-accent)">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </span>

                <span className="mt-6 text-xl font-light tracking-tight">
                  Configurar mi portafolio
                </span>

                <span className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
                  Asistente guiado para configurar tu nombre, profesión, estilo visual
                  y vías de contacto para empezar tu web lista para publicar.
                </span>

                <span className="mt-auto pt-6 text-xs uppercase tracking-[0.2em] text-(--visora-accent)">
                  Iniciar asistente de configuración →
                </span>
              </button>
            </div>

            <p className="mt-8 text-center text-xs leading-relaxed text-neutral-400 dark:text-[#6F6A80]">
              Tu elección se guarda en este navegador. Si ya tienes datos guardados,
              no se modificarán.
            </p>
          </>
        ) : (
          <form
            onSubmit={handleFinishWizard}
            className="mt-10 overflow-hidden rounded-3xl border border-neutral-200/70 bg-white/70 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.06)] backdrop-blur-2xl transition-colors dark:border-[#27243A]/70 dark:bg-[#161327]/70 sm:p-10"
          >
            {/* Indicador de pasos */}
            <div className="mb-8 flex items-center justify-between border-b border-neutral-200/60 pb-6 dark:border-[#27243A]/60">
              <div className="flex items-center gap-3">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStep(s as 1 | 2 | 3)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all ${
                      step === s
                        ? "bg-(--visora-accent) text-white shadow-md shadow-(--visora-accent)/25"
                        : "border border-neutral-200 bg-neutral-100 text-neutral-600 dark:border-[#27243A] dark:bg-white/5 dark:text-[#A8A3B8]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
                <span className="ml-2 text-xs uppercase tracking-wider text-neutral-400 dark:text-[#6F6A80]">
                  {step === 1 && "Paso 1: Identidad"}
                  {step === 2 && "Paso 2: Estilo Visual"}
                  {step === 3 && "Paso 3: Contacto"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowWizard(false)}
                className="text-xs text-neutral-400 hover:text-neutral-700 dark:text-[#6F6A80] dark:hover:text-white"
              >
                Volver
              </button>
            </div>

            {/* Paso 1: Identidad */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 dark:text-[#6F6A80]">
                    Nombre o Marca
                  </label>
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Ej. Sofía Herrera, Estudio Prisma"
                    className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white/60 px-4 py-3.5 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-(--visora-accent) focus:ring-2 focus:ring-(--visora-accent)/15 dark:border-[#27243A] dark:bg-white/5 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 dark:text-[#6F6A80]">
                    Profesión / Especialidad
                  </label>
                  <input
                    type="text"
                    required
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="Ej. Fotografía Editorial, Dirección de Arte, Ilustración"
                    className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white/60 px-4 py-3.5 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-(--visora-accent) focus:ring-2 focus:ring-(--visora-accent)/15 dark:border-[#27243A] dark:bg-white/5 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 dark:text-[#6F6A80]">
                    Ciudad y País (opcional)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej. Santiago, Chile — Disponible globalmente"
                    className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white/60 px-4 py-3.5 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-(--visora-accent) focus:ring-2 focus:ring-(--visora-accent)/15 dark:border-[#27243A] dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Paso 2: Estilo Visual */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 dark:text-[#6F6A80]">
                    Tema de presentación
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setTheme("minimal")}
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        theme === "minimal"
                          ? "border-(--visora-accent) bg-(--visora-accent)/10 shadow-sm"
                          : "border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100/50 dark:border-[#27243A] dark:bg-white/5"
                      }`}
                    >
                      <span className="block text-sm font-medium">Minimal</span>
                      <span className="mt-1 block text-xs text-neutral-400 dark:text-[#6F6A80]">
                        Limpio, ágil, tipografía sans contemporánea.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme("editorial")}
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        theme === "editorial"
                          ? "border-(--visora-accent) bg-(--visora-accent)/10 shadow-sm"
                          : "border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100/50 dark:border-[#27243A] dark:bg-white/5"
                      }`}
                    >
                      <span className="block text-sm font-medium">Editorial</span>
                      <span className="mt-1 block text-xs text-neutral-400 dark:text-[#6F6A80]">
                        Sofisticado, portada de gran formato y serif de revista.
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 dark:text-[#6F6A80]">
                    Modo de color inicial
                  </label>
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    {(
                      [
                        { id: "dark", label: "Oscuro" },
                        { id: "light", label: "Claro" },
                        { id: "system", label: "Automático" },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMode(m.id)}
                        className={`rounded-2xl border py-3 text-center text-xs font-medium transition-all ${
                          mode === m.id
                            ? "border-(--visora-accent) bg-(--visora-accent)/10 text-(--visora-accent)"
                            : "border-neutral-200 bg-neutral-50/50 text-neutral-600 dark:border-[#27243A] dark:bg-white/5 dark:text-[#A8A3B8]"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 dark:text-[#6F6A80]">
                    Color de acento
                  </label>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {ACCENT_COLORS.map((col) => (
                      <button
                        key={col.value}
                        type="button"
                        onClick={() => setPrimaryColor(col.value)}
                        className={`group flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all ${
                          primaryColor === col.value
                            ? "border-(--visora-accent) bg-neutral-900/5 dark:bg-white/10"
                            : "border-neutral-200 dark:border-[#27243A]"
                        }`}
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full shadow-inner"
                          style={{ backgroundColor: col.value }}
                        />
                        <span>{col.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Paso 3: Contacto */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 dark:text-[#6F6A80]">
                    Correo de contacto para clientes
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contacto@tuestudio.com"
                    className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white/60 px-4 py-3.5 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-(--visora-accent) focus:ring-2 focus:ring-(--visora-accent)/15 dark:border-[#27243A] dark:bg-white/5 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-neutral-400 dark:text-[#6F6A80]">
                    Donde los visitantes enviarán sus solicitudes de trabajo.
                  </p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 dark:text-[#6F6A80]">
                    WhatsApp internacional (opcional)
                  </label>
                  <input
                    type="tel"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="Ej. +56 9 1234 5678 o 56912345678"
                    className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white/60 px-4 py-3.5 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-(--visora-accent) focus:ring-2 focus:ring-(--visora-accent)/15 dark:border-[#27243A] dark:bg-white/5 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-neutral-400 dark:text-[#6F6A80]">
                    Habilita el botón de contacto directo por chat.
                  </p>
                </div>
              </div>
            )}

            {/* Botones de navegación del Wizard */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <button
                  type="button"
                  onClick={chooseEmptyDirect}
                  className="text-xs text-neutral-400 transition-colors hover:text-neutral-600 dark:text-[#6F6A80] dark:hover:text-[#A8A3B8]"
                >
                  Saltar asistente y empezar en blanco
                </button>
              </div>

              <div className="flex items-center gap-3">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                    className="rounded-2xl border border-neutral-200 px-5 py-2.5 text-sm transition-colors hover:bg-neutral-100 dark:border-[#27243A] dark:hover:bg-white/5"
                  >
                    Anterior
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                    className="rounded-2xl bg-(--visora-accent) px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-(--visora-accent)/20 transition-all hover:opacity-95"
                  >
                    Siguiente paso →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="rounded-2xl bg-(--visora-accent) px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-(--visora-accent)/25 transition-all hover:opacity-95"
                  >
                    Finalizar y ver mi portafolio ✨
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default WelcomeScreen;
