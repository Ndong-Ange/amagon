import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../product/ProductCard';
import { CartProvider } from '../../context/CartContext';

const mockProduct = {
  id: '1',
  title: 'Test Product',
  price: 99.99,
  image: 'test-image.jpg',
  rating: 4.5,
  reviewCount: 100,
  isPrime: true
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <CartProvider>
        {component}
      </CartProvider>
    </BrowserRouter>
  );
};

describe('ProductCard', () => {
  test('renders product information correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('(100)')).toBeInTheDocument();
    expect(screen.getByText('Prime')).toBeInTheDocument();
  });

  test('adds product to cart when button is clicked', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);
    
    // You would check if the product was added to cart here
    // This would require accessing the cart context in the test
  });

  test('navigates to product detail page when clicked', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const productLink = screen.getByRole('link');
    expect(productLink).toHaveAttribute('href', '/product/1');
  });
});