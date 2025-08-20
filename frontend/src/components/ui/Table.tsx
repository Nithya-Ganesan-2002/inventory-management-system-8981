import { component$, Slot } from "@builder.io/qwik";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => any;
};

// PUBLIC_INTERFACE
export const Table = component$(
  <T,>(props: { columns: Column<T>[]; data: T[]; emptyText?: string }) => {
    /** Generic table to display records */
    return (
      <div class="overflow-x-auto">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              {props.columns.map((c) => (
                <th key={String(c.key)} class="whitespace-nowrap">{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.data.length === 0 && (
              <tr>
                <td class="text-center py-6 text-gray-500" colSpan={props.columns.length}>
                  {props.emptyText ?? "No records found"}
                </td>
              </tr>
            )}
            {props.data.map((row: any, idx) => (
              <tr key={idx}>
                {props.columns.map((c) => (
                  <td key={String(c.key)}>
                    {c.render ? c.render(row) : String(row[c.key as any] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Slot />
      </div>
    );
  },
);
