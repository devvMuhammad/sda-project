'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { DataTableFacetedFilter } from '@/components/ui/table/data-table-faceted-filter';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { Order, ordersData } from '@/constants/data';
import { OrderData } from '@/lib/adapters/order-adapter';
import { OrdersApiClient } from '../api-client';
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
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch orders using the adapter pattern
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Using the OrdersApiClient which internally uses the OrderAdapter
        const response = await OrdersApiClient.getOrders();
        if (response && response.orders) {
          setOrders(response.orders);
        } else {
          console.error('Unexpected response format:', response);
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  const columns = useMemo<ColumnDef<OrderData>[]>(
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
                <AvatarFallback>{customer.initials}</AvatarFallback>
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
          const status = row.original.status;

          return (
            <div className="flex items-center gap-2">
              {status.value === 'pending' && <IconClock className="h-4 w-4 text-yellow-500" />}
              {status.value === 'processing' && <IconPackage className="h-4 w-4 text-blue-500" />}
              {status.value === 'shipped' && <IconTruck className="h-4 w-4 text-purple-500" />}
              {status.value === 'delivered' && <IconCheck className="h-4 w-4 text-green-500" />}
              {status.value === 'cancelled' && <IconX className="h-4 w-4 text-red-500" />}
              <Badge variant="outline" className="capitalize">
                {status.label}
              </Badge>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.original.status.value);
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
        accessorKey: 'formattedTotal',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Total' />
        ),
        cell: ({ row }) => {
          return <div className="font-medium">{row.getValue('formattedTotal')}</div>;
        },
        enableSorting: true,
      },
      {
        accessorKey: 'paymentMethod',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Payment Method' />
        ),
        cell: ({ row }) => {
          const method = row.original.paymentMethod;

          return (
            <div className="flex items-center gap-2">
              {method.value === 'credit_card' && <IconCreditCard className="h-4 w-4" />}
              {method.value === 'paypal' && <IconCash className="h-4 w-4" />}
              {method.value === 'bank_transfer' && <IconBuildingBank className="h-4 w-4" />}
              <span className="capitalize">{method.label}</span>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.original.paymentMethod.value);
        },
        meta: {
          variant: 'multiSelect',
          label: 'Payment Method',
          options: paymentOptions
        }
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Date' />
        ),
        cell: ({ row }) => {
          const date = row.getValue('createdAt') as Date;
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
    data: orders,
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