import { useEffect } from "react";

import { usePortfolio } from "../lib/usePortfolio";

function DocumentHead() {
  const { profile } = usePortfolio();

  useEffect(() => {
    document.title = `${profile.name} - ${profile.profession}`;

    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');

    if (favicon) {
      favicon.href = "/favicon.svg";
    }
  }, [profile.name, profile.profession]);

  return null;
}

export default DocumentHead;
