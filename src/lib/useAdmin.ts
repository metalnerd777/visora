import { useEffect, useState } from "react";

import { isAuthenticated } from "./auth";

export function useAdmin() {
  const [admin, setAdmin] = useState(isAuthenticated());

  useEffect(() => {
    const interval = setInterval(() => {
      setAdmin(isAuthenticated());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return admin;
}