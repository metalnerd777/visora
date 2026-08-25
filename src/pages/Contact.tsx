import { photographer } from "../data/portfolio";
import { instagramUrl, behanceUrl } from "../lib/socials";

function ContactPage() {
  return (
    <main className="px-6 pt-10 pb-20 transition-colors md:px-10 md:pt-5 md:pb-24">
      <div className="mx-auto max-w-7xl">
        <header className="max-w-3xl pt-16 md:pt-24">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-[#A8A3B8]">
            Contacto
          </p>

          <h1 className="text-4xl font-light tracking-tight text-neutral-900 dark:text-[#F5F3FF] md:text-6xl">
            {photographer.contactTitle ?? "Hablemos."}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
            {photographer.contactDescription}
          </p>
        </header>

        {/* Acciones + información */}
        <div className="mt-14 grid gap-12 md:grid-cols-2">
          <div>
            <a
              href={`mailto:${photographer.email}`}
              className="inline-flex min-w-44 items-center justify-center rounded-full bg-neutral-900 px-8 py-4 text-sm text-white shadow-lg shadow-neutral-900/10 transition-all duration-300 hover:bg-[#7C6CFF] dark:bg-[#F5F3FF] dark:text-black dark:shadow-black/30 dark:hover:bg-[#7C6CFF] dark:hover:text-white"
            >
              Escribir un mensaje
            </a>

            <p className="mt-4 text-sm text-neutral-400 dark:text-[#6F6A80]">
              {photographer.email}
            </p>
          </div>

          <div className="flex flex-col gap-6 md:items-end md:text-right">
            {photographer.location && (
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
                  Ubicación
                </p>

                <p className="mt-2 text-sm text-neutral-600 dark:text-[#C9C4D8]">
                  {photographer.location}
                </p>
              </div>
            )}

            {photographer.instagram && (
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
                  Instagram
                </p>

                <a
                  href={instagramUrl(photographer.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-sm text-neutral-600 transition-colors hover:text-[#7C6CFF] dark:text-[#C9C4D8]"
                >
                  {photographer.instagram}
                </a>
              </div>
            )}

            {photographer.behance && (
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
                  Behance
                </p>

                <a
                  href={behanceUrl(photographer.behance)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-sm text-neutral-600 transition-colors hover:text-[#7C6CFF] dark:text-[#C9C4D8]"
                >
                  {photographer.behance}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ContactPage;
