import { useMemo } from "react";

import { toSafeHtml } from "../lib/html";

function RichHtml({
  html,
  className,
}: {
  html: string | undefined | null;
  className?: string;
}) {
  const clean = useMemo(() => toSafeHtml(html), [html]);

  if (!clean) return null;

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

export default RichHtml;
