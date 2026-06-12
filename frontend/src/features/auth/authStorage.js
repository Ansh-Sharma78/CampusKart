const AUTH_STORAGE_KEY = 'campuskart.auth';

export function loadAuthState() {
  try {
    const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

export function saveAuthState(authState) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
}

export function clearAuthState() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
