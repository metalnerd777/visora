import { useEffect, useState } from "react";

import About from "../components/About";

import { isAuthenticated } from "../lib/auth";

import EditableSection from "./admin/edit/EditableSection";
import EditAboutModal from "./admin/edit/EditAboutModal";

function AboutPage() {
  const [admin, setAdmin] = useState(isAuthenticated());
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAdmin(isAuthenticated());
    }, 500);

    return () => clearInterval(interval);
  }, []);

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

      {admin && (
        <EditAboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      )}
    </main>
  );
}

export default AboutPage;
