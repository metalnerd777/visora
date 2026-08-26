import { Routes, Route, useNavigate, useParams } from "react-router-dom";

import Home from "./pages/Home";
import ProjectPage from "./pages/Project";
import AboutPage from "./pages/About";
import BlogPage from "./pages/Blog";
import BlogPostPage from "./pages/BlogPost";
import ContactPage from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLoginPage from "./pages/AdminLogin";

import { blogPosts } from "./data/portfolio";
import { usePortfolio } from "./lib/usePortfolio";

function ProjectRoute() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { projects } = usePortfolio();

  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return <NotFound title="Proyecto no encontrado" />;
  }

  return (
    <ProjectPage project={project} onBack={() => navigate("/")} />
  );
}

function BlogPostRoute() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return <NotFound title="Artículo no encontrado" />;
  }

  return <BlogPostPage post={post} onBack={() => navigate("/blog")} />;
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/proyecto/:slug" element={<ProjectRoute />} />

      <Route path="/sobre-mi" element={<AboutPage />} />

      <Route path="/blog" element={<BlogPage />} />

      <Route path="/blog/:slug" element={<BlogPostRoute />} />

      <Route path="/contacto" element={<ContactPage />} />

      <Route path="/admin" element={<AdminLoginPage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
