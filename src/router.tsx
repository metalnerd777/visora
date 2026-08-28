import { Routes, Route, useNavigate, useParams } from "react-router-dom";

import Home from "./pages/Home";
import ProjectPage from "./pages/Project";
import AboutPage from "./pages/About";
import BlogPage from "./pages/Blog";
import BlogPostPage from "./pages/BlogPost";
import ContactPage from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLoginPage from "./pages/AdminLogin";

import { usePortfolio } from "./lib/usePortfolio";
import { clearAutosave } from "./lib/blogAutosave";

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
  const { blogPosts, setBlogPosts } = usePortfolio();

  const post = blogPosts.find(
    (item) => item.slug === slug && item.status === "published",
  );

  if (!post) {
    return <NotFound title="Artículo no encontrado" />;
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
    <BlogPostPage
      post={post}
      onBack={() => navigate("/blog")}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
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
