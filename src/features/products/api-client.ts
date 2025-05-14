import {
  ProductAdapter,
  ProductData,
  ProductsResponse,
  SingleProductResponse
} from '@/lib/adapters/product-adapter';

interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categories?: string;
}

// Products API client that works with the adapted data
export class ProductsApiClient {
  private static BASE_URL = '/api/products';

  // Get all products with pagination and filtering
  static async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    try {
      // Build the query string from filters
      const queryParams = new URLSearchParams();
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.categories) queryParams.append('categories', filters.categories);

      const queryString = queryParams.toString();
      const url = queryString ? `${this.BASE_URL}?${queryString}` : this.BASE_URL;

      // For demo purposes, we're mocking the API call
      // In a real app, you would use fetch instead
      const mockResponse = await this.getMockProductsResponse(filters);

      // Use the adapter to convert server format to frontend format
      return ProductAdapter.adaptProductsResponse(mockResponse);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  }

  // Get a specific product
  static async getProduct(id: number): Promise<SingleProductResponse> {
    try {
      // For demo purposes, we're mocking the API call
      // In a real app, you would use fetch:
      // const response = await fetch(`${this.BASE_URL}/${id}`);

      const mockResponse = await this.getMockProductResponse(id);

      // Use the adapter to convert server format to frontend format
      return ProductAdapter.adaptSingleProductResponse(mockResponse);
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw error;
    }
  }

  // Mock API response for demonstration purposes
  private static async getMockProductsResponse(filters: ProductFilters = {}): Promise<any> {
    // This would come from a real API in a production app
    const { fakeProducts } = await import('@/constants/mock-api');
    return await fakeProducts.getProducts({
      page: filters.page || 1,
      limit: filters.limit || 10,
      categories: filters.categories,
      search: filters.search
    });
  }

  // Mock single product API response
  private static async getMockProductResponse(id: number): Promise<any> {
    const { fakeProducts } = await import('@/constants/mock-api');
    return await fakeProducts.getProductById(id);
  }
} 