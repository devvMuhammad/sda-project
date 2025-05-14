'use client';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import * as React from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useKanbanStore } from '../utils/store';
import { UniqueIdentifier } from '@dnd-kit/core';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function ColumnActions({
  title,
  id
}: {
  title: string;
  id: UniqueIdentifier;
}) {
  const [name, setName] = React.useState(title);
  const updateCol = useKanbanStore((state) => state.updateCol);
  const removeCol = useKanbanStore((state) => state.removeCol);
  const [editDisable, setIsEditDisable] = React.useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsEditDisable(!editDisable);
          updateCol(id, name);
          toast(`${title} updated to ${name}`);
        }}
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='h-7 text-sm w-32 disabled:cursor-pointer disabled:border-none disabled:opacity-100 disabled:p-0 disabled:h-auto font-medium'
          disabled={editDisable}
          ref={inputRef}
        />
      </form>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size="sm" className='ml-1 h-6 w-6 p-0'>
            <span className='sr-only'>Actions</span>
            <DotsHorizontalIcon className='h-3.5 w-3.5' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className="text-sm">
          <DropdownMenuItem
            onSelect={() => {
              setIsEditDisable(!editDisable);
              setTimeout(() => {
                inputRef.current && inputRef.current?.focus();
              }, 300);
            }}
          >
            Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className='text-red-600'
          >
            Delete Category
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this category?
            </AlertDialogTitle>
            <AlertDialogDescription>
              All products in this category will also be removed from the board.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant='destructive'
              onClick={() => {
                // yes, you have to set a timeout
                setTimeout(() => (document.body.style.pointerEvents = ''), 100);

                setShowDeleteDialog(false);
                removeCol(id);
                toast('Category deleted successfully');
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
