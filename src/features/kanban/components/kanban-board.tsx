'use client';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { KanbanProduct, useKanbanStore } from '../utils/store';
import { hasDraggableData } from '../utils';
import {
  Announcements,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import type { Column } from './board-column';
import { BoardColumn, BoardContainer } from './board-column';
import NewSectionDialog from './new-section-dialog';
import { ProductCard } from './product-card';
// import { coordinateGetter } from "./multipleContainersKeyboardPreset";

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

export function KanbanBoard() {
  // Use the updated Kanban store with products
  const columns = useKanbanStore((state) => state.columns);
  const setColumns = useKanbanStore((state) => state.setCols);
  const pickedUpProductColumn = useRef<ColumnId | 'TODO' | 'IN_PROGRESS' | 'DONE'>(
    'TODO'
  );
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  // Updated to use products instead of tasks
  const products = useKanbanStore((state) => state.products);
  const setProducts = useKanbanStore((state) => state.setProducts);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [isMounted, setIsMounted] = useState<Boolean>(false);

  const [activeProduct, setActiveProduct] = useState<KanbanProduct | null>(null);

  // Subscribe to store updates using Observer pattern
  useEffect(() => {
    // This will force a re-render when store changes
    const unsubscribe = useKanbanStore.subscribe(() => {
      // Force update by setting state
      setIsMounted((prev) => prev);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: coordinateGetter,
    // }),
  );

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  useEffect(() => {
    useKanbanStore.persist.rehydrate();
  }, []);

  if (!isMounted) return;

  function getDraggingProductData(productId: UniqueIdentifier, columnId: ColumnId) {
    const productsInColumn = products.filter((product) => product.status === columnId);
    const productPosition = productsInColumn.findIndex((product) => product.id === Number(productId));
    const column = columns.find((col) => col.id === columnId);
    return {
      productsInColumn,
      productPosition,
      column
    };
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === 'Column') {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.title} at position: ${startColumnIdx + 1
          } of ${columnsId.length}`;
      } else if (active.data.current?.type === 'Product') {
        pickedUpProductColumn.current = active.data.current.product.status;
        const { productsInColumn, productPosition, column } = getDraggingProductData(
          active.id,
          pickedUpProductColumn.current
        );
        return `Picked up Product ${active.data.current.product.name} at position: ${productPosition + 1
          } of ${productsInColumn.length} in column ${column?.title}`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === 'Column' &&
        over.data.current?.type === 'Column'
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.title} was moved over ${over.data.current.column.title
          } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === 'Product' &&
        over.data.current?.type === 'Product'
      ) {
        const { productsInColumn, productPosition, column } = getDraggingProductData(
          over.id,
          over.data.current.product.status
        );
        if (over.data.current.product.status !== pickedUpProductColumn.current) {
          return `Product ${active.data.current.product.name
            } was moved over column ${column?.title} in position ${productPosition + 1
            } of ${productsInColumn.length}`;
        }
        return `Product was moved over position ${productPosition + 1} of ${productsInColumn.length
          } in column ${column?.title}`;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpProductColumn.current = 'TODO';
        return;
      }
      if (
        active.data.current?.type === 'Column' &&
        over.data.current?.type === 'Column'
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);

        return `Column ${active.data.current.column.title
          } was dropped into position ${overColumnPosition + 1} of ${columnsId.length
          }`;
      } else if (
        active.data.current?.type === 'Product' &&
        over.data.current?.type === 'Product'
      ) {
        const { productsInColumn, productPosition, column } = getDraggingProductData(
          over.id,
          over.data.current.product.status
        );
        if (over.data.current.product.status !== pickedUpProductColumn.current) {
          return `Product was dropped into column ${column?.title} in position ${productPosition + 1
            } of ${productsInColumn.length}`;
        }
        return `Product was dropped into position ${productPosition + 1} of ${productsInColumn.length
          } in column ${column?.title}`;
      }
      pickedUpProductColumn.current = 'TODO';
    },
    onDragCancel({ active }) {
      pickedUpProductColumn.current = 'TODO';
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    }
  };

  return (
    <DndContext
      accessibility={{
        announcements
      }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <BoardContainer>
        <SortableContext items={columnsId}>
          {columns?.map((col, index) => (
            <Fragment key={col.id}>
              <BoardColumn
                column={col}
                products={products.filter((product) => product.status === col.id)}
              />
              {index === columns?.length - 1 && (
                <div className='w-[300px]'>
                  <NewSectionDialog />
                </div>
              )}
            </Fragment>
          ))}
          {!columns.length && <NewSectionDialog />}
        </SortableContext>
      </BoardContainer>

      {'document' in window &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                products={products.filter((product) => product.status === activeColumn.id)}
              />
            )}
            {activeProduct && <ProductCard product={activeProduct} isOverlay />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === 'Column') {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === 'Product') {
      setActiveProduct(data.product);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveProduct(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === 'Column';
    if (!isActiveAColumn) return;

    const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

    const overColumnIndex = columns.findIndex((col) => col.id === overId);

    setColumns(arrayMove(columns, activeColumnIndex, overColumnIndex));
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveAProduct = activeData?.type === 'Product';
    const isOverAProduct = overData?.type === 'Product';

    if (!isActiveAProduct) return;

    // Im dropping a Product over another Product
    if (isActiveAProduct && isOverAProduct) {
      const activeIndex = products.findIndex((p) => p.id === Number(activeId));
      const overIndex = products.findIndex((p) => p.id === Number(overId));
      const activeProduct = products[activeIndex];
      const overProduct = products[overIndex];

      if (activeProduct && overProduct && activeProduct.status !== overProduct.status) {
        activeProduct.status = overProduct.status;
        setProducts(arrayMove(products, activeIndex, overIndex - 1));
      } else {
        setProducts(arrayMove(products, activeIndex, overIndex));
      }
    }

    const isOverAColumn = overData?.type === 'Column';

    // Im dropping a Product over a column
    if (isActiveAProduct && isOverAColumn) {
      const activeIndex = products.findIndex((p) => p.id === Number(activeId));
      const activeProduct = products[activeIndex];
      if (activeProduct) {
        const updatedProducts = [...products];
        updatedProducts[activeIndex] = {
          ...activeProduct,
          status: overId as ColumnId
        };
        setProducts(updatedProducts);
      }
    }
  }
}
