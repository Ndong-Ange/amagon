// API service for making HTTP requests
export const API_BASE_URL = 'http://localhost:8000/api';

export class ApiService {
  private static async request(endpoint: string, options?: RequestInit) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        return response.text();
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Unable to connect to API server at ${API_BASE_URL}. Please ensure the API Gateway is running on port 8000.`);
      }
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Products
  static async getProducts(params?: { category?: string; search?: string }) {
    try {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.append('category', params.category);
      if (params?.search) searchParams.append('search', params.search);
      
      const queryString = searchParams.toString();
      return this.request(`/products/${queryString ? '?' + queryString : ''}`);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  }

  static async getProduct(id: string) {
    try {
      return this.request(`/products/${id}/`);
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw error;
    }
  }

  // Orders
  static async createOrder(orderData: any) {
    try {
      return this.request('/orders/create/', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }

  // Auth
  static async login(email: string, password: string) {
    try {
      return this.request('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  static async register(userData: any) {
    try {
      return this.request('/auth/register/', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  // Health check method to verify API connectivity
  static async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/admin/`, {
        method: 'HEAD',
        mode: 'no-cors'
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}