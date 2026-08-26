import { useEffect } from "react";
import { profile } from "../data/portfolio";

function DocumentHead() {
  useEffect(() => {
    document.title = `${profile.name} - ${profile.profession}`;

    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');

    if (favicon) {
      favicon.href = "/favicon.svg";
    }
  }, []);

  return null;
}

export default DocumentHead;
