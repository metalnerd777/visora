const MOCK_EMAIL = "admin@visora.com";
const MOCK_PASSWORD = "admin123";
const STORAGE_KEY = "visora-admin-auth";

type AuthListener = () => void;

const listeners = new Set<AuthListener>();

function readAuth(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    // localStorage bloqueado (modo privado / permisos)
    return false;
  }
}

// Estado en memoria: es la instantánea estable que consume useSyncExternalStore.
let authenticated = readAuth();

function emit(): void {
  const next = readAuth();

  if (next === authenticated) return;

  authenticated = next;

  for (const listener of listeners) {
    listener();
  }
}

/** Suscripción usada por useAdmin (useSyncExternalStore). */
export function subscribeAuth(listener: AuthListener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/** Instantánea actual de la sesión (estable entre renders). */
export function getAuthSnapshot(): boolean {
  return authenticated;
}

export function login(email: string, password: string): boolean {
  if (email !== MOCK_EMAIL || password !== MOCK_PASSWORD) {
    return false;
  }

  localStorage.setItem(STORAGE_KEY, "true");
  emit();

  return true;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
  emit();
}

export function isAuthenticated(): boolean {
  return authenticated;
}

// Sincroniza la sesión entre pestañas (login/logout en otra pestaña).
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      emit();
    }
  });
}
