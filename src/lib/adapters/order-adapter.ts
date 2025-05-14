// Define the server response interfaces for orders
export interface ServerOrderProductData {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface ServerOrderCustomerData {
  name: string;
  email: string;
  id: number;
}

export interface ServerOrderData {
  id: string;
  customer: ServerOrderCustomerData;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  products: ServerOrderProductData[];
  total: number;
  payment_method: 'credit_card' | 'paypal' | 'bank_transfer';
  created_at: string;
  updated_at: string;
  shipping_address: string;
}

export interface ServerOrdersResponse {
  success: boolean;
  time: string;
  message: string;
  total_orders: number;
  offset: number;
  limit: number;
  orders: ServerOrderData[];
}

export interface ServerOrderResponse {
  success: boolean;
  time: string;
  message: string;
  order: ServerOrderData;
}

// Define the frontend data interfaces
export interface OrderProductData {
  id: number;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderCustomerData {
  id: number;
  name: string;
  email: string;
  initials: string;
}

export interface OrderData {
  id: string;
  customer: OrderCustomerData;
  status: {
    value: string;
    label: string;
    color: string;
  };
  products: OrderProductData[];
  total: number;
  formattedTotal: string;
  paymentMethod: {
    value: string;
    label: string;
  };
  createdAt: Date;
  updatedAt: Date;
  shippingAddress: string;
}

export interface OrdersResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  orders: OrderData[];
}

export interface SingleOrderResponse {
  order: OrderData;
}

// Adapter implementation
export class OrderAdapter {
  // Convert server order product data to frontend format
  private static adaptOrderProduct(product: ServerOrderProductData): OrderProductData {
    return {
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      subtotal: product.quantity * product.price
    };
  }

  // Convert server order customer data to frontend format
  private static adaptOrderCustomer(customer: ServerOrderCustomerData): OrderCustomerData {
    // Create initials from customer name (e.g. "John Doe" -> "JD")
    const nameParts = customer.name.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('');

    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      initials
    };
  }

  // Helper method to map status values to display values
  private static getStatusInfo(status: string): { value: string; label: string; color: string } {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'Pending', color: 'bg-yellow-500' },
      processing: { label: 'Processing', color: 'bg-blue-500' },
      shipped: { label: 'Shipped', color: 'bg-purple-500' },
      delivered: { label: 'Delivered', color: 'bg-green-500' },
      cancelled: { label: 'Cancelled', color: 'bg-red-500' }
    };

    const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-500' };

    return {
      value: status,
      label: statusInfo.label,
      color: statusInfo.color
    };
  }

  // Helper method to map payment method values to display values
  private static getPaymentMethodInfo(method: string): { value: string; label: string } {
    const methodMap: Record<string, string> = {
      credit_card: 'Credit Card',
      paypal: 'PayPal',
      bank_transfer: 'Bank Transfer'
    };

    return {
      value: method,
      label: methodMap[method] || method
    };
  }

  // Convert server order data to frontend format
  static adaptOrder(serverOrder: ServerOrderData): OrderData {
    return {
      id: serverOrder.id,
      customer: OrderAdapter.adaptOrderCustomer(serverOrder.customer),
      status: OrderAdapter.getStatusInfo(serverOrder.status),
      products: serverOrder.products.map(product => OrderAdapter.adaptOrderProduct(product)),
      total: serverOrder.total,
      formattedTotal: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(serverOrder.total),
      paymentMethod: OrderAdapter.getPaymentMethodInfo(serverOrder.payment_method),
      createdAt: new Date(serverOrder.created_at),
      updatedAt: new Date(serverOrder.updated_at),
      shippingAddress: serverOrder.shipping_address
    };
  }

  // Convert server orders response to frontend format
  static adaptOrdersResponse(serverResponse: ServerOrdersResponse): OrdersResponse {
    return {
      totalCount: serverResponse.total_orders,
      page: Math.floor(serverResponse.offset / serverResponse.limit) + 1,
      pageSize: serverResponse.limit,
      orders: serverResponse.orders.map(order => OrderAdapter.adaptOrder(order))
    };
  }

  // Convert server single order response to frontend format
  static adaptSingleOrderResponse(serverResponse: ServerOrderResponse): SingleOrderResponse {
    return {
      order: OrderAdapter.adaptOrder(serverResponse.order)
    };
  }

  // Batch convert multiple orders
  static adaptOrders(serverOrders: ServerOrderData[]): OrderData[] {
    return serverOrders.map(order => OrderAdapter.adaptOrder(order));
  }
} 