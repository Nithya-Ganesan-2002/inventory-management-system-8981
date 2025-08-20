import { createContextId, useContextProvider, useStore, useContext } from "@builder.io/qwik";

export type Category = { id: string; name: string };
export type Location = { id: string; name: string };
export type Product = {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  locationId: string;
  stock: number;
  minStock: number;
};

export type DataState = {
  products: Product[];
  categories: Category[];
  locations: Location[];
};

export const DataContext = createContextId<DataState>("data-context");

// PUBLIC_INTERFACE
export function useDataProvider(initial?: Partial<DataState>) {
  /** Provide data store with some seed demo data */
  const state = useStore<DataState>({
    categories: initial?.categories ?? [
      { id: "c1", name: "Electronics" },
      { id: "c2", name: "Stationery" },
    ],
    locations: initial?.locations ?? [
      { id: "l1", name: "Warehouse A" },
      { id: "l2", name: "Warehouse B" },
    ],
    products: initial?.products ?? [
      { id: "p1", name: "USB-C Cable", sku: "ELE-001", categoryId: "c1", locationId: "l1", stock: 12, minStock: 5 },
      { id: "p2", name: "Notebook A5", sku: "STA-045", categoryId: "c2", locationId: "l2", stock: 3, minStock: 10 },
    ],
  });
  useContextProvider(DataContext, state);
  return state;
}

// PUBLIC_INTERFACE
export function useData() {
  /** Get data store */
  return useContext(DataContext);
}
