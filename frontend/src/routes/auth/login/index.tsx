import { component$, $, useStore } from "@builder.io/qwik";
import { Form, Link, routeAction$ } from "@builder.io/qwik-city";
import { useAuth } from "~/stores/auth";
import { TextField } from "~/components/ui/FormFields";

// PUBLIC_INTERFACE
export const useLogin = routeAction$(async (data) => {
  /** Fake login action. In real app, call backend here. */
  const email = String(data.email || "");
  const password = String(data.password || "");
  if (!email || !password) {
    return { success: false, message: "Email and password are required." };
  }
  const role = (email.includes("admin") ? "admin" : "user") as "admin" | "user";
  // Set cookie or session via backend; here we just hint success.
  return { success: true, user: { id: "u1", name: email.split("@")[0], email, role }, token: "demo-token" };
});

// PUBLIC_INTERFACE
export default component$(() => {
  /** Login page */
  const auth = useAuth();
  const action = useLogin();
  const ui = useStore({ error: "" });

  const onSubmit = $(() => {
    // After successful action, persist in localStorage
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
      ui.error = action.value.message ?? "Login failed";
    }
  });

  return (
    <div class="min-h-screen grid place-items-center bg-base-100 p-4">
      <div class="card w-full max-w-md bg-base-100 shadow border border-gray-200">
        <div class="card-body">
          <h2 class="card-title">Login</h2>
          {ui.error && <div class="alert alert-error text-sm">{ui.error}</div>}
          <Form action={action} onSubmitCompleted$={onSubmit} class="space-y-3">
            <TextField label="Email" name="email" type="email" required placeholder="you@example.com" />
            <TextField label="Password" name="password" type="password" required placeholder="••••••••" />
            <button type="submit" class="btn btn-primary w-full" disabled={action.isRunning}>Login</button>
          </Form>
          <p class="text-sm text-center text-gray-500">
            Don’t have an account? <Link class="link" href="/auth/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
});
