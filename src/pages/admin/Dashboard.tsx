import { Link } from "react-router-dom";

import { profile, projects, blogPosts, siteTexts } from "../../data/portfolio";

const stats = [
  {
    label: "Proyectos",
    value: String(projects.length),
    to: "/admin/proyectos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Publicaciones",
    value: String(blogPosts.length),
    to: "/admin/blog",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    label: "Tema",
    value: "Minimal",
    to: "/admin/apariencia",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
  {
    label: "Estado",
    value: "Publicado",
    to: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
];

const quickActions = [
  {
    label: "Editar perfil",
    description: "Nombre, profesión, contacto",
    to: "/admin/perfil",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "Nuevo proyecto",
    description: `Agregar ${siteTexts.workNounSingular}`,
    to: "/admin/proyectos/nuevo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
  {
    label: "Nueva publicación",
    description: "Escribir artículo",
    to: "/admin/blog/nuevo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    label: "Apariencia",
    description: "Colores y configuración",
    to: "/admin/apariencia",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
];

function Dashboard() {
  return (
    <div>
      {/* Encabezado */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 dark:text-[#6F6A80]">
          Administrador
        </p>

        <h1 className="mt-2 text-3xl font-light tracking-tight">
          Bienvenido, {profile.name.split(" ")[0]}
        </h1>

        <p className="mt-2 text-sm text-neutral-500 dark:text-[#A8A3B8]">
          {profile.profession} · {profile.location}
        </p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className="group rounded-2xl border border-neutral-200/70 bg-white/60 p-5 backdrop-blur-sm transition-all hover:border-[#7C6CFF]/30 hover:shadow-[0_8px_30px_rgba(124,108,255,0.06)] dark:border-[#27243A]/70 dark:bg-[#161327]/60 dark:hover:border-[#7C6CFF]/30"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-neutral-400 transition-colors group-hover:text-[#7C6CFF] dark:text-[#6F6A80]">
                {stat.icon}
              </span>

              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-neutral-300 transition-colors group-hover:text-[#7C6CFF] dark:text-[#4A4468]">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>

            <p className="text-2xl font-light tracking-tight">{stat.value}</p>

            <p className="mt-1 text-xs text-neutral-500 dark:text-[#A8A3B8]">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div>
        <h2 className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
          Accesos rápidos
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className="group flex items-center gap-4 rounded-2xl border border-neutral-200/70 bg-white/60 p-5 backdrop-blur-sm transition-all hover:border-[#7C6CFF]/30 hover:shadow-[0_8px_30px_rgba(124,108,255,0.06)] dark:border-[#27243A]/70 dark:bg-[#161327]/60 dark:hover:border-[#7C6CFF]/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 transition-colors group-hover:bg-[#7C6CFF]/10 group-hover:text-[#7C6CFF] dark:bg-white/5 dark:text-[#6F6A80] dark:group-hover:bg-[#7C6CFF]/15 dark:group-hover:text-[#7C6CFF]">
                {action.icon}
              </div>

              <div>
                <p className="text-sm font-medium">{action.label}</p>

                <p className="mt-0.5 text-xs text-neutral-400 dark:text-[#6F6A80]">
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
