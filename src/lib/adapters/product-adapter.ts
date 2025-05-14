// Define the server response interfaces for products
export interface ServerProductData {
  id: number;
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  category: string;
  updated_at: string;
}

export interface ServerProductsResponse {
  success: boolean;
  time: string;
  message: string;
  total_products: number;
  offset: number;
  limit: number;
  products: ServerProductData[];
}

export interface ServerProductResponse {
  success: boolean;
  time: string;
  message: string;
  product: ServerProductData;
}

// Define the frontend data interfaces
export interface ProductData {
  id: number;
  image: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  price: number;
  formattedPrice: string;
  category: string;
}

export interface ProductsResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  products: ProductData[];
}

export interface SingleProductResponse {
  product: ProductData;
}

// Adapter implementation
export class ProductAdapter {
  // Convert server product data to frontend format
  static adaptProduct(serverProduct: ServerProductData): ProductData {
    return {
      id: serverProduct.id,
      image: serverProduct.photo_url,
      name: serverProduct.name,
      description: serverProduct.description,
      createdAt: new Date(serverProduct.created_at),
      updatedAt: new Date(serverProduct.updated_at),
      price: serverProduct.price,
      formattedPrice: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(serverProduct.price),
      category: serverProduct.category
    };
  }

  // Convert server products response to frontend format
  static adaptProductsResponse(serverResponse: ServerProductsResponse): ProductsResponse {
    return {
      totalCount: serverResponse.total_products,
      page: Math.floor(serverResponse.offset / serverResponse.limit) + 1,
      pageSize: serverResponse.limit,
      products: serverResponse.products.map(this.adaptProduct)
    };
  }

  // Convert server single product response to frontend format
  static adaptSingleProductResponse(serverResponse: ServerProductResponse): SingleProductResponse {
    return {
      product: this.adaptProduct(serverResponse.product)
    };
  }

  // Batch convert multiple products
  static adaptProducts(serverProducts: ServerProductData[]): ProductData[] {
    return serverProducts.map(this.adaptProduct);
  }
} 