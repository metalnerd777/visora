import { useEffect } from "react";
import { photographer } from "../data/portfolio";

function DocumentHead() {
  useEffect(() => {
    document.title = `${photographer.name} - ${photographer.profession}`;

    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');

    if (favicon) {
      favicon.href = "/favicon.svg";
    }
  }, []);

  return null;
}

export default DocumentHead;
