import { component$, Slot } from "@builder.io/qwik";

// PUBLIC_INTERFACE
export const Modal = component$((props: { id: string; title?: string }) => {
  /** DaisyUI modal wrapper. Use <label for={id}>Open</label> with hidden checkbox toggle */
  return (
    <>
      <input type="checkbox" id={props.id} class="modal-toggle" />
      <div class="modal">
        <div class="modal-box">
          {props.title && <h3 class="font-bold text-lg mb-2">{props.title}</h3>}
          <Slot />
          <div class="modal-action">
            <label for={props.id} class="btn">Close</label>
          </div>
        </div>
        <label class="modal-backdrop" for={props.id}>Close</label>
      </div>
    </>
  );
});
