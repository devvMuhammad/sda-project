import {
  OrderAdapter,
  OrderData,
  OrdersResponse,
  SingleOrderResponse,
  ServerOrderResponse
} from '@/lib/adapters/order-adapter';

interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  customerName?: string;
  paymentMethod?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Orders API client that works with the adapted data
export class OrdersApiClient {
  private static BASE_URL = '/api/orders';

  // Get all orders with optional filtering
  static async getOrders(filters: OrderFilters = {}): Promise<OrdersResponse> {
    try {
      // Build the query string from filters
      const queryParams = new URLSearchParams();
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.customerName) queryParams.append('customerName', filters.customerName);
      if (filters.paymentMethod) queryParams.append('paymentMethod', filters.paymentMethod);
      if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);

      const queryString = queryParams.toString();
      const url = queryString ? `${this.BASE_URL}?${queryString}` : this.BASE_URL;

      // For demo purposes, we're mocking the API call
      // In a real app, you would fetch from the API
      const mockResponse = await this.getMockOrdersResponse(filters);

      // Use the adapter to convert server format to frontend format
      return OrderAdapter.adaptOrdersResponse(mockResponse);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  }

  // Get a specific order
  static async getOrder(id: string): Promise<SingleOrderResponse> {
    try {
      // For demo purposes, we're mocking the API call
      // In a real app, you would use fetch:
      // const response = await fetch(`${this.BASE_URL}/${id}`);

      const mockResponse = await this.getMockOrderResponse(id);

      // Use the adapter to convert server format to frontend format
      return OrderAdapter.adaptSingleOrderResponse(mockResponse);
    } catch (error) {
      console.error(`Failed to fetch order ${id}:`, error);
      throw error;
    }
  }

  // Create an order - would typically send to the server
  static async createOrder(orderData: Partial<OrderData>): Promise<SingleOrderResponse> {
    try {
      // In a real app, you would send data to the server:
      // const response = await fetch(this.BASE_URL, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData)
      // });

      // Mock a successful response
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate delay

      // Create a properly typed mock response
      const mockResponse: ServerOrderResponse = {
        success: true,
        time: new Date().toISOString(),
        message: 'Order created successfully',
        order: {
          id: `ORD-${Math.floor(Math.random() * 1000)}-${new Date().getFullYear()}`,
          customer: {
            name: 'New Customer',
            email: 'customer@example.com',
            id: 99
          },
          status: 'pending', // This is now properly typed as one of the allowed values
          products: [
            { id: 1, name: 'Test Product', quantity: 1, price: 99.99 }
          ],
          total: 99.99,
          payment_method: 'credit_card',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          shipping_address: '123 Test St, Test City, TC 12345'
        }
      };

      // Use the adapter to convert server format to frontend format
      return OrderAdapter.adaptSingleOrderResponse(mockResponse);
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }

  // Mock API response for demonstration purposes
  private static async getMockOrdersResponse(filters: OrderFilters = {}): Promise<any> {
    // In a real app, this would be an actual API call
    const { ordersData } = await import('@/constants/data');

    // Apply mock filtering
    let filteredOrders = [...ordersData];

    if (filters.status) {
      filteredOrders = filteredOrders.filter(
        order => order.status === filters.status
      );
    }

    if (filters.customerName) {
      const searchLower = filters.customerName.toLowerCase();
      filteredOrders = filteredOrders.filter(
        order => order.customer.name.toLowerCase().includes(searchLower)
      );
    }

    if (filters.paymentMethod) {
      filteredOrders = filteredOrders.filter(
        order => order.payment_method === filters.paymentMethod
      );
    }

    // Calculate pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;
    const paginatedOrders = filteredOrders.slice(offset, offset + limit);

    // Return in a proper server-response format
    const response = {
      success: true,
      time: new Date().toISOString(),
      message: 'Orders retrieved successfully',
      total_orders: filteredOrders.length,
      offset,
      limit,
      orders: paginatedOrders
    };

    return response;
  }

  // Mock single order API response
  private static async getMockOrderResponse(id: string): Promise<any> {
    const { ordersData } = await import('@/constants/data');
    const order = ordersData.find(order => order.id === id);

    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }

    // Ensure we're returning properly formatted data
    const response = {
      success: true,
      time: new Date().toISOString(),
      message: `Order with ID ${id} found`,
      order
    };

    return response;
  }
} 