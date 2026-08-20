import { photographer } from "../data/portfolio";

function Footer() {
  return (
    <footer className="border-t border-neutral-200 px-6 py-8 md:px-10">
      <div className="flex flex-col gap-6 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-neutral-900">{photographer.name}</p>

          <p className="mt-1">{photographer.location}</p>
        </div>

        <div className="flex gap-5">
          {photographer.instagram && (
            <a href="#" className="transition-colors hover:text-neutral-950">
              Instagram
            </a>
          )}

          {photographer.behance && (
            <a href="#" className="transition-colors hover:text-neutral-950">
              Behance
            </a>
          )}
        </div>
      </div>

      <div className="mt-8 text-xs text-neutral-400">
        © {new Date().getFullYear()} {photographer.name}
      </div>
    </footer>
  );
}

export default Footer;
