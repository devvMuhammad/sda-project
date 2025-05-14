import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { KanbanBoard } from './kanban-board';
import NewProductDialog from './new-product-dialog';

export default function KanbanViewPage() {
  return (
    <PageContainer>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title={`Product Kanban`} description='Manage products with drag and drop' />
          <NewProductDialog />
        </div>
        <KanbanBoard />
      </div>
    </PageContainer>
  );
}
