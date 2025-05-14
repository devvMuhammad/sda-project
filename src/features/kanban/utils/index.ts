import { Active, DataRef, Over } from '@dnd-kit/core';
import { ColumnDragData } from '../components/board-column';
import { ProductDragData } from '../components/product-card';

type DraggableData = ColumnDragData | ProductDragData;

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === 'Column' || data?.type === 'Product') {
    return true;
  }

  return false;
}
