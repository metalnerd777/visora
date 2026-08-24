import { useEffect, useState } from "react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";

import AppRouter from "../../router";

function MinimalTheme() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 transition-colors duration-300 dark:bg-[#0B0A14] dark:text-[#F5F3FF]">
      <ScrollToTop />

      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((current) => !current)}
      />

      <AppRouter />

      <Footer />
    </div>
  );
}

export default MinimalTheme;
