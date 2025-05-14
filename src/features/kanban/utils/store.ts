import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { persist } from 'zustand/middleware';
import { UniqueIdentifier } from '@dnd-kit/core';
import { Column } from '../components/board-column';
import { CATEGORY_OPTIONS } from '@/features/products/components/product-tables/options';
import { ProductData } from '@/lib/adapters/product-adapter';

export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

const defaultCols = [
  {
    id: 'TODO' as const,
    title: 'To Review'
  },
  {
    id: 'IN_PROGRESS' as const,
    title: 'In Development'
  },
  {
    id: 'DONE' as const,
    title: 'Completed'
  }
] satisfies Column[];

export type ColumnId = (typeof defaultCols)[number]['id'];

// Extending the ProductData type for kanban functionality
export type KanbanProduct = ProductData & {
  status: Status;
};

export type State = {
  products: KanbanProduct[];
  columns: Column[];
  draggedProduct: string | null;
};

// Create mock kanban products based on ProductData structure
const initialProducts: KanbanProduct[] = [
  {
    id: 1,
    image: 'https://api.slingacademy.com/public/sample-products/1.png',
    name: 'Mobile App v2.0',
    description: 'A premium mobile application with advanced features',
    createdAt: new Date(),
    updatedAt: new Date(),
    price: 999.99,
    formattedPrice: '$999.99',
    category: 'Electronics',
    status: 'TODO'
  },
  {
    id: 2,
    image: 'https://api.slingacademy.com/public/sample-products/2.png',
    name: 'Website Redesign',
    description: 'A complete overhaul of the company website',
    createdAt: new Date(),
    updatedAt: new Date(),
    price: 1299.99,
    formattedPrice: '$1,299.99',
    category: 'Furniture',
    status: 'TODO'
  }
];

export type Actions = {
  addProduct: (product: Omit<KanbanProduct, 'id' | 'status'>) => void;
  addCol: (title: string) => void;
  dragProduct: (id: string | null) => void;
  removeProduct: (id: number) => void;
  removeCol: (id: UniqueIdentifier) => void;
  setProducts: (updatedProducts: KanbanProduct[]) => void;
  setCols: (cols: Column[]) => void;
  updateCol: (id: UniqueIdentifier, newName: string) => void;
  // Observer pattern methods
  subscribe: (callback: () => void) => () => void;
  getState: () => State;
};

// Implement the Observer Pattern with subscribers
let subscribers: (() => void)[] = [];

export const useKanbanStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      columns: defaultCols,
      draggedProduct: null,

      // Method to add a product
      addProduct: (product) =>
        set((state) => {
          const newProduct: KanbanProduct = {
            ...product,
            id: Math.max(0, ...state.products.map(p => p.id)) + 1,
            status: 'TODO'
          };
          const newState = {
            products: [...state.products, newProduct]
          };
          // Notify subscribers about the state change
          subscribers.forEach(callback => callback());
          return newState;
        }),

      // Method to update a column
      updateCol: (id: UniqueIdentifier, newName: string) =>
        set((state) => {
          const newState = {
            columns: state.columns.map((col) =>
              col.id === id ? { ...col, title: newName } : col
            )
          };
          subscribers.forEach(callback => callback());
          return newState;
        }),

      // Method to add a column
      addCol: (title: string) =>
        set((state) => {
          const newState = {
            columns: [
              ...state.columns,
              { title, id: state.columns.length ? title.toUpperCase() : 'TODO' }
            ]
          };
          subscribers.forEach(callback => callback());
          return newState;
        }),

      // Method to track dragged product
      dragProduct: (id: string | null) => {
        set({ draggedProduct: id });
        subscribers.forEach(callback => callback());
      },

      // Method to remove a product
      removeProduct: (id: number) =>
        set((state) => {
          const newState = {
            products: state.products.filter((product) => product.id !== id)
          };
          subscribers.forEach(callback => callback());
          return newState;
        }),

      // Method to remove a column
      removeCol: (id: UniqueIdentifier) =>
        set((state) => {
          const newState = {
            columns: state.columns.filter((col) => col.id !== id)
          };
          subscribers.forEach(callback => callback());
          return newState;
        }),

      // Method to set products
      setProducts: (newProducts: KanbanProduct[]) => {
        set({ products: newProducts });
        subscribers.forEach(callback => callback());
      },

      // Method to set columns
      setCols: (newCols: Column[]) => {
        set({ columns: newCols });
        subscribers.forEach(callback => callback());
      },

      // Observer pattern method to subscribe to state changes
      subscribe: (callback: () => void) => {
        subscribers.push(callback);
        return () => {
          subscribers = subscribers.filter(cb => cb !== callback);
        };
      },

      // Method to get current state
      getState: () => get()
    }),
    { name: 'kanban-product-store', skipHydration: true }
  )
);
