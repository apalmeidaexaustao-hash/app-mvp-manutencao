import axios, { AxiosInstance, AxiosError } from 'axios';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  companyName?: string;
  role?: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'CLIENT';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    companyId: string | null;
  };
}

export class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string = 'http://localhost:3000/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiResponse>) => {
        if (error.response?.status === 401) {
          this.clearToken();
        }
        
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/register', data);
    
    if (response.data.data) {
      this.setToken(response.data.data.token);
    }
    
    return response.data.data!;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/login', data);
    
    if (response.data.data) {
      this.setToken(response.data.data.token);
    }
    
    return response.data.data!;
  }

  async getMe(): Promise<any> {
    const response = await this.client.get<ApiResponse>('/auth/me');
    return response.data.data;
  }

  async refreshToken(): Promise<string> {
    const response = await this.client.post<ApiResponse<{ token: string }>>('/auth/refresh');
    
    if (response.data.data) {
      this.setToken(response.data.data.token);
      return response.data.data.token;
    }
    
    throw new Error('Failed to refresh token');
  }

  logout() {
    this.clearToken();
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.data.success;
    } catch {
      return false;
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;
