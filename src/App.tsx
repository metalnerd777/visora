import { BrowserRouter } from "react-router-dom";

import MinimalTheme from "./themes/minimal/MinimalTheme";
import DocumentHead from "./components/DocumentHead";

function App() {
  return (
    <BrowserRouter>
      <DocumentHead />
      <MinimalTheme />
    </BrowserRouter>
  );
}

export default App;
