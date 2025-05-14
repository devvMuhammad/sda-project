import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

  const variants = cva('mb-2 relative', {
    variants: {
      dragging: {
        over: 'ring-1 opacity-30',
        overlay: 'ring-1 ring-primary'
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
      <CardContent className='p-2 pl-6'>
        <Button
          variant='ghost'
          {...attributes}
          {...listeners}
          className='absolute left-0.5 top-2 h-5 w-5 p-0 cursor-grab text-muted-foreground/50 hover:text-muted-foreground hover:bg-secondary'
        >
          <span className='sr-only'>Move product</span>
          <IconGripVertical size={14} />
        </Button>

        <div className="flex justify-between items-start">
          <div className='mb-1 font-medium text-sm line-clamp-1 pr-1 flex-1'>{product.name}</div>
          <Badge
            variant='outline'
            className='font-medium py-0.5 px-1.5 text-xs flex items-center gap-1 ml-1 shrink-0'
          >
            <IconTag size={10} />
            {product.category}
          </Badge>
        </div>

        <div className='text-xs text-muted-foreground line-clamp-2 mb-1.5'>{product.description}</div>

        <div className='flex justify-between items-center'>
          <Badge
            variant='secondary'
            className='font-semibold text-xs flex items-center gap-1'
          >
            <IconCoin size={10} />
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