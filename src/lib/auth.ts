const MOCK_EMAIL = "admin@visora.com";
const MOCK_PASSWORD = "admin123";
const STORAGE_KEY = "visora-admin-auth";

export function login(email: string, password: string): boolean {
  if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
    localStorage.setItem(STORAGE_KEY, "true");

    return true;
  }

  return false;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "true";
}
