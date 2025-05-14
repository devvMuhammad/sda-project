import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { KanbanBoard } from './kanban-board';
import NewProductDialog from './new-product-dialog';

export default function KanbanViewPage() {
  return (
    <PageContainer scrollable={false}>
      <div className='flex h-[calc(100vh-5rem)] flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title={`Product Kanban`} description='Manage products with drag and drop' />
          <NewProductDialog />
        </div>
        <div className="flex-1 overflow-hidden">
          <KanbanBoard />
        </div>
      </div>
    </PageContainer>
  );
}
