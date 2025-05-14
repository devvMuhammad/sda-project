import { NextRequest, NextResponse } from 'next/server';
import { DataAdapter } from '@/lib/adapters/data-adapter';
import { SupabaseClient } from '@/lib/database/supabase-client';

// Mock server data format
const mockServerOrders = [
  {
    order_id: '1',
    customer_id: 'cust-001',
    order_date: '2023-11-15T09:30:00Z',
    total_amount: 129.99,
    items: [
      {
        item_id: 'prod-1',
        quantity: 2,
        unit_price: 49.99
      },
      {
        item_id: 'prod-2',
        quantity: 1,
        unit_price: 30.01
      }
    ],
    payment_status: 1
  },
  {
    order_id: '2',
    customer_id: 'cust-002',
    order_date: '2023-11-16T14:45:00Z',
    total_amount: 74.50,
    items: [
      {
        item_id: 'prod-3',
        quantity: 1,
        unit_price: 74.50
      }
    ],
    payment_status: 0
  }
];

// GET handler for orders
export async function GET(req: NextRequest) {
  try {
    // In a real implementation, we would fetch data from database
    // const supabase = SupabaseClient.getInstance();
    // const { data, error } = await supabase.from('orders').select('*');
    // if (error) throw error;

    // Using the adapter to convert server data to frontend format
    const adaptedOrders = DataAdapter.adaptOrders(mockServerOrders);

    return NextResponse.json({
      orders: adaptedOrders,
      success: true
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', success: false },
      { status: 500 }
    );
  }
}

// POST handler for adding a new order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Here in a real app, you would validate and process the order data
    // const supabase = SupabaseClient.getInstance();
    // const { data, error } = await supabase.from('orders').insert(body);
    // if (error) throw error;

    // For demo purposes, just return success
    return NextResponse.json({
      success: true,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order', success: false },
      { status: 500 }
    );
  }
} 