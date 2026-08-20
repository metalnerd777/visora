function Footer() {
  return (
    <footer className="border-t border-neutral-200 px-6 py-8 md:px-10">
      <div className="flex flex-col gap-4 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
        <p>© 2026 Alex Morgan</p>

        <div className="flex gap-5">
          <a href="#" className="transition-colors hover:text-neutral-950">
            Instagram
          </a>

          <a href="#" className="transition-colors hover:text-neutral-950">
            Behance
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
