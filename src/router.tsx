import { Routes, Route, useNavigate, useParams } from "react-router-dom";

import Home from "./pages/Home";
import ProjectPage from "./pages/Project";
import AboutPage from "./pages/About";
import BlogPage from "./pages/Blog";
import BlogPostPage from "./pages/BlogPost";
import ContactPage from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLoginPage from "./pages/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Profile from "./pages/admin/Profile";
import HeroAdmin from "./pages/admin/HeroAdmin";
import Featured from "./pages/admin/Featured";
import AboutAdmin from "./pages/admin/AboutAdmin";
import ContactAdmin from "./pages/admin/ContactAdmin";
import ProjectList from "./pages/admin/projects/ProjectList";
import ProjectForm from "./pages/admin/projects/ProjectForm";

import { projects, blogPosts } from "./data/portfolio";

function ProjectRoute() {
  const { slug } = useParams();
  const navigate = useNavigate();

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

function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-3xl font-light tracking-tight">{title}</h1>

      <p className="mt-4 text-sm text-neutral-500 dark:text-[#A8A3B8]">
        Próximamente.
      </p>
    </div>
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

      {/* Admin — login standalone */}
      <Route path="/admin" element={<AdminLoginPage />} />

      {/* Admin — rutas protegidas con layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="perfil" element={<Profile />} />

        <Route path="hero" element={<HeroAdmin />} />

        <Route path="sobre-mi" element={<AboutAdmin />} />

        <Route path="proyectos" element={<ProjectList />} />

        <Route path="proyectos/nuevo" element={<ProjectForm />} />

        <Route path="proyectos/:slug/editar" element={<ProjectForm />} />

        <Route path="destacadas" element={<Featured />} />

        <Route
          path="blog"
          element={<AdminPlaceholder title="Blog" />}
        />

        <Route path="contacto" element={<ContactAdmin />} />

        <Route
          path="apariencia"
          element={<AdminPlaceholder title="Apariencia" />}
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
