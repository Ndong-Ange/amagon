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

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Products
  static async getProducts(params?: { category?: string; search?: string }) {
    const searchParams = new URLSearchParams(params).toString();
    return this.request(`/products/?${searchParams}`);
  }

  static async getProduct(id: string) {
    return this.request(`/products/${id}/`);
  }

  // Orders
  static async createOrder(orderData: any) {
    return this.request('/orders/create/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Auth
  static async login(email: string, password: string) {
    return this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(userData: any) {
    return this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }
}