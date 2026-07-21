import api from '@/lib/api';

import { Product } from '@/types/product';

class ProductService {
  async getProducts(): Promise<Product[]> {
    const { data } = await api.get('/products');
    return data;
  }

  async getProduct(slug: string): Promise<Product> {
    const { data } = await api.get(`/products/${slug}`);
    return data;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const { data } = await api.get('/products/featured');
    return data;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const { data } = await api.get('/products/search', {
      params: {
        q: query,
      },
    });

    return data;
  }
}

const productService = new ProductService();

export default productService;