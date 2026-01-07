const API_BASE_URL = '/api';

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (response.status === 403) {
      throw new Error('Forbidden: Admin access required');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }
}

export const api = new ApiService();

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: { id: string; email: string; role: string } }>('/auth/login', { email, password }),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/admin/dashboard'),
};

// Vendors API
export const vendorsApi = {
  getAll: () => api.get<Vendor[]>('/admin/vendors'),
  getById: (id: string) => api.get<VendorDetail>(`/admin/vendors/${id}`),
  approve: (id: string) => api.post(`/admin/vendors/${id}/approve`),
  reject: (id: string) => api.post(`/admin/vendors/${id}/reject`),
};

// Customers API
export const customersApi = {
  getAll: () => api.get<Customer[]>('/admin/customers'),
  approve: (id: string) => api.post(`/admin/customers/${id}/approve`),
  reject: (id: string) => api.post(`/admin/customers/${id}/reject`),
};

// Products API
export const productsApi = {
  getAll: () => api.get<Product[]>('/admin/products'),
  getById: (id: string) => api.get<ProductDetail>(`/admin/products/${id}`),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get<Category[]>('/admin/categories'),
  create: (data: CreateCategoryData) => api.post<Category>('/admin/categories', data),
  update: (id: string, data: UpdateCategoryData) => api.put<Category>(`/admin/categories/${id}`, data),
  delete: (id: string) => api.delete(`/admin/categories/${id}`),
};

// Orders API
export const ordersApi = {
  getAll: () => api.get<Order[]>('/admin/orders'),
  getById: (id: string) => api.get<OrderDetail>(`/admin/orders/${id}`),
};

// Banners API
export const bannersApi = {
  getAll: () => api.get<Banner[]>('/admin/banners'),
  create: (data: FormData) => api.post<Banner>('/admin/banners', data),
  delete: (id: string) => api.delete(`/admin/banners/${id}`),
};

// Featured Products API
export const featuredProductsApi = {
  getAll: () => api.get<FeaturedProduct[]>('/admin/featured-products'),
  create: (data: CreateFeaturedProductData) => api.post<FeaturedProduct>('/admin/featured-products', data),
  delete: (id: string) => api.delete(`/admin/featured-products/${id}`),
};

// Types
export interface DashboardStats {
  totalVendors: number;
  pendingVendors: number;
  totalCustomers: number;
  pendingCustomers: number;
  totalProducts: number;
  totalOrders: number;
  recentOrders: Order[];
  recentVendors: Vendor[];
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface VendorDetail extends Vendor {
  phone?: string;
  address?: string;
  productsCount: number;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  vendorName: string;
  categoryName: string;
  moq: number;
  status: 'active' | 'inactive';
}

export interface ProductDetail extends Product {
  description: string;
  categoryPath: string[];
  variants: ProductVariant[];
  totalStock: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  isActive: boolean;
  children?: Category[];
  productsCount?: number;
}

export interface CreateCategoryData {
  name: string;
  parentId?: string;
  isActive?: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  parentId?: string;
  isActive?: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  vendorName: string;
  totalItems: number;
  status: string;
  createdAt: string;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
  statusTimeline: StatusEvent[];
}

export interface OrderItem {
  id: string;
  productName: string;
  variantAttributes: Record<string, string>;
  quantity: number;
  price: number;
}

export interface StatusEvent {
  status: string;
  timestamp: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface FeaturedProduct {
  id: string;
  productId: string;
  productName: string;
  priority: number;
}

export interface CreateFeaturedProductData {
  productId: string;
  priority: number;
}
