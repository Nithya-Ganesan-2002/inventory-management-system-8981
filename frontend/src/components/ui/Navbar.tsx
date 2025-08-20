import { component$, Slot } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

// PUBLIC_INTERFACE
export const Navbar = component$((props: { userName?: string; role?: "admin" | "user" }) => {
  /** Top navbar with app title and user menu */
  return (
    <div class="navbar bg-base-100 border-b border-gray-200 sticky top-0 z-40">
      <div class="flex-1">
        <Link href="/dashboard" class="btn btn-ghost normal-case text-xl">IMS</Link>
      </div>
      <div class="flex-none gap-2">
        <div class="hidden sm:block text-sm text-gray-500">{props.role ? props.role.toUpperCase() : "GUEST"}</div>
        <div class="dropdown dropdown-end">
          <div tabIndex={0} role="button" class="btn btn-ghost btn-circle avatar placeholder">
            <div class="bg-neutral text-neutral-content rounded-full w-10">
              <span>{(props.userName?.[0] ?? "G").toUpperCase()}</span>
            </div>
          </div>
          <ul tabIndex={0} class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li class="menu-title px-2">{props.userName ?? "Guest"}</li>
            <li><Link href="/profile">Profile</Link></li>
            <li><Link href="/auth/logout">Logout</Link></li>
          </ul>
        </div>
      </div>
      <Slot />
    </div>
  );
});
