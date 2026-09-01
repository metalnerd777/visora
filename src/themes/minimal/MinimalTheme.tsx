import { useEffect, useState } from "react";

import { usePortfolio } from "../../lib/usePortfolio";
import { isAuthenticated } from "../../lib/auth";
import type { ThemeMode } from "../../types/portfolio";
import {
  BUTTON_RADIUS,
  RADIUS_SCALE,
  effectiveBase,
  fontOptionFor,
  loadGoogleFont,
} from "../../lib/appearance";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";
import CookieBanner from "../../components/CookieBanner";

import AppRouter from "../../router";

function SiteGate({
  title,
  message,
}: {
  title: string;
  message: string;
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

function MinimalTheme() {
  const { settings, setSettings } = usePortfolio();
  const [admin, setAdmin] = useState(isAuthenticated());

  // Override manual del visitante (toggle del header) solo en modo sistema.
  const [override, setOverride] = useState<boolean | null>(() => {
    const saved = window.localStorage.getItem("visora-theme");
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return null;
  });

  // Estado del sistema (prefers-color-scheme) para el modo "system".
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  const mode = settings.appearance.mode;
  const effectiveDark =
    mode === "dark"
      ? true
      : mode === "light"
        ? false
        : (override ?? systemDark);

  // Aplica el modo del tema al <html> (sin setState; se deriva en render).
  useEffect(() => {
    document.documentElement.classList.toggle("dark", effectiveDark);
    if (settings.appearance.mode === "system") {
      window.localStorage.setItem(
        "visora-theme",
        effectiveDark ? "dark" : "light",
      );
    }
  }, [effectiveDark, settings.appearance.mode]);

  // Modo "system": sigue al sistema operativo en tiempo real.
  useEffect(() => {
    if (settings.appearance.mode !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setSystemDark(media.matches);
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [settings.appearance.mode]);

  const primaryColor = settings.appearance.primaryColor;
  const bgColor1 = settings.appearance.background.color1;
  const bgColor2 = settings.appearance.background.color2;

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--visora-accent", primaryColor);

    // Fondo: base efectiva por luminosidad (claro contrasta en claro, oscuro
    // contrasta en oscuro) + color de acento del fondo para el degradado.
    root.style.setProperty("--visora-bg-light-1", effectiveBase(bgColor1, false));
    root.style.setProperty("--visora-bg-light-2", bgColor2);
    root.style.setProperty("--visora-bg-dark-1", effectiveBase(bgColor1, true));
    root.style.setProperty("--visora-bg-dark-2", bgColor2);
  }, [primaryColor, bgColor1, bgColor2]);

  useEffect(() => {
    const root = document.documentElement;

    const font = fontOptionFor(settings.appearance.fontFamily);
    root.style.setProperty("--visora-font", font.cssName);
    loadGoogleFont(font.family);

    root.style.setProperty(
      "--visora-radius-scale",
      String(RADIUS_SCALE[settings.appearance.borderRadius]),
    );

    root.style.setProperty(
      "--visora-btn-radius",
      BUTTON_RADIUS[settings.appearance.buttonStyle],
    );
  }, [
    settings.appearance.fontFamily,
    settings.appearance.borderRadius,
    settings.appearance.buttonStyle,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAdmin(isAuthenticated());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const publicLocked = !admin && settings.site.published === false;

  if (publicLocked) {
    return (
      <div className="flex min-h-screen flex-col text-neutral-900 transition-colors dark:text-[#F5F3FF]">
        <SiteGate
          title="Sitio en construcción"
          message="Este portfolio aún no está publicado. Vuelve pronto."
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col text-neutral-900 transition-colors dark:text-[#F5F3FF]">
      <ScrollToTop />

      <Header
        darkMode={effectiveDark}
        onToggleDarkMode={() => {
          if (settings.appearance.mode === "system") {
            setOverride((current) => !(current ?? systemDark));
          } else {
            const nextMode: ThemeMode =
              settings.appearance.mode === "dark" ? "light" : "dark";
            setSettings({
              ...settings,
              appearance: { ...settings.appearance, mode: nextMode },
            });
          }
        }}
      />

      <div className="flex-1">
        <AppRouter />
      </div>

      <Footer />
      <CookieBanner />
    </div>
  );
}

export default MinimalTheme;
