import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

// PUBLIC_INTERFACE
export default component$(() => {
  // Simple redirect to /app which handles auth redirection
  useVisibleTask$(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/app";
    }
  });
  return (
    <div class="min-h-screen grid place-items-center">
      <h1 class="text-2xl">Loading...</h1>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Inventory Management System",
  meta: [
    {
      name: "description",
      content: "Qwik + Tailwind Inventory Management System",
    },
  ],
};
