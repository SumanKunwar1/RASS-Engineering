import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  AdminState,
  AdminAction,
  HeroSection,
  ServiceItem,
  ProjectItem,
  BlogPost,
  AboutContent,
  ContactInfo,
  SiteSettings,
  QuoteSubmission,
  ContactSubmission,
} from '@/types/admin';

// Auth types
interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const AUTH_STORAGE_KEY = 'rass_admin_auth';
const TOKEN_STORAGE_KEY = 'rass_admin_token';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Initialize axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased timeout for image uploads
});

// Clear all auth data
const clearAuthData = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem('rass_admin_token_expiry');
};

// Store token with expiry timestamp
const storeToken = (token: string) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  // Store expiry time (1 day from now in milliseconds)
  const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
  localStorage.setItem('rass_admin_token_expiry', expiryTime.toString());
};

// Check if token is expired
const isTokenExpired = (): boolean => {
  const expiryTime = localStorage.getItem('rass_admin_token_expiry');
  if (!expiryTime) return true;
  return new Date().getTime() > parseInt(expiryTime);
};

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      clearAuthData();
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    // Handle 403 Forbidden - insufficient permissions
    if (error.response?.status === 403) {
      console.error('Access denied: Insufficient permissions');
    }
    return Promise.reject(error);
  }
);

// Initial state
const initialState: AdminState = {
  hero: {
    title: '32+ Years of',
    titleHighlight: 'Engineering Excellence',
    subtitle: 'Specialized Construction Solutions & Engineering Services',
    ctaText: 'Get Started',
    ctaLink: '/contact',
    images: [],
    buttons: []
  },
  services: [],
  projects: [],
  blog: [],
  about: {
    id: '1',
    title: 'About RASS Engineering',
    subtitle: '31+ Years of Engineering Excellence',
    description1: '',
    description2: '',
    image: '',
    managingDirector: 'Ram Kumar Shrestha'
  },
  contact: {
    phone: '',
    email: '',
    address: '',
    mapUrl: '',
    workingHours: '',
    socialLinks: {}
  },
  settings: {
    siteName: 'RASS Engineering & Construction',
    tagline: 'Building Excellence Through Innovation',
    logo: '',
    favicon: '',
    seoTitle: 'RASS Engineering | Construction & Engineering Experts',
    seoDescription: 'Professional construction and specialized engineering solutions'
  },
  quoteSubmissions: [],
  contactSubmissions: []
};

// Reducer
function adminReducer(state: AdminState, action: AdminAction): AdminState {
  const payload = action.payload as any;
  
  switch (action.type) {
    case 'SET_HERO':
      return { ...state, hero: { ...state.hero, ...payload } };

    case 'SET_ABOUT':
      return { ...state, about: { ...state.about, ...payload } };

    case 'SET_CONTACT':
      return { ...state, contact: { ...state.contact, ...payload } };

    case 'SET_SERVICES':
      return { ...state, services: payload };

    case 'ADD_SERVICE':
      return { ...state, services: [...state.services, action.payload] };

    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map((s) =>
          s.id === payload.id ? payload : s
        ),
      };

    case 'DELETE_SERVICE':
      return {
        ...state,
        services: state.services.filter((s) => s.id !== action.payload),
      };

    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === payload.id ? payload : p
        ),
      };

    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload),
      };

    case 'ADD_BLOG':
      return { ...state, blog: [...state.blog, action.payload] };

    case 'UPDATE_BLOG':
      return {
        ...state,
        blog: state.blog.map((b) =>
          b.id === payload.id ? payload : b
        ),
      };

    case 'DELETE_BLOG':
      return {
        ...state,
        blog: state.blog.filter((b) => b.id !== action.payload),
      };

    case 'SET_SETTINGS':
      return { ...state, settings: payload };

    case 'UPDATE_QUOTE_STATUS':
      return {
        ...state,
        quoteSubmissions: state.quoteSubmissions.map((q) =>
          q.id === payload.id ? { ...q, status: payload.status } : q
        ),
      };

    case 'UPDATE_CONTACT_STATUS':
      return {
        ...state,
        contactSubmissions: state.contactSubmissions.map((c) =>
          c.id === payload.id ? { ...c, status: payload.status } : c
        ),
      };

    case 'LOAD_STATE':
      return payload;

    default:
      return state;
  }
}

interface AdminContextType {
  state: AdminState;
  dispatch: React.Dispatch<AdminAction>;
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadHomepageData: () => Promise<void>;
  saveHeroSection: (heroData: any) => Promise<void>;
  saveAboutSection: (aboutData: any) => Promise<void>;
  saveServices: (services: any[]) => Promise<void>;
  saveContactCTA: (contactData: any) => Promise<void>;
  uploadImages: (files: File[], type: 'hero' | 'about' | 'general') => Promise<any[]>;
  deleteImage: (imageUrl: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAuthState();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadHomepageData();
    }
  }, [isAuthenticated]);

  const loadAuthState = () => {
    try {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      
      if (savedAuth && token) {
        // Check if token is expired
        if (isTokenExpired()) {
          clearAuthData();
          setIsAuthenticated(false);
          return;
        }
        
        const parsed = JSON.parse(savedAuth);
        setAdminUser(parsed);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to load auth state:', error);
      clearAuthData();
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        setAdminUser(user);
        setIsAuthenticated(true);
        
        // Use storeToken to save token with expiry
        storeToken(token);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        
        await loadHomepageData();
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMsg);
      console.error('Login error:', error);
      clearAuthData();
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAdminUser(null);
      setIsAuthenticated(false);
      clearAuthData();
      setIsLoading(false);
      window.location.href = '/admin/login';
    }
  };

  const loadHomepageData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get('/admin/home');
      
      if (response.data.success) {
        const data = response.data.data;
        
        // Update hero section
        if (data.hero) {
          dispatch({
            type: 'SET_HERO',
            payload: {
              title: data.hero.title || '',
              titleHighlight: data.hero.titleHighlight || '',
              subtitle: data.hero.subtitle || '',
              images: data.hero.images || [],
              buttons: data.hero.buttons || []
            }
          });
        }

        // Update services
        if (data.services) {
          dispatch({
            type: 'SET_SERVICES',
            payload: data.services
          });
        }

        // Update about section
        if (data.about) {
          const managingDirector = typeof data.about.managingDirector === 'object' 
            ? data.about.managingDirector.name || data.about.managingDirector
            : data.about.managingDirector;
            
          dispatch({
            type: 'SET_ABOUT',
            payload: {
              subtitle: data.about.subtitle || '',
              title: data.about.title || '',
              description1: data.about.description1 || '',
              description2: data.about.description2 || '',
              image: data.about.image || '',
              managingDirector: managingDirector || ''
            }
          });
        }

        // Update contact CTA
        if (data.contactCTA) {
          dispatch({
            type: 'SET_CONTACT',
            payload: {
              heading: data.contactCTA.heading || '',
              subheading: data.contactCTA.subheading || '',
              phone: data.contactCTA.phone || '',
              email: data.contactCTA.email || ''
            }
          });
        }
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load homepage data';
      setError(errorMsg);
      console.error('Failed to load homepage data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveHeroSection = async (heroData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.put('/admin/home/hero', {
        title: heroData.title,
        titleHighlight: heroData.titleHighlight,
        subtitle: heroData.subtitle,
        images: heroData.images,
        buttons: heroData.buttons
      });
      
      if (response.data.success) {
        dispatch({
          type: 'SET_HERO',
          payload: heroData
        });
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to save hero section');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to save hero section';
      setError(errorMsg);
      console.error('Save hero error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const saveAboutSection = async (aboutData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.put('/admin/home/about', {
        subtitle: aboutData.subtitle,
        title: aboutData.title,
        description1: aboutData.description1,
        description2: aboutData.description2,
        image: aboutData.image,
        managingDirector: aboutData.managingDirector
      });
      
      if (response.data.success) {
        dispatch({
          type: 'SET_ABOUT',
          payload: aboutData
        });
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to save about section');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to save about section';
      setError(errorMsg);
      console.error('Save about error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const saveServices = async (services: any[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.put('/admin/home/services', { services });
      
      if (response.data.success) {
        dispatch({
          type: 'SET_SERVICES',
          payload: services
        });
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to save services');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to save services';
      setError(errorMsg);
      console.error('Save services error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const saveContactCTA = async (contactData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.put('/admin/home/contact-cta', {
        heading: contactData.heading,
        subheading: contactData.subheading,
        phone: contactData.phone,
        email: contactData.email
      });
      
      if (response.data.success) {
        dispatch({
          type: 'SET_CONTACT',
          payload: contactData
        });
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to save contact CTA');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to save contact CTA';
      setError(errorMsg);
      console.error('Save contact CTA error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImages = async (files: File[], type: 'hero' | 'about' | 'general' = 'general') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      
      // FIXED: Use correct field name based on endpoint
      if (type === 'about') {
        // Single file for about-image endpoint
        formData.append('file', files[0]);
      } else {
        // Multiple files for hero-images endpoint
        files.forEach(file => {
          formData.append('files', file);
        });
      }

      let endpoint = '/upload/images';
      if (type === 'hero') endpoint = '/upload/hero-images';
      if (type === 'about') endpoint = '/upload/about-image';

      const response = await apiClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds for image upload
      });
      
      if (response.data.success) {
        // For about image, return as array for consistency
        if (type === 'about' && !Array.isArray(response.data.data)) {
          return [response.data.data];
        }
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to upload images');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to upload images';
      setError(errorMsg);
      console.error('Upload images error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImage = async (imageUrl: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.delete('/upload/image', {
        data: { imageUrl }
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to delete image');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to delete image';
      setError(errorMsg);
      console.error('Delete image error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminContext.Provider value={{ 
      state, 
      dispatch,
      isAuthenticated,
      adminUser,
      isLoading,
      error,
      login,
      logout,
      loadHomepageData,
      saveHeroSection,
      saveAboutSection,
      saveServices,
      saveContactCTA,
      uploadImages,
      deleteImage
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}