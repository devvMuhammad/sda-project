// Define the server response interfaces
interface ServerUserData {
  user_id: string;
  user_name: string;
  user_email: string;
  created_at: string;
  last_login: string;
  account_status: number;
}

interface ServerOrderData {
  order_id: string;
  customer_id: string;
  order_date: string;
  total_amount: number;
  items: Array<{
    item_id: string;
    quantity: number;
    unit_price: number;
  }>;
  payment_status: number;
}

// Define the frontend data interfaces
export interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
}

export interface OrderData {
  id: string;
  customerId: string;
  date: Date;
  total: number;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  isPaid: boolean;
}

// Adapter implementation
export class DataAdapter {
  // Convert server user data to frontend format
  static adaptUser(serverUser: ServerUserData): UserData {
    return {
      id: serverUser.user_id,
      name: serverUser.user_name,
      email: serverUser.user_email,
      createdAt: new Date(serverUser.created_at),
      lastLogin: new Date(serverUser.last_login),
      isActive: serverUser.account_status === 1
    };
  }

  // Convert server order data to frontend format
  static adaptOrder(serverOrder: ServerOrderData): OrderData {
    return {
      id: serverOrder.order_id,
      customerId: serverOrder.customer_id,
      date: new Date(serverOrder.order_date),
      total: serverOrder.total_amount,
      items: serverOrder.items.map(item => ({
        id: item.item_id,
        quantity: item.quantity,
        price: item.unit_price,
        subtotal: item.quantity * item.unit_price
      })),
      isPaid: serverOrder.payment_status === 1
    };
  }

  // Batch convert multiple items
  static adaptUsers(serverUsers: ServerUserData[]): UserData[] {
    return serverUsers.map(this.adaptUser);
  }

  static adaptOrders(serverOrders: ServerOrderData[]): OrderData[] {
    return serverOrders.map(this.adaptOrder);
  }
} 