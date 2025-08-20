import { component$ } from "@builder.io/qwik";

// PUBLIC_INTERFACE
export default component$(() => {
  return (
    <div class="min-h-screen grid place-items-center p-6">
      <div class="text-center space-y-2">
        <h1 class="text-4xl font-semibold">404</h1>
        <p class="text-gray-500">Page not found</p>
        <a href="/app" class="btn btn-primary">Go Home</a>
      </div>
    </div>
  );
});
