'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { DataTableFacetedFilter } from '@/components/ui/table/data-table-faceted-filter';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { Order, ordersData } from '@/constants/data';
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  IconCreditCard,
  IconCash,
  IconBuildingBank,
  IconCheck,
  IconClock,
  IconPackage,
  IconTruck,
  IconX
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function OrderListingPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const paymentOptions = [
    { label: 'Credit Card', value: 'credit_card' },
    { label: 'PayPal', value: 'paypal' },
    { label: 'Bank Transfer', value: 'bank_transfer' },
  ];

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: 'id',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Order ID' />
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
        enableHiding: false,
        meta: {
          variant: 'text',
          label: 'Order ID',
          placeholder: 'Search order ID...'
        }
      },
      {
        accessorKey: 'customer.name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Customer' />
        ),
        cell: ({ row }) => {
          const customer = row.original.customer;
          return (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{customer.name}</div>
                <div className="text-sm text-muted-foreground">{customer.email}</div>
              </div>
            </div>
          );
        },
        meta: {
          variant: 'text',
          label: 'Customer',
          placeholder: 'Search customer...'
        }
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => {
          const status = row.getValue('status') as string;

          const statusMap: Record<string, { label: string, color: string, icon: React.ReactNode }> = {
            pending: {
              label: 'Pending',
              color: 'bg-yellow-500',
              icon: <IconClock className="h-4 w-4 text-yellow-500" />
            },
            processing: {
              label: 'Processing',
              color: 'bg-blue-500',
              icon: <IconPackage className="h-4 w-4 text-blue-500" />
            },
            shipped: {
              label: 'Shipped',
              color: 'bg-purple-500',
              icon: <IconTruck className="h-4 w-4 text-purple-500" />
            },
            delivered: {
              label: 'Delivered',
              color: 'bg-green-500',
              icon: <IconCheck className="h-4 w-4 text-green-500" />
            },
            cancelled: {
              label: 'Cancelled',
              color: 'bg-red-500',
              icon: <IconX className="h-4 w-4 text-red-500" />
            },
          };

          const statusInfo = statusMap[status] || {
            label: status,
            color: 'bg-gray-500',
            icon: null
          };

          return (
            <div className="flex items-center gap-2">
              {statusInfo.icon}
              <Badge variant="outline" className="capitalize">
                {statusInfo.label}
              </Badge>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        enableSorting: true,
        enableHiding: false,
        meta: {
          variant: 'multiSelect',
          label: 'Status',
          options: statusOptions
        }
      },
      {
        accessorKey: 'total',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Total' />
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue('total'));
          const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(amount);

          return <div className="font-medium">{formatted}</div>;
        },
        enableSorting: true,
      },
      {
        accessorKey: 'payment_method',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Payment Method' />
        ),
        cell: ({ row }) => {
          const method = row.getValue('payment_method') as string;

          const methodMap: Record<string, { label: string, icon: React.ReactNode }> = {
            credit_card: {
              label: 'Credit Card',
              icon: <IconCreditCard className="h-4 w-4" />
            },
            paypal: {
              label: 'PayPal',
              icon: <IconCash className="h-4 w-4" />
            },
            bank_transfer: {
              label: 'Bank Transfer',
              icon: <IconBuildingBank className="h-4 w-4" />
            },
          };

          const methodInfo = methodMap[method] || {
            label: method,
            icon: null
          };

          return (
            <div className="flex items-center gap-2">
              {methodInfo.icon}
              <span className="capitalize">{methodInfo.label}</span>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          variant: 'multiSelect',
          label: 'Payment Method',
          options: paymentOptions
        }
      },
      {
        accessorKey: 'created_at',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Date' />
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue('created_at'));
          return <div>{format(date, 'PPP')}</div>;
        },
        sortingFn: 'datetime',
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm">
              View
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: ordersData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
} 