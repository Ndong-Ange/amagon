import { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { mockProducts } from '../data/mockData';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  isPrime?: boolean;
  description?: string;
  category?: string;
  images?: string[];
}

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Essayer d'abord l'API, puis fallback sur les données mockées
        try {
          const data = await ApiService.getProduct(id);
          
          // Transformer les données de l'API au format frontend
          const transformedProduct: Product = {
            id: data.id,
            title: data.name,
            price: parseFloat(data.price),
            image: data.images?.[0]?.url || 'https://via.placeholder.com/400',
            rating: 4.5, // Mock pour l'instant
            reviewCount: 100, // Mock pour l'instant
            isPrime: true,
            description: data.description,
            category: data.category?.name,
            images: data.images?.map((img: any) => img.url) || [data.images?.[0]?.url || 'https://via.placeholder.com/400']
          };
          
          setProduct(transformedProduct);
        } catch (apiError) {
          // Fallback sur les données mockées si l'API échoue
          console.warn('API failed, using mock data:', apiError);
          const mockProduct = mockProducts.find(p => p.id === id);
          
          if (mockProduct) {
            setProduct({
              ...mockProduct,
              description: 'High-performance product with advanced features for optimal user experience. Energy efficient design with long battery life.',
              images: [
                mockProduct.image,
                'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              ]
            });
          } else {
            throw new Error('Product not found');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading, error };
};