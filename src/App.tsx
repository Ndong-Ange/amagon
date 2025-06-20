import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import OrdersPage from './pages/OrdersPage';
import NotFoundPage from './pages/NotFoundPage';
import SellerLoginPage from './pages/SellerLoginPage';
import SellerRegisterPage from './pages/SellerRegisterPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SearchResults from './components/search/SearchResults';
import ErrorBoundary from './components/common/ErrorBoundary';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Routes vendeur */}
              <Route path="/seller/login" element={<SellerLoginPage />} />
              <Route path="/seller/register" element={<SellerRegisterPage />} />
              <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
              
              {/* Routes admin */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              
              {/* Routes principales avec layout */}
              <Route path="/*" element={
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      <Route path="/search" element={<SearchResults />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/account" element={<AccountPage />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              } />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;