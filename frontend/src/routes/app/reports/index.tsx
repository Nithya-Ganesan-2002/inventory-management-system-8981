import { component$, useComputed$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Card } from "~/components/ui/Card";
import { useData } from "~/stores/data";

// PUBLIC_INTERFACE
export default component$(() => {
  /** Reports page with basic visualizations */
  const data = useData();
  const byLocation = useComputed$(() => {
    const map = new Map<string, number>();
    data.locations.forEach((l) => map.set(l.id, 0));
    data.products.forEach((p) => map.set(p.locationId, (map.get(p.locationId) ?? 0) + p.stock));
    return Array.from(map.entries()).map(([id, count]) => ({
      id, name: data.locations.find((l) => l.id === id)?.name ?? id, count,
    }));
  });
  const max = useComputed$(() => Math.max(1, ...byLocation.value.map((x) => x.count)));

  return (
    <div class="space-y-4">
      <Card title="Stock by Location">
        <div class="space-y-3">
          {byLocation.value.map((x) => (
            <div key={x.id}>
              <div class="flex justify-between text-sm mb-1">
                <span>{x.name}</span>
                <span>{x.count}</span>
              </div>
              <div class="w-full h-3 bg-gray-100 rounded">
                <div class="h-3 bg-secondary rounded" style={{ width: `${(x.count / max.value) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
});

export const head: DocumentHead = {
  title: "IMS - Reports",
  meta: [{ name: "description", content: "Inventory reporting and analytics" }],
};
