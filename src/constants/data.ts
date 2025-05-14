import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Product',
    url: '/dashboard/product',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  // orders
  {
    title: 'Orders',
    url: '/dashboard/orders',
    icon: 'orders',
    shortcut: ['o', 'o'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  },
  {
    title: 'Kanban',
    url: '/dashboard/kanban',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    id: number;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  products: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  payment_method: 'credit_card' | 'paypal' | 'bank_transfer';
  created_at: string;
  updated_at: string;
  shipping_address: string;
}

export const ordersData: Order[] = [
  {
    id: "ORD-001-2023",
    customer: {
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      id: 1
    },
    status: "delivered",
    products: [
      { id: 1, name: "Premium Headphones", quantity: 1, price: 299 }
    ],
    total: 299,
    payment_method: "credit_card",
    created_at: "2023-10-15T10:00:00.000Z",
    updated_at: "2023-10-16T15:30:00.000Z",
    shipping_address: "123 Main St, New York, NY 10001"
  },
  {
    id: "ORD-002-2023",
    customer: {
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
      id: 2
    },
    status: "shipped",
    products: [
      { id: 2, name: "Smartphone Case", quantity: 2, price: 19.50 }
    ],
    total: 39,
    payment_method: "paypal",
    created_at: "2023-10-16T14:30:00.000Z",
    updated_at: "2023-10-17T09:15:00.000Z",
    shipping_address: "456 Park Ave, Boston, MA 02115"
  },
  {
    id: "ORD-003-2023",
    customer: {
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      id: 3
    },
    status: "processing",
    products: [
      { id: 3, name: "Wireless Charger", quantity: 1, price: 49 },
      { id: 4, name: "Bluetooth Speaker", quantity: 1, price: 129 }
    ],
    total: 178,
    payment_method: "credit_card",
    created_at: "2023-10-18T16:45:00.000Z",
    updated_at: "2023-10-18T16:45:00.000Z",
    shipping_address: "789 Ocean Dr, Miami, FL 33139"
  },
  {
    id: "ORD-004-2023",
    customer: {
      name: "William Kim",
      email: "will@email.com",
      id: 4
    },
    status: "pending",
    products: [
      { id: 5, name: "Smart Watch", quantity: 1, price: 199 }
    ],
    total: 199,
    payment_method: "bank_transfer",
    created_at: "2023-10-20T11:20:00.000Z",
    updated_at: "2023-10-20T11:20:00.000Z",
    shipping_address: "101 Tech Blvd, San Francisco, CA 94107"
  },
  {
    id: "ORD-005-2023",
    customer: {
      name: "Sofia Davis",
      email: "sofia.davis@email.com",
      id: 5
    },
    status: "cancelled",
    products: [
      { id: 6, name: "Laptop Sleeve", quantity: 1, price: 39 }
    ],
    total: 39,
    payment_method: "credit_card",
    created_at: "2023-10-19T09:00:00.000Z",
    updated_at: "2023-10-21T14:10:00.000Z",
    shipping_address: "222 Highland Ave, Seattle, WA 98101"
  }
];
