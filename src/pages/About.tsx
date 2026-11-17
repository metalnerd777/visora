import { lazy, Suspense, useState } from "react";

import About from "../components/About";

import { useAdmin } from "../lib/useAdmin";

import EditableSection from "./admin/edit/EditableSection";

const EditAboutModal = lazy(() => import("./admin/edit/EditAboutModal"));

function AboutPage() {
  const admin = useAdmin();
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <main className="px-6 pt-10 pb-20 transition-colors md:px-10 md:pt-5 md:pb-24">
      <div className="pt-16 pb-6 md:pt-24">
        {admin ? (
          <EditableSection
            label="Editar sobre mí"
            onEdit={() => setAboutOpen(true)}
          >
            <About />
          </EditableSection>
        ) : (
          <About />
        )}
      </div>

      {admin && aboutOpen && (
        <Suspense fallback={null}>
          <EditAboutModal
            open={aboutOpen}
            onClose={() => setAboutOpen(false)}
          />
        </Suspense>
      )}
    </main>
  );
}

export default AboutPage;
