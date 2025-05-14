import { OrderData } from '@/lib/adapters/data-adapter';

// Orders API client that works with the adapted data
export class OrdersApiClient {
  private static BASE_URL = '/api/orders';

  // Get all orders
  static async getOrders(): Promise<OrderData[]> {
    try {
      const response = await fetch(this.BASE_URL);

      if (!response.ok) {
        throw new Error(`Error fetching orders: ${response.statusText}`);
      }

      const data = await response.json();
      return data.orders;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  }

  // Get a specific order
  static async getOrder(id: string): Promise<OrderData> {
    try {
      const response = await fetch(`${this.BASE_URL}?id=${id}`);

      if (!response.ok) {
        throw new Error(`Error fetching order: ${response.statusText}`);
      }

      const data = await response.json();
      return data.order;
    } catch (error) {
      console.error(`Failed to fetch order ${id}:`, error);
      throw error;
    }
  }

  // Create an order
  static async createOrder(orderData: Omit<OrderData, 'id'>): Promise<OrderData> {
    try {
      const response = await fetch(this.BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`Error creating order: ${response.statusText}`);
      }

      const data = await response.json();
      return data.order;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }
} 