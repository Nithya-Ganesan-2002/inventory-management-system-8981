import { component$, useStore, $, useComputed$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Card } from "~/components/ui/Card";
import { Table, type Column } from "~/components/ui/Table";
import { Modal } from "~/components/ui/Modal";
import { TextField, SelectField } from "~/components/ui/FormFields";
import { useData } from "~/stores/data";
import { useAuth } from "~/stores/auth";

// PUBLIC_INTERFACE
export default component$(() => {
  /** Products management and list view */
  const data = useData();
  const auth = useAuth();
  const ui = useStore({
    q: "",
    category: "all",
    location: "all",
    modalId: "product-modal",
    mode: "create" as "create" | "edit",
    currentId: "" as string,
    form: { name: "", sku: "", categoryId: "", locationId: "", stock: 0, minStock: 0 },
  });

  const filtered = useComputed$(() => {
    return data.products.filter((p) => {
      const matchesQ = ui.q.trim() ? (p.name.toLowerCase().includes(ui.q.toLowerCase()) || p.sku.toLowerCase().includes(ui.q.toLowerCase())) : true;
      const matchesCat = ui.category === "all" ? true : p.categoryId === ui.category;
      const matchesLoc = ui.location === "all" ? true : p.locationId === ui.location;
      return matchesQ && matchesCat && matchesLoc;
    });
  });

  const columns: Column<any>[] = [
    { key: "name", header: "Name" },
    { key: "sku", header: "SKU" },
    { key: "categoryId", header: "Category", render: (row) => data.categories.find((c) => c.id === row.categoryId)?.name ?? row.categoryId },
    { key: "locationId", header: "Location", render: (row) => data.locations.find((l) => l.id === row.locationId)?.name ?? row.locationId },
    { key: "stock", header: "Stock" },
    { key: "minStock", header: "Min" },
    {
      key: "actions",
      header: "Actions",
      render: (row) =>
        auth.user?.role === "admin" ? (
          <div class="flex gap-2">
            <label for={ui.modalId} class="btn btn-xs" onClick$={() => startEdit(row.id)}>Edit</label>
            <button class="btn btn-xs btn-error" onClick$={() => del(row.id)}>Delete</button>
          </div>
        ) : null,
    },
  ];

  const startCreate = $(() => {
    ui.mode = "create";
    ui.currentId = "";
    ui.form = { name: "", sku: "", categoryId: data.categories[0]?.id ?? "", locationId: data.locations[0]?.id ?? "", stock: 0, minStock: 0 };
  });

  const startEdit = $((id: string) => {
    ui.mode = "edit";
    ui.currentId = id;
    const p = data.products.find((x) => x.id === id);
    if (p) {
      ui.form = { name: p.name, sku: p.sku, categoryId: p.categoryId, locationId: p.locationId, stock: p.stock, minStock: p.minStock };
    }
  });

  const save = $(() => {
    if (ui.mode === "create") {
      data.products = [
        ...data.products,
        { id: `p${Date.now()}`, ...ui.form },
      ];
    } else {
      data.products = data.products.map((p) =>
        p.id === ui.currentId ? { ...p, ...ui.form } : p,
      );
    }
    closeModal();
  });

  const del = $((id: string) => {
    data.products = data.products.filter((p) => p.id !== id);
  });

  const closeModal = $(() => {
    if (typeof document !== "undefined") {
      const cb = document.getElementById(ui.modalId) as HTMLInputElement | null;
      if (cb) cb.checked = false;
    }
  });

  return (
    <div class="space-y-4">
      <Card
        title="Products"
        actions={
          auth.user?.role === "admin" && (
            <label for={ui.modalId} class="btn btn-primary btn-sm" onClick$={startCreate}>Add Product</label>
          )
        }
      >
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <input class="input input-bordered" placeholder="Search by name or SKU" onInput$={(e) => (ui.q = (e.target as HTMLInputElement).value)} />
          <select class="select select-bordered" onChange$={(e) => (ui.category = (e.target as HTMLSelectElement).value)}>
            <option value="all">All Categories</option>
            {data.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select class="select select-bordered" onChange$={(e) => (ui.location = (e.target as HTMLSelectElement).value)}>
            <option value="all">All Locations</option>
            {data.locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <div class="flex items-center text-sm text-gray-500">
            Showing {filtered.value.length} of {data.products.length}
          </div>
        </div>
        <Table columns={columns} data={filtered.value} emptyText="No matching products" />
      </Card>

      <Modal id={ui.modalId} title={ui.mode === "create" ? "Add Product" : "Edit Product"}>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextField label="Name" name="name" value={ui.form.name} onInput$={(v) => (ui.form.name = v)} />
          <TextField label="SKU" name="sku" value={ui.form.sku} onInput$={(v) => (ui.form.sku = v)} />
          <SelectField
            label="Category"
            name="categoryId"
            value={ui.form.categoryId}
            options={data.categories.map((c) => ({ label: c.name, value: c.id }))}
            onChange$={(v) => (ui.form.categoryId = v)}
          />
          <SelectField
            label="Location"
            name="locationId"
            value={ui.form.locationId}
            options={data.locations.map((l) => ({ label: l.name, value: l.id }))}
            onChange$={(v) => (ui.form.locationId = v)}
          />
          <TextField label="Stock" name="stock" type="number" value={String(ui.form.stock)} onInput$={(v) => (ui.form.stock = Number(v) || 0)} />
          <TextField label="Minimum Stock" name="minStock" type="number" value={String(ui.form.minStock)} onInput$={(v) => (ui.form.minStock = Number(v) || 0)} />
        </div>
        <div class="modal-action">
          <button class="btn btn-primary" onClick$={save}>Save</button>
          <label for={ui.modalId} class="btn">Cancel</label>
        </div>
      </Modal>
    </div>
  );
});

export const head: DocumentHead = {
  title: "IMS - Products",
  meta: [{ name: "description", content: "Manage and view products" }],
};
