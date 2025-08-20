import { component$, Slot } from "@builder.io/qwik";

// PUBLIC_INTERFACE
export const Card = component$((props: { title?: string; actions?: any }) => {
  /** Generic card wrapper */
  return (
    <div class="card bg-base-100 shadow border border-gray-200">
      {(props.title || props.actions) && (
        <div class="card-body py-4 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <h2 class="card-title text-base">{props.title}</h2>
            <div>{props.actions}</div>
          </div>
        </div>
      )}
      <div class="card-body">
        <Slot />
      </div>
    </div>
  );
});
