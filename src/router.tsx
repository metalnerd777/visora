import { Routes, Route, useNavigate, useParams } from "react-router-dom";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import { galleries } from "./data/portfolio";

function GalleryRoute() {
  const { id } = useParams();
  const navigate = useNavigate();

  const gallery = galleries.find((item) => item.id === id);

  if (!gallery) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-neutral-900 dark:bg-[#0B0A14] dark:text-[#F5F3FF]">
        <div className="text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-neutral-400 dark:text-[#A8A3B8]">
            404
          </p>

          <h1 className="text-4xl font-light">Galería no encontrada</h1>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-8 text-sm text-neutral-500 transition-colors hover:text-black dark:text-[#A8A3B8] dark:hover:text-[#7C6CFF]"
          >
            ← Volver al portfolio
          </button>
        </div>
      </main>
    );
  }

  return <Gallery gallery={gallery} onBack={() => navigate("/")} />;
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/galeria/:id" element={<GalleryRoute />} />
    </Routes>
  );
}

export default AppRouter;
