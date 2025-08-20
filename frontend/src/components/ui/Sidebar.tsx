import { component$, $, useStore } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";

type NavItem = {
  label: string;
  href: string;
  icon?: string;
  roles?: Array<"admin" | "user">;
};

// PUBLIC_INTERFACE
export const Sidebar = component$((props: { role?: "admin" | "user" }) => {
  /** Sidebar navigation component with role-aware items */
  const items: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: "🏠", roles: ["admin", "user"] },
    { label: "Products", href: "/products", icon: "📦", roles: ["admin", "user"] },
    { label: "Categories", href: "/categories", icon: "🗂️", roles: ["admin"] },
    { label: "Locations", href: "/locations", icon: "📍", roles: ["admin"] },
    { label: "Reports", href: "/reports", icon: "📈", roles: ["admin", "user"] },
  ];
  const loc = useLocation();
  const ui = useStore({ open: true });

  const toggle = $(() => (ui.open = !ui.open));

  return (
    <aside class={`transition-all duration-300 bg-base-100 border-r border-gray-200 ${ui.open ? "w-64" : "w-16"} h-screen sticky top-0`}>
      <div class="flex items-center justify-between p-4">
        <span class="font-semibold">{ui.open ? "Inventory" : "INV"}</span>
        <button class="btn btn-ghost btn-xs" onClick$={toggle} title="Toggle sidebar">
          {ui.open ? "«" : "»"}
        </button>
      </div>
      <nav class="menu px-2">
        <ul>
          {items
            .filter((i) => !i.roles || i.roles.includes(props.role ?? "user"))
            .map((i) => {
              const active = loc.url.pathname.startsWith(i.href);
              return (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    class={`flex items-center gap-2 rounded-md ${active ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                  >
                    <span>{i.icon}</span>
                    {ui.open && <span>{i.label}</span>}
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>
    </aside>
  );
});
