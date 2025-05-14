import { Product } from '@/constants/data';
import { fakeProducts } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { ProductTable } from './product-tables';
import { columns } from './product-tables/columns';
import { ProductAdapter } from '@/lib/adapters/product-adapter';
import { ProductsApiClient } from '../api-client';

type ProductListingPage = {};

export default async function ProductListingPage({ }: ProductListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const categories = searchParamsCache.get('category');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories })
  };

  // Using the adapter pattern here by accessing the API client
  // The API client internally uses ProductAdapter to convert server format to frontend format
  const productsResponse = await ProductsApiClient.getProducts(filters);

  // Now we can destructure and use the properly formatted data
  const { totalCount, products } = productsResponse;

  return (
    <ProductTable
      data={products}
      totalItems={totalCount}
      columns={columns}
    />
  );
}
