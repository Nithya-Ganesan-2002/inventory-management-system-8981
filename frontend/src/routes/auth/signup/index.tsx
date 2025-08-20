import { component$, $, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Form, Link, routeAction$ } from "@builder.io/qwik-city";
import { useAuth } from "~/stores/auth";
import { TextField, SelectField } from "~/components/ui/FormFields";

// PUBLIC_INTERFACE
export const useSignup = routeAction$(async (data) => {
  /** Fake signup action. In real app, call backend to create user and return token. */
  const name = String(data.name || "");
  const email = String(data.email || "");
  const password = String(data.password || "");
  const role = (String(data.role || "user") as "admin" | "user");
  if (!name || !email || !password) {
    return { success: false, message: "All fields are required." };
  }
  return { success: true, user: { id: "u2", name, email, role }, token: "demo-token" };
});

// PUBLIC_INTERFACE
export default component$(() => {
  /** Signup page */
  const auth = useAuth();
  const action = useSignup();
  const ui = useStore({ error: "" });

  const onSubmit = $(() => {
    if (action.value?.success) {
      const v = action.value!;
      auth.user = v.user!;
      auth.token = v.token ?? null;
      auth.isAuthenticated = true;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("ims_auth", JSON.stringify({ user: auth.user, token: auth.token }));
        window.location.href = "/app/dashboard";
      }
    } else if (action.value && !action.value.success) {
      ui.error = action.value.message ?? "Signup failed";
    }
  });

  return (
    <div class="min-h-screen grid place-items-center bg-base-100 p-4">
      <div class="card w-full max-w-md bg-base-100 shadow border border-gray-200">
        <div class="card-body">
          <h2 class="card-title">Create an account</h2>
          {ui.error && <div class="alert alert-error text-sm">{ui.error}</div>}
          <Form action={action} onSubmitCompleted$={onSubmit} class="space-y-3">
            <TextField label="Name" name="name" required placeholder="Jane Doe" />
            <TextField label="Email" name="email" type="email" required placeholder="jane@example.com" />
            <TextField label="Password" name="password" type="password" required placeholder="••••••••" />
            <SelectField
              label="Role"
              name="role"
              options={[
                { label: "User", value: "user" },
                { label: "Admin", value: "admin" },
              ]}
            />
            <button type="submit" class="btn btn-primary w-full" disabled={action.isRunning}>Sign up</button>
          </Form>
          <p class="text-sm text-center text-gray-500">
            Already have an account? <Link class="link" href="/auth/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "IMS - Signup",
  meta: [{ name: "description", content: "Create an account for Inventory Management System" }],
};
