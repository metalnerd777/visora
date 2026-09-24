import { useThemeShell } from "../lib/useThemeShell";

import ScrollToTop from "../components/ScrollToTop";
import CookieBanner from "../components/CookieBanner";
import SiteGate from "../components/SiteGate";

import AppRouter from "../router";

import type { ThemeDefinition } from "./types";

function ThemeShell({ theme }: { theme: ThemeDefinition }) {
  const { effectiveDark, publicLocked, onToggleDarkMode } =
    useThemeShell();

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