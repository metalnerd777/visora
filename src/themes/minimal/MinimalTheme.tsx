import { useEffect, useState } from "react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";

import AppRouter from "../../router";

function MinimalTheme() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.localStorage.getItem("visora-theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);

    window.localStorage.setItem(
      "visora-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <div className="flex min-h-screen flex-col text-neutral-900 transition-colors dark:text-[#F5F3FF]">
      <ScrollToTop />

      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((current) => !current)}
      />

      <div className="flex-1">
        <AppRouter />
      </div>

      <Footer />
    </div>
  );
}

export default MinimalTheme;
