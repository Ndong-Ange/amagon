import { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  isPrime?: boolean;
}

export const useProducts = (category?: string, search?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First check if API is accessible
        const isApiHealthy = await ApiService.healthCheck();
        if (!isApiHealthy) {
          throw new Error('API Gateway is not accessible. Please ensure the backend services are running by executing run_project.py');
        }
        
        const data = await ApiService.getProducts({ category, search });
        
        // Transform API data to frontend format
        const transformedProducts = data.map((product: any) => ({
          id: product.id,
          title: product.name,
          price: parseFloat(product.price),
          image: product.images?.[0]?.url || 'https://via.placeholder.com/300',
          rating: 4.5, // You could add ratings to the API
          reviewCount: 100, // Mock data for now
          isPrime: true,
        }));
        
        setProducts(transformedProducts);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
        setError(errorMessage);
        console.error('Products fetch error:', errorMessage);
        
        // Fallback to empty array to prevent UI crashes
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, search]);

  return { products, loading, error };
};