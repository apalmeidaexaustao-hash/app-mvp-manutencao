import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export const clientService = {
  list: async (params = {}) => {
    const { data } = await api.get('/clients', { params });
    return data;
  },
  
  create: async (clientData) => {
    const { data } = await api.post('/clients', clientData);
    return data;
  },
  
  getById: async (id) => {
    const { data } = await api.get(`/clients/${id}`);
    return data;
  },
};

export const equipmentService = {
  list: async (params = {}) => {
    const { data } = await api.get('/equipments', { params });
    return data;
  },
  
  create: async (equipmentData) => {
    const { data } = await api.post('/equipments', equipmentData);
    return data;
  },
  
  getByClient: async (clientId) => {
    const { data } = await api.get(`/equipments/client/${clientId}`);
    return data;
  },
};

export const serviceOrderService = {
  list: async (params = {}) => {
    const { data } = await api.get('/service-orders', { params });
    return data;
  },
  
  create: async (orderData) => {
    const { data } = await api.post('/service-orders', orderData);
    return data;
  },
  
  getById: async (id) => {
    const { data } = await api.get(`/service-orders/${id}`);
    return data;
  },
  
  updateStatus: async (id, status) => {
    const { data } = await api.patch(`/service-orders/${id}/status`, { status });
    return data;
  },
  
  getMyOrders: async (params = {}) => {
    const { data } = await api.get('/service-orders/technician/me', { params });
    return data;
  },
};

export const checklistService = {
  listTemplates: async () => {
    const { data } = await api.get('/checklist-templates');
    return data;
  },
};

export default api;
