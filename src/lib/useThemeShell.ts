import { useEffect, useState } from "react";

import { usePortfolio } from "./usePortfolio";
import { useAdmin } from "./useAdmin";
import type {
  ThemeMode,
  ThemeId,
} from "../types/portfolio";
import {
  BUTTON_RADIUS,
  RADIUS_SCALE,
  effectiveBase,
  fontOptionFor,
  loadGoogleFont,
} from "./appearance";

export interface ThemeShell {
  theme: ThemeId;
  effectiveDark: boolean;
  admin: boolean;
  publicLocked: boolean;
  onToggleDarkMode: () => void;
}

// Lógica compartida por todos los temas: dark mode (override + sistema en
// tiempo real), CSS vars de apariencia sobre <html>, polling de admin y
// gate de publicación. Cada tema compone su propio shell visual.
export function useThemeShell(): ThemeShell {
  const { settings, setSettings } = usePortfolio();
  const admin = useAdmin();

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
  }, [effectiveDark]);

  // Solo se persiste el override MANUAL del visitante en modo "system".
  // (Antes se guardaba también el valor automático del sistema, y al recargar
  // se congelaba la preferencia del SO: el modo "system" dejaba de seguirlo.)
  useEffect(() => {
    if (settings.appearance.mode !== "system" || override === null) {
      window.localStorage.removeItem("visora-theme");
      return;
    }

    window.localStorage.setItem("visora-theme", override ? "dark" : "light");
  }, [settings.appearance.mode, override]);

  // Establece el tema de diseño activo sobre <html> para el CSS global (background, tipografía).
  useEffect(() => {
    document.documentElement.dataset.theme = settings.appearance.theme;

    // El tema editorial usa un display serif; se carga junto con la fuente de cuerpo.
    if (settings.appearance.theme === "editorial") {
      loadGoogleFont("Playfair Display");
    }
  }, [settings.appearance.theme]);

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

  // Apariencia: acento + fondo efectivo (claro/oscuro contrastados) por luminosidad.
  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--visora-accent", primaryColor);

    root.style.setProperty("--visora-bg-light-1", effectiveBase(bgColor1, false));
    root.style.setProperty("--visora-bg-light-2", bgColor2);
    root.style.setProperty("--visora-bg-dark-1", effectiveBase(bgColor1, true));
    root.style.setProperty("--visora-bg-dark-2", bgColor2);
  }, [primaryColor, bgColor1, bgColor2]);

  // Apariencia: tipografía (Google Fonts) + radio global + estilo de botones.
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

  const publicLocked = !admin && settings.site.published === false;

  const onToggleDarkMode = () => {
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
  };

  return { theme: settings.appearance.theme, effectiveDark, admin, publicLocked, onToggleDarkMode };
}