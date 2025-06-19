import React from 'react';
import ProductCard from '../product/ProductCard';
import { useProducts } from '../../hooks/useProducts';

interface ProductGridProps {
  title: string;
  viewAllLink?: string;
  category?: string;
  limit?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  title, 
  viewAllLink, 
  category,
  limit
}) => {
  const { products, loading, error } = useProducts(category);
  
  if (loading) {
    return (
      <section className="my-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: limit || 6 }).map((_, index) => (
            <div key={index} className="bg-white p-4 rounded shadow-product animate-pulse">
              <div className="bg-gray-300 h-40 mb-3 rounded"></div>
              <div className="bg-gray-300 h-4 mb-2 rounded"></div>
              <div className="bg-gray-300 h-4 w-2/3 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="my-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">Error loading products: {error}</p>
        </div>
      </section>
    );
  }

  const displayProducts = limit ? products.slice(0, limit) : products;

  return (
    <section className="my-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {viewAllLink && (
          <a href={viewAllLink} className="text-amazon-teal hover:underline text-sm">
            View all
          </a>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {displayProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;