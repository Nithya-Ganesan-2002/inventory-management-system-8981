import { createContextId, useContextProvider, useStore, useContext } from "@builder.io/qwik";

export type Role = "admin" | "user";
export type User = { id: string; name: string; email: string; role: Role } | null;

type AuthState = {
  user: User;
  token: string | null;
  isAuthenticated: boolean;
};

export const AuthContext = createContextId<AuthState>("auth-context");

// PUBLIC_INTERFACE
export function useAuthProvider() {
  /** Provide auth store to the app. */
  const state = useStore<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  // Initialize from localStorage (client-side only)
  if (typeof window !== "undefined") {
    const cached = window.localStorage.getItem("ims_auth");
    if (cached && !state.isAuthenticated) {
      try {
        const parsed = JSON.parse(cached);
        state.user = parsed.user;
        state.token = parsed.token;
        state.isAuthenticated = !!parsed.token;
      } catch (e) {
        // ignore parse errors and reset any bad cache
        try {
          window.localStorage.removeItem("ims_auth");
        } catch {
          // no-op to satisfy linter: intentionally ignore storage errors
          /* noop */
        }
      }
    }
  }

  useContextProvider(AuthContext, state);
  return state;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Get auth store from context. */
  return useContext(AuthContext);
}
