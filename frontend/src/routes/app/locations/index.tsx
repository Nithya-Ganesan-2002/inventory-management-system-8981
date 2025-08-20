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
  /** Locations management (admin only) */
  const data = useData();
  const auth = useAuth();
  const ui = useStore({
    modalId: "location-modal",
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
    const l = data.locations.find((x) => x.id === id);
    if (l) ui.form.name = l.name;
  });

  const save = $(() => {
    if (ui.mode === "create") {
      data.locations = [...data.locations, { id: `l${Date.now()}`, name: ui.form.name }];
    } else {
      data.locations = data.locations.map((l) => (l.id === ui.currentId ? { ...l, name: ui.form.name } : l));
    }
    closeModal();
  });

  const del = $((id: string) => {
    data.locations = data.locations.filter((l) => l.id !== id);
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
        title="Locations"
        actions={
          auth.user?.role === "admin" && (
            <label for={ui.modalId} class="btn btn-primary btn-sm" onClick$={startCreate}>Add Location</label>
          )
        }
      >
        <Table columns={columns as any} data={data.locations} emptyText="No locations" />
      </Card>

      <Modal id={ui.modalId} title={ui.mode === "create" ? "Add Location" : "Edit Location"}>
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
  title: "IMS - Locations",
  meta: [{ name: "description", content: "Manage storage locations" }],
};
