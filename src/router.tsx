import { Routes, Route, useNavigate, useParams } from "react-router-dom";

import AdminLoginPage from "./pages/AdminLogin";
import SettingsPage from "./pages/admin/Settings";

import { usePortfolio } from "./lib/usePortfolio";
import { clearAutosave } from "./lib/blogAutosave";

import type { ThemePages } from "./themes/types";

function ProjectRoute({
  pages,
}: {
  pages: ThemePages;
}) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { projects } = usePortfolio();

  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return <pages.NotFound title="Proyecto no encontrado" />;
  }

  return (
    <pages.ProjectPage project={project} onBack={() => navigate("/")} />
  );
}

function BlogPostRoute({
  pages,
}: {
  pages: ThemePages;
}) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { blogPosts, setBlogPosts } = usePortfolio();

  const post = blogPosts.find(
    (item) => item.slug === slug && item.status === "published",
  );

  if (!post) {
    return <pages.NotFound title="Artículo no encontrado" />;
  }

  const handleDelete = (postSlug: string) => {
    setBlogPosts(blogPosts.filter((item) => item.slug !== postSlug));
    clearAutosave();
    navigate("/blog");
  };

  const handleEdit = (postSlug: string) => {
    navigate("/blog", { state: { editSlug: postSlug } });
  };

  return (
    <pages.BlogPostPage
      post={post}
      onBack={() => navigate("/blog")}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}

function AppRouter({ pages }: { pages: ThemePages }) {
  return (
    <Routes>
      <Route path="/" element={<pages.Home />} />

      <Route path="/proyecto/:slug" element={<ProjectRoute pages={pages} />} />

      <Route path="/sobre-mi" element={<pages.AboutPage />} />

      <Route path="/blog" element={<pages.BlogPage />} />

      <Route path="/blog/:slug" element={<BlogPostRoute pages={pages} />} />

      <Route path="/contacto" element={<pages.ContactPage />} />

      <Route path="/admin" element={<AdminLoginPage />} />

      <Route path="/configuracion" element={<SettingsPage />} />

      <Route path="*" element={<pages.NotFound />} />
    </Routes>
  );
}

export default AppRouter;