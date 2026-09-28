import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate, useParams } from "react-router-dom";

import AdminLoginPage from "./pages/AdminLogin";
import SettingsPage from "./pages/admin/Settings";

import { usePortfolio } from "./lib/usePortfolio";
import { useAdmin } from "./lib/useAdmin";
import { clearAutosave } from "./lib/blogAutosave";
import { blogDesignFor } from "./blogDesigns";

import type { ThemePages } from "./themes/types";
import type { EditorResult } from "./pages/admin/edit/BlogPostEditor";

const BlogPostEditor = lazy(() =>
  import("./pages/admin/edit/BlogPostEditor").then((m) => ({
    default: m.BlogPostEditor,
  })),
);

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
  const location = useLocation();
  const admin = useAdmin();
  const { blogPosts, setBlogPosts } = usePortfolio();

  const [editingSlug, setEditingSlug] = useState<string | null>(() => {
    const editSlug = (location.state as { editSlug?: string } | null)?.editSlug;

    return editSlug === slug ? (editSlug ?? null) : null;
  });
  const [toast, setToast] = useState<string | null>(null);

  const editing = editingSlug === slug;

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(null), 3500);

    return () => clearTimeout(timer);
  }, [toast]);

  const post = blogPosts.find(
    (item) => item.slug === slug && (item.status === "published" || admin),
  );

  if (!post) {
    return <pages.NotFound title="Artículo no encontrado" />;
  }

  const handleDelete = (postSlug: string) => {
    setBlogPosts(blogPosts.filter((item) => item.slug !== postSlug));
    clearAutosave();
    navigate("/blog");
  };

  const handleEdit = () => {
    setEditingSlug(post.slug);
  };

  const handleCloseEditor = (result?: EditorResult) => {
    clearAutosave();
    setEditingSlug(null);
    navigate(`/blog/${post.slug}`, { replace: true, state: null });

    if (result === "published") {
      setToast("Publicación publicada.");
    } else if (result === "saved-draft") {
      setToast("Borrador guardado.");
    }
  };

  const sharedProps = {
    onBack: () => navigate("/blog"),
    onEdit: handleEdit,
    onDelete: handleDelete,
  };

  if (editing && admin && post) {
    return (
      <main className="px-6 pt-10 pb-20 transition-colors md:pt-14 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <Suspense
            fallback={
              <div className="mb-16 h-64 animate-pulse rounded-3xl bg-neutral-100 dark:bg-white/5" />
            }
          >
            <BlogPostEditor
              initial={post}
              onClose={handleCloseEditor}
            />
          </Suspense>
        </div>
      </main>
    );
  }

  if (post.design) {
    const { Page } = blogDesignFor(post.design);

    return (
      <>
        <Page post={post} {...sharedProps} />
        {toast && (
          <div
            role="status"
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-[var(--visora-btn-radius)] bg-neutral-900/90 px-5 py-3 text-sm text-white shadow-2xl backdrop-blur-md dark:bg-[#F5F3FF]/90 dark:text-black"
          >
            {toast}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <pages.BlogPostPage post={post} {...sharedProps} />
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-[var(--visora-btn-radius)] bg-neutral-900/90 px-5 py-3 text-sm text-white shadow-2xl backdrop-blur-md dark:bg-[#F5F3FF]/90 dark:text-black"
        >
          {toast}
        </div>
      )}
    </>
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