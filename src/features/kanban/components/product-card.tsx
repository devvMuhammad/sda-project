import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { KanbanProduct } from '../utils/store';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import { IconGripVertical, IconTag, IconCoin } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: KanbanProduct;
  isOverlay?: boolean;
}

export type ProductType = 'Product';

export interface ProductDragData {
  type: ProductType;
  product: KanbanProduct;
}

export function ProductCard({ product, isOverlay }: ProductCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: product.id,
    data: {
      type: 'Product',
      product
    } satisfies ProductDragData,
    attributes: {
      roleDescription: 'Product'
    }
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  };

  const variants = cva('mb-3', {
    variants: {
      dragging: {
        over: 'ring-2 opacity-30',
        overlay: 'ring-2 ring-primary'
      }
    }
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined
      })}
    >
      <CardHeader className='space-between border-secondary relative flex flex-row items-center border-b p-2'>
        <Button
          variant={'ghost'}
          {...attributes}
          {...listeners}
          className='text-secondary-foreground/50 -ml-1.5 h-auto cursor-grab p-1'
        >
          <span className='sr-only'>Move product</span>
          <IconGripVertical size={16} />
        </Button>
        <Badge
          variant='outline'
          className='ml-auto font-medium py-0.5 px-2 text-xs flex items-center gap-1'
        >
          <IconTag size={12} />
          {product.category}
        </Badge>
      </CardHeader>
      <CardContent className='p-3 pt-2.5'>
        <div className='mb-1 font-medium text-sm line-clamp-1'>{product.name}</div>
        <div className='text-xs text-muted-foreground line-clamp-2 mb-2'>{product.description}</div>
        <div className='flex justify-between items-center'>
          <Badge
            variant='secondary'
            className='font-semibold text-xs flex items-center gap-1'
          >
            <IconCoin size={12} />
            {product.formattedPrice}
          </Badge>
          <div className='text-xs text-muted-foreground'>
            ID: {product.id}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 