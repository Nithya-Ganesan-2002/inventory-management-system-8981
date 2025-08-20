import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { useAuth } from "~/stores/auth";

// PUBLIC_INTERFACE
export default component$(() => {
  /** Redirect route to dashboard when authenticated, else to login */
  const auth = useAuth();
  useVisibleTask$(() => {
    if (typeof window !== "undefined") {
      if (auth.isAuthenticated) {
        window.location.href = "/app/dashboard";
      } else {
        window.location.href = "/auth/login";
      }
    }
  });
  return <div class="p-6">Redirecting...</div>;
});
