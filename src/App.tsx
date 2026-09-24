import { BrowserRouter } from "react-router-dom";

import { PortfolioProvider } from "./lib/PortfolioProvider";
import { usePortfolio } from "./lib/usePortfolio";
import { themeFor } from "./themes";
import ThemeShell from "./themes/ThemeShell";
import DocumentHead from "./components/DocumentHead";

function ThemeSwitcher() {
  const { settings } = usePortfolio();
  const theme = themeFor(settings.appearance.theme);

  return <ThemeShell theme={theme} />;
}

function App() {
  return (
    <BrowserRouter>
      <PortfolioProvider>
        <DocumentHead />
        <ThemeSwitcher />
      </PortfolioProvider>
    </BrowserRouter>
  );
}

export default App;