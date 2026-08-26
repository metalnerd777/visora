import { BrowserRouter } from "react-router-dom";

import { PortfolioProvider } from "./lib/PortfolioProvider";
import MinimalTheme from "./themes/minimal/MinimalTheme";
import DocumentHead from "./components/DocumentHead";

function App() {
  return (
    <BrowserRouter>
      <PortfolioProvider>
        <DocumentHead />
        <MinimalTheme />
      </PortfolioProvider>
    </BrowserRouter>
  );
}

export default App;
