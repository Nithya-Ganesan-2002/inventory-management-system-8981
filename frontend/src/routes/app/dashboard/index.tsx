import { component$, useComputed$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Card } from "~/components/ui/Card";
import { useData } from "~/stores/data";

// PUBLIC_INTERFACE
export default component$(() => {
  /** Dashboard with stock summary and category breakdown */
  const data = useData();

  const totalStock = useComputed$(() =>
    data.products.reduce((acc, p) => acc + p.stock, 0),
  );
  const lowStock = useComputed$(() =>
    data.products.filter((p) => p.stock < p.minStock),
  );
  const categoryCounts = useComputed$(() => {
    const map = new Map<string, number>();
    data.categories.forEach((c) => map.set(c.id, 0));
    data.products.forEach((p) => map.set(p.categoryId, (map.get(p.categoryId) ?? 0) + p.stock));
    return Array.from(map.entries()).map(([id, count]) => ({
      id, name: data.categories.find((c) => c.id === id)?.name ?? id, count
    }));
  });

  const maxCount = useComputed$(() => Math.max(1, ...categoryCounts.value.map(c => c.count)));

  return (
    <div class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Products">
          <div class="text-3xl font-semibold">{data.products.length}</div>
        </Card>
        <Card title="Total Stock">
          <div class="text-3xl font-semibold">{totalStock.value}</div>
        </Card>
        <Card title="Low Inventory">
          <div class="text-3xl font-semibold">{lowStock.value.length}</div>
        </Card>
        <Card title="Categories">
          <div class="text-3xl font-semibold">{data.categories.length}</div>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Category Stock Breakdown">
          <div class="space-y-2">
            {categoryCounts.value.map((c) => (
              <div key={c.id}>
                <div class="flex justify-between text-sm mb-1">
                  <span>{c.name}</span>
                  <span>{c.count}</span>
                </div>
                <div class="w-full h-3 bg-gray-100 rounded">
                  <div
                    class="h-3 bg-primary rounded"
                    style={{ width: `${(c.count / maxCount.value) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Low Inventory Alerts">
          <ul class="space-y-2">
            {lowStock.value.length === 0 && <li class="text-sm text-gray-500">No low inventory items 🎉</li>}
            {lowStock.value.map((p) => (
              <li key={p.id} class="badge badge-outline low-stock">{p.name} (Stock: {p.stock}, Min: {p.minStock})</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "IMS - Dashboard",
  meta: [{ name: "description", content: "Inventory dashboard and analytics" }],
};
