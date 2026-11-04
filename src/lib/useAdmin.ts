import { useSyncExternalStore } from "react";

import { getAuthSnapshot, subscribeAuth } from "./auth";

/**
 * Sesión admin compartida por toda la app.
 *
 * Toda la suscripción vive en el store de auth.ts (una sola fuente de verdad),
 * así no hay un setInterval por componente. El día que se conecte Supabase Auth,
 * basta con emitir desde onAuthStateChange para que toda la UI se actualice.
 */
export function useAdmin(): boolean {
  return useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthSnapshot);
}
