import { component$, useVisibleTask$ } from "@builder.io/qwik";

// PUBLIC_INTERFACE
export default component$(() => {
  /** Logout page clears local storage and redirects to login */
  useVisibleTask$(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("ims_auth");
      window.location.href = "/auth/login";
    }
  });
  return <div class="p-6 text-center">Signing out...</div>;
});
