import { component$, useStore, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Card } from "~/components/ui/Card";
import { Table } from "~/components/ui/Table";
import { Modal } from "~/components/ui/Modal";
import { TextField } from "~/components/ui/FormFields";
import { useData } from "~/stores/data";
import { useAuth } from "~/stores/auth";

// PUBLIC_INTERFACE
export default component$(() => {
  /** Categories management (admin only) */
  const data = useData();
  const auth = useAuth();
  const ui = useStore({
    modalId: "category-modal",
    mode: "create" as "create" | "edit",
    currentId: "",
    form: { name: "" },
  });

  const startCreate = $(() => {
    ui.mode = "create";
    ui.currentId = "";
    ui.form = { name: "" };
  });

  const startEdit = $((id: string) => {
    ui.mode = "edit";
    ui.currentId = id;
    const c = data.categories.find((x) => x.id === id);
    if (c) ui.form.name = c.name;
  });

  const save = $(() => {
    if (ui.mode === "create") {
      data.categories = [...data.categories, { id: `c${Date.now()}`, name: ui.form.name }];
    } else {
      data.categories = data.categories.map((c) => (c.id === ui.currentId ? { ...c, name: ui.form.name } : c));
    }
    closeModal();
  });

  const del = $((id: string) => {
    data.categories = data.categories.filter((c) => c.id !== id);
    // Optionally reassign products' categoryId, but we keep it simple here.
  });

  const closeModal = $(() => {
    if (typeof document !== "undefined") {
      const cb = document.getElementById(ui.modalId) as HTMLInputElement | null;
      if (cb) cb.checked = false;
    }
  });

  const columns = [
    { key: "name", header: "Name" },
    {
      key: "actions",
      header: "Actions",
      render: (row: any) =>
        auth.user?.role === "admin" ? (
          <div class="flex gap-2">
            <label for={ui.modalId} class="btn btn-xs" onClick$={() => startEdit(row.id)}>Edit</label>
            <button class="btn btn-xs btn-error" onClick$={() => del(row.id)}>Delete</button>
          </div>
        ) : null,
    },
  ];

  return (
    <div class="space-y-4">
      <Card
        title="Categories"
        actions={
          auth.user?.role === "admin" && (
            <label for={ui.modalId} class="btn btn-primary btn-sm" onClick$={startCreate}>Add Category</label>
          )
        }
      >
        <Table columns={columns as any} data={data.categories} emptyText="No categories" />
      </Card>

      <Modal id={ui.modalId} title={ui.mode === "create" ? "Add Category" : "Edit Category"}>
        <TextField label="Name" name="name" value={ui.form.name} onInput$={(v) => (ui.form.name = v)} />
        <div class="modal-action">
          <button class="btn btn-primary" onClick$={save}>Save</button>
          <label for={ui.modalId} class="btn">Cancel</label>
        </div>
      </Modal>
    </div>
  );
});

export const head: DocumentHead = {
  title: "IMS - Categories",
  meta: [{ name: "description", content: "Manage product categories" }],
};
