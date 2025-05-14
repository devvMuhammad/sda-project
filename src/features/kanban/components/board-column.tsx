import { KanbanProduct } from '../utils/store';
import { useDndContext, type UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import { IconGripVertical, IconPackage } from '@tabler/icons-react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ColumnActions } from './column-action';
import { ProductCard } from './product-card';

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

export type ColumnType = 'Column';

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  products: KanbanProduct[];
  isOverlay?: boolean;
}

export function BoardColumn({ column, products, isOverlay }: BoardColumnProps) {
  const productsIds = useMemo(() => {
    return products.map((product) => product.id);
  }, [products]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`
    }
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  };

  const variants = cva(
    'h-[75vh] max-h-[75vh] w-[300px] max-w-full bg-secondary flex flex-col shrink-0 snap-center shadow-sm',
    {
      variants: {
        dragging: {
          default: 'border-2 border-transparent',
          over: 'ring-1 opacity-30',
          overlay: 'ring-1 ring-primary'
        }
      }
    }
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined
      })}
    >
      <div className='py-2 px-3 border-b flex flex-row items-center justify-between sticky top-0 bg-secondary z-10'>
        <div className='flex items-center'>
          <Button
            variant='ghost'
            {...attributes}
            {...listeners}
            className='text-primary/50 relative -ml-2 h-auto cursor-grab p-1'
          >
            <span className='sr-only'>{`Move column: ${column.title}`}</span>
            <IconGripVertical size={16} />
          </Button>
          <ColumnActions id={column.id} title={column.title} />
        </div>
        <div className='text-xs font-medium flex items-center gap-1.5 ml-auto text-muted-foreground'>
          <IconPackage size={14} />
          <span>{products.length}</span>
        </div>
      </div>
      <CardContent className='flex-1 p-2 overflow-auto'>
        <SortableContext items={productsIds}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {products.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No products yet
            </div>
          )}
        </SortableContext>
      </CardContent>
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="h-full overflow-x-auto pb-4">
        <div className="inline-flex h-full px-2 space-x-4 min-w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
