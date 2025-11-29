import axios, { AxiosInstance } from 'axios';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

let apiClient: AxiosInstance | null = null;

export function getApiClient(): AxiosInstance {
  if (!apiClient) {
    apiClient = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Redirect to login if unauthorized
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  return apiClient;
}

export function resetApiClient() {
  apiClient = null;
}

export const api = {
  // Auth endpoints
  login: (email: string, password: string) =>
    getApiClient().post('/auth/login', { email, password }),
  register: (email: string, name: string, password: string) =>
    getApiClient().post('/auth/register', { email, name, password }),
  logout: () => getApiClient().post('/auth/logout'),
  verify: () => getApiClient().get('/auth/verify'),

  // Products endpoints
  getProducts: (params?: any) =>
    getApiClient().get('/products', { params }),
  getProduct: (id: string) => getApiClient().get(`/products/${id}`),
  createProduct: (data: any) => getApiClient().post('/products', data),
  updateProduct: (id: string, data: any) =>
    getApiClient().put(`/products/${id}`, data),
  deleteProduct: (id: string) => getApiClient().delete(`/products/${id}`),

  // Categories endpoints
  getCategories: () => getApiClient().get('/categories'),
  createCategory: (data: any) => getApiClient().post('/categories', data),
  updateCategory: (id: string, data: any) =>
    getApiClient().put(`/categories/${id}`, data),
  deleteCategory: (id: string) => getApiClient().delete(`/categories/${id}`),

  // Inventory endpoints
  adjustInventory: (data: any) =>
    getApiClient().post('/inventory/adjust', data),
  stockIn: (data: any) =>
    getApiClient().post('/inventory/stock-in', data),
  stockOut: (data: any) =>
    getApiClient().post('/inventory/stock-out', data),
  getInventorySummary: () => getApiClient().get('/inventory/summary'),
  getInventoryLogs: (params?: any) =>
    getApiClient().get('/inventory/adjust', { params }),

  // Sales endpoints
  createSale: (data: any) => getApiClient().post('/sales', data),
  getSales: (params?: any) => getApiClient().get('/sales', { params }),

  // Reports endpoints
  getDailyReport: (days?: number) =>
    getApiClient().get('/reports/daily', { params: { days } }),
  getPeriodReport: (period?: string) =>
    getApiClient().get('/reports/period', { params: { period } }),
  getTopProducts: (limit?: number) =>
    getApiClient().get('/reports/top-products', { params: { limit } }),
};
