import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Card } from "~/components/ui/Card";
import { useAuth } from "~/stores/auth";

// PUBLIC_INTERFACE
export default component$(() => {
  const auth = useAuth();
  return (
    <div class="max-w-2xl">
      <Card title="Profile">
        {auth.user ? (
          <div class="space-y-2">
            <div><strong>Name:</strong> {auth.user.name}</div>
            <div><strong>Email:</strong> {auth.user.email}</div>
            <div><strong>Role:</strong> {auth.user.role.toUpperCase()}</div>
          </div>
        ) : (
          <div>Please login to view profile.</div>
        )}
      </Card>
    </div>
  );
});

export const head: DocumentHead = {
  title: "IMS - Profile",
};
