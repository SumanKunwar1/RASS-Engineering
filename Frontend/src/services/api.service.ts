import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; // ✅ Make sure it ends with /api

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rass_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - Clear token and redirect to login
      localStorage.removeItem('rass_admin_token');
      localStorage.removeItem('rass_admin_auth');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password }); // ✅ This is now /api/auth/login
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('rass_admin_token', response.data.data.token);
    }
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    localStorage.removeItem('rass_admin_token');
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

// ==================== HOME PAGE API (Public) ====================
export const homeAPI = {
  getHomepageContent: async () => {
    const response = await apiClient.get('/home');
    return response.data;
  },

  getHeroSection: async () => {
    const response = await apiClient.get('/home/hero');
    return response.data;
  },

  getAboutSection: async () => {
    const response = await apiClient.get('/home/about');
    return response.data;
  },

  getServices: async () => {
    const response = await apiClient.get('/home/services');
    return response.data;
  },

  getContactCTA: async () => {
    const response = await apiClient.get('/home/contact-cta');
    return response.data;
  },
};

// ==================== ADMIN API (Protected) ====================
export const adminAPI = {
  // Get all homepage content for admin
  getHomepageContent: async () => {
    const response = await apiClient.get('/admin/home');
    return response.data;
  },

  // Update hero section
  updateHeroSection: async (heroData: any) => {
    const response = await apiClient.put('/admin/home/hero', heroData);
    return response.data;
  },

  // Update about section
  updateAboutSection: async (aboutData: any) => {
    const response = await apiClient.put('/admin/home/about', aboutData);
    return response.data;
  },

  // Update all services
  updateServices: async (services: any[]) => {
    const response = await apiClient.put('/admin/home/services', { services });
    return response.data;
  },

  // Add single service
  addService: async (serviceData: any) => {
    const response = await apiClient.post('/admin/home/services', serviceData);
    return response.data;
  },

  // Delete service
  deleteService: async (serviceId: string) => {
    const response = await apiClient.delete(`/admin/home/services/${serviceId}`);
    return response.data;
  },

  // Update contact CTA
  updateContactCTA: async (contactData: any) => {
    const response = await apiClient.put('/admin/home/contact-cta', contactData);
    return response.data;
  },
};

// ==================== CLOUDINARY / UPLOAD API (Protected) ====================
export const uploadAPI = {
  // Upload single image (base64)
  uploadImage: async (imageBase64: string, folder?: string) => {
    const response = await apiClient.post('/upload/image', {
      image: imageBase64,
      folder: folder || 'rass-engineering/general'
    });
    return response.data;
  },

  // Upload multiple images (base64 array)
  uploadImages: async (imagesBase64: string[], folder?: string) => {
    const response = await apiClient.post('/upload/images', {
      images: imagesBase64,
      folder: folder || 'rass-engineering/general'
    });
    return response.data;
  },

  // Upload image from file
  uploadImageFile: async (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append('image', file);
    if (folder) formData.append('folder', folder);

    const response = await apiClient.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Upload multiple image files
  uploadImageFiles: async (files: File[], folder?: string) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    if (folder) formData.append('folder', folder);

    const response = await apiClient.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Upload hero images
  uploadHeroImages: async (imagesBase64: string[]) => {
    const response = await apiClient.post('/upload/hero-images', {
      images: imagesBase64
    });
    return response.data;
  },

  // Upload about image
  uploadAboutImage: async (imageBase64: string) => {
    const response = await apiClient.post('/upload/about-image', {
      image: imageBase64
    });
    return response.data;
  },

  // Delete image
  deleteImage: async (imageUrl: string) => {
    const response = await apiClient.delete('/upload/image', {
      data: { imageUrl }
    });
    return response.data;
  },

  // Upload image from URL
  uploadFromUrl: async (imageUrl: string, folder?: string) => {
    const response = await apiClient.post('/upload/image-url', {
      imageUrl,
      folder: folder || 'rass-engineering/general'
    });
    return response.data;
  },

  // Get images from folder
  getImagesFromFolder: async (folderPath?: string) => {
    const path = folderPath || 'rass-engineering';
    const response = await apiClient.get(`/upload/folder/${path}`);
    return response.data;
  }
};

export default apiClient;