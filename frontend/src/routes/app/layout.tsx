import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { Navbar } from "~/components/ui/Navbar";
import { Sidebar } from "~/components/ui/Sidebar";
import { useAuthProvider, useAuth } from "~/stores/auth";
import { useDataProvider } from "~/stores/data";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({ maxAge: 5, staleWhileRevalidate: 60 * 60 });
};

// PUBLIC_INTERFACE
export default component$(() => {
  /** Application shell layout: sidebar + navbar + content */
  useAuthProvider();
  useDataProvider();
  const auth = useAuth();

  return (
    <div class="min-h-screen bg-base-100">
      <div class="flex">
        <Sidebar role={(auth.user?.role as any) ?? "user"} />
        <div class="flex-1 min-h-screen">
          <Navbar userName={auth.user?.name ?? "Guest"} role={(auth.user?.role as any) ?? "user"} />
          <main class="p-4 md:p-6">
            <div class="page-enter page-enter-active">
              <Slot />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
});
