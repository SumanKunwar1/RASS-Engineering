import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
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
  email: string;
  name: string;
}

const AUTH_STORAGE_KEY = 'rass_admin_auth';

// Initial state with mock data that mirrors your frontend
const initialState: AdminState = {
  hero: {
    id: '1',
    title: 'Building Excellence Through Innovation',
    subtitle: 'RASS Engineering & Construction Pvt. Ltd. offers professional construction and specialized engineering solutions with 31+ years of expertise.',
    ctaText: 'Get Started',
    ctaLink: '/contact',
    images: [
      'https://res.cloudinary.com/dihev9qxc/image/upload/v1766306898/WhatsApp_Image_2025-12-21_at_14.10.49_itbaq8.jpg',
      'https://res.cloudinary.com/dihev9qxc/image/upload/v1766306898/WhatsApp_Image_2025-12-21_at_14.10.50_ihyboi.jpg',
      'https://res.cloudinary.com/dihev9qxc/image/upload/v1766306898/WhatsApp_Image_2025-12-21_at_14.10.50_1_ifq2a2.jpg',
    ],
  },
  services: [
    {
      id: '1',
      icon: 'Droplets',
      title: 'Waterproofing Solutions',
      description: 'Comprehensive waterproofing services for buildings, basements, and terraces.',
      features: ['Basement waterproofing', 'Terrace treatment', 'Wall seepage solutions'],
      image: '',
    },
    {
      id: '2',
      icon: 'Building',
      title: 'Structural Retrofitting',
      description: 'Strengthening and rehabilitation of existing structures.',
      features: ['Carbon fiber wrapping', 'Jacketing works', 'Foundation repair'],
      image: '',
    },
    {
      id: '3',
      icon: 'Wrench',
      title: 'Specialized Engineering',
      description: 'Advanced engineering solutions for complex construction challenges.',
      features: ['Soil stabilization', 'Crack treatment', 'Expansion joint treatment'],
      image: '',
    },
  ],
  projects: [
    {
      id: '1',
      title: 'Nepal Electricity Authority Building',
      description: 'Complete waterproofing and structural retrofitting of the NEA headquarters.',
      category: 'Commercial',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      location: 'Kathmandu, Nepal',
      year: '2023',
      client: 'Nepal Electricity Authority',
      features: ['Waterproofing', 'Structural repair', 'Facade treatment'],
      status: 'completed',
    },
    {
      id: '2',
      title: 'Civil Hospital Renovation',
      description: 'Major renovation including seismic retrofitting and waterproofing.',
      category: 'Healthcare',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800',
      location: 'Lalitpur, Nepal',
      year: '2024',
      client: 'Ministry of Health',
      features: ['Seismic retrofitting', 'Basement waterproofing', 'Crack repair'],
      status: 'ongoing',
    },
  ],
  blog: [
    {
      id: '1',
      title: 'The Importance of Waterproofing in Nepali Climate',
      excerpt: 'Learn why waterproofing is crucial for buildings in Nepal monsoon season.',
      content: 'Full blog content here...',
      author: 'Rabi Kumar Paudel',
      date: '2024-01-15',
      category: 'Waterproofing',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
      readTime: '5 min',
      published: true,
    },
    {
      id: '2',
      title: 'Structural Retrofitting: Protecting Your Investment',
      excerpt: 'Understanding the benefits of structural retrofitting for older buildings.',
      content: 'Full blog content here...',
      author: 'Engineering Team',
      date: '2024-02-10',
      category: 'Engineering',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
      readTime: '7 min',
      published: true,
    },
  ],
  about: {
    heroTitle: 'About RASS Engineering',
    heroSubtitle: '31+ Years of Engineering Excellence',
    mission: 'To deliver exceptional engineering and construction solutions that exceed client expectations.',
    vision: 'To be the leading construction and engineering company in Nepal, known for innovation and quality.',
    history: 'Founded in 1993, RASS Engineering has grown from a small team to one of the most trusted names in construction.',
    values: [
      { id: '1', icon: 'Award', title: 'Excellence', description: 'Committed to delivering the highest quality in every project' },
      { id: '2', icon: 'Users', title: 'Client Focus', description: 'Building lasting relationships through exceptional service' },
      { id: '3', icon: 'Target', title: 'Innovation', description: 'Embracing advanced technologies and modern techniques' },
      { id: '4', icon: 'Eye', title: 'Integrity', description: 'Operating with transparency, honesty, and professional ethics' },
    ],
    team: [
      {
        id: '1',
        name: 'Rabi Kumar Paudel',
        position: 'Managing Director',
        bio: 'With over 31 years of experience in the construction industry.',
        image: '',
        email: 'rabi@rassengineering.com',
      },
    ],
    stats: [
      { label: 'Years Experience', value: '31+' },
      { label: 'Projects Completed', value: '500+' },
      { label: 'Happy Clients', value: '300+' },
      { label: 'Team Members', value: '50+' },
    ],
  },
  contact: {
    phone: '977-01-5907561',
    email: 'rass.engineering2016@gmail.com',
    address: 'Kathmandu, Nepal',
    mapUrl: 'https://maps.google.com',
    workingHours: 'Sun - Fri: 10:00 AM - 6:00 PM',
    socialLinks: {
      facebook: 'https://facebook.com/rassengineering',
      linkedin: 'https://linkedin.com/company/rassengineering',
    },
  },
  settings: {
    siteName: 'RASS Engineering & Construction',
    tagline: 'Building Excellence Through Innovation',
    logo: '',
    favicon: '',
    seoTitle: 'RASS Engineering | Construction & Engineering Experts',
    seoDescription: 'Professional construction and specialized engineering solutions with 31+ years of expertise.',
  },
  quoteSubmissions: [
    {
      id: '1',
      name: 'John Doe',
      company: 'ABC Corp',
      email: 'john@abc.com',
      phone: '9841234567',
      serviceType: 'Waterproofing',
      message: 'Need waterproofing for our new office building.',
      createdAt: '2024-01-20',
      status: 'new',
    },
  ],
  contactSubmissions: [
    {
      id: '1',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '9841234568',
      message: 'Interested in your services for a residential project.',
      createdAt: '2024-01-22',
      status: 'new',
    },
  ],
};

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'SET_HERO':
      return { ...state, hero: action.payload };

    case 'ADD_SERVICE':
      return { ...state, services: [...state.services, action.payload] };

    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map((s) =>
          s.id === action.payload.id ? action.payload : s
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
          p.id === action.payload.id ? action.payload : p
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
          b.id === action.payload.id ? action.payload : b
        ),
      };

    case 'DELETE_BLOG':
      return {
        ...state,
        blog: state.blog.filter((b) => b.id !== action.payload),
      };

    case 'SET_ABOUT':
      return { ...state, about: action.payload };

    case 'SET_CONTACT':
      return { ...state, contact: action.payload };

    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };

    case 'UPDATE_QUOTE_STATUS':
      return {
        ...state,
        quoteSubmissions: state.quoteSubmissions.map((q) =>
          q.id === action.payload.id ? { ...q, status: action.payload.status } : q
        ),
      };

    case 'UPDATE_CONTACT_STATUS':
      return {
        ...state,
        contactSubmissions: state.contactSubmissions.map((c) =>
          c.id === action.payload.id ? { ...c, status: action.payload.status } : c
        ),
      };

    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
}

interface AdminContextType {
  state: AdminState;
  dispatch: React.Dispatch<AdminAction>;
  // Helper functions for API integration later
  saveToStorage: () => void;
  loadFromStorage: () => void;
  // Auth functions
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  login: (user: AdminUser) => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const STORAGE_KEY = 'rass_admin_data';

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load auth state on mount
  useEffect(() => {
    loadFromStorage();
    loadAuthState();
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage();
  }, [state]);

  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save admin state:', error);
    }
  };

  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      }
    } catch (error) {
      console.error('Failed to load admin state:', error);
    }
  };

  const loadAuthState = () => {
    try {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        setAdminUser(parsed);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to load auth state:', error);
    }
  };

  const login = (user: AdminUser) => {
    setAdminUser(user);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  };

  const logout = () => {
    setAdminUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AdminContext.Provider value={{ 
      state, 
      dispatch, 
      saveToStorage, 
      loadFromStorage,
      isAuthenticated,
      adminUser,
      login,
      logout 
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

// API integration hooks - Replace localStorage calls with API calls
// Example:
// export async function fetchAdminData(): Promise<AdminState> {
//   const response = await fetch('/api/admin/data');
//   return response.json();
// }
// 
// export async function saveAdminData(data: Partial<AdminState>): Promise<void> {
//   await fetch('/api/admin/data', {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
// }
