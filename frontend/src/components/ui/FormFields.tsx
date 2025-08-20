import { component$, $ } from "@builder.io/qwik";
import type { QRL } from "@builder.io/qwik";

type InputHandler = QRL<(value: string) => void>;

// PUBLIC_INTERFACE
export const TextField = component$((props: {
  label: string;
  value?: string;
  name: string;
  placeholder?: string;
  type?: string;
  onInput$?: InputHandler;
  required?: boolean;
}) => {
  /** Text input field */
  const handleInput$ = $((ev: Event) => {
    const val = (ev.target as HTMLInputElement).value;
    // call only if provided
    props.onInput$ && props.onInput$(val);
  });

  return (
    <label class="form-control w-full">
      <div class="label"><span class="label-text">{props.label}</span></div>
      <input
        class="input input-bordered w-full"
        value={props.value}
        name={props.name}
        type={props.type ?? "text"}
        placeholder={props.placeholder}
        required={props.required}
        onInput$={handleInput$}
      />
    </label>
  );
});

type ChangeHandler = QRL<(value: string) => void>;

// PUBLIC_INTERFACE
export const SelectField = component$((props: {
  label: string;
  name: string;
  options: { label: string; value: string }[];
  value?: string;
  onChange$?: ChangeHandler;
}) => {
  /** Select field */
  const handleChange$ = $((ev: Event) => {
    const val = (ev.target as HTMLSelectElement).value;
    props.onChange$ && props.onChange$(val);
  });

  return (
    <label class="form-control w-full">
      <div class="label"><span class="label-text">{props.label}</span></div>
      <select
        name={props.name}
        class="select select-bordered"
        value={props.value}
        onChange$={handleChange$}
      >
        {props.options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
});
