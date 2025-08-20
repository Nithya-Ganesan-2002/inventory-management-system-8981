import { createContextId, useContextProvider, useStore, useContext } from "@builder.io/qwik";

export type Role = "admin" | "user";
export type User = { id: string; name: string; email: string; role: Role } | null;

type AuthState = {
  user: User;
  token: string | null;
  isAuthenticated: boolean;
};

/**
 * Global auth context for the application.
 * Holds user info, token and authenticated state.
 */
export const AuthContext = createContextId<AuthState>("auth-context");

// PUBLIC_INTERFACE
export function useAuthProvider() {
  /**
   * Provide auth store to the component subtree.
   * Must be called within a Qwik component render to register the provider.
   * Initializes state from localStorage on the client when available.
   */
  const state = useStore<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  // Initialize from localStorage (client-side only). Wrapped in try/catch to be resilient.
  if (typeof window !== "undefined") {
    try {
      const cached = window.localStorage.getItem("ims_auth");
      if (cached && !state.isAuthenticated) {
        const parsed = JSON.parse(cached);
        state.user = parsed?.user ?? null;
        state.token = parsed?.token ?? null;
        state.isAuthenticated = !!parsed?.token;
      }
    } catch {
      try {
        window.localStorage.removeItem("ims_auth");
      } catch {
        /* noop */
      }
    }
  }

  useContextProvider(AuthContext, state);
  return state;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /**
   * Get auth store from context.
   * This hook must be called within a Qwik component that is a descendant of an AuthContext provider.
   */
  return useContext(AuthContext);
}
