import { BrowserRouter } from "react-router-dom";

import { PortfolioProvider } from "./lib/PortfolioProvider";
import { usePortfolio } from "./lib/usePortfolio";
import { themeFor } from "./themes";
import ThemeShell from "./themes/ThemeShell";
import DocumentHead from "./components/DocumentHead";
import WelcomeScreen from "./components/WelcomeScreen";

function ThemeSwitcher() {
  const { settings } = usePortfolio();
  const theme = themeFor(settings.appearance.theme);

  return <ThemeShell theme={theme} />;
}

function AppContent() {
  const { initialized, initialize } = usePortfolio();

  if (!initialized) {
    return <WelcomeScreen onSelect={initialize} />;
  }

  return (
    <>
      <DocumentHead />
      <ThemeSwitcher />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <PortfolioProvider>
        <AppContent />
      </PortfolioProvider>
    </BrowserRouter>
  );
}

export default App;
