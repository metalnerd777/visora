import { useEffect } from "react";
import { useThemeShell } from "../lib/useThemeShell";
import { usePortfolio } from "../lib/usePortfolio";

import ScrollToTop from "../components/ScrollToTop";
import CookieBanner from "../components/CookieBanner";
import SiteGate from "../components/SiteGate";

import AppRouter from "../router";

import type { ThemeDefinition } from "./types";

function ThemeShell({ theme }: { theme: ThemeDefinition }) {
  const { effectiveDark, publicLocked, onToggleDarkMode } =
    useThemeShell();
  const { settings } = usePortfolio();

  useEffect(() => {
    if (!settings.privacy.protectImages) return;

    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "IMG" ||
          target.closest("img") ||
          target.classList.contains("zoom-frame"))
      ) {
        e.preventDefault();
      }
    };

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "IMG" || target.closest("img"))) {
        e.preventDefault();
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("dragstart", handleDragStart);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("dragstart", handleDragStart);
    };
  }, [settings.privacy.protectImages]);

  const Header = theme.Header;
  const Footer = theme.Footer;

  if (publicLocked) {
    return (
      <div className="flex min-h-screen flex-col text-neutral-900 transition-colors dark:text-[#F5F3FF]">
        <SiteGate />
      </div>
    );
  }

  return (
    <div
      data-theme={theme.id}
      className="flex min-h-screen flex-col text-neutral-900 transition-colors dark:text-[#F5F3FF]"
    >
      <ScrollToTop />

      <Header
        darkMode={effectiveDark}
        onToggleDarkMode={onToggleDarkMode}
      />

      <div className="flex-1">
        <AppRouter pages={theme.pages} />
      </div>

      <Footer />
      <CookieBanner />
    </div>
  );
}

export default ThemeShell;