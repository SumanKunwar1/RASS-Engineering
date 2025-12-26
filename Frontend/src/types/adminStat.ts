import { AdminState, AboutContent, CompanyValue, TeamMember, StatItem, AdminAction } from './admin';

// Default Company Values
const defaultValues: CompanyValue[] = [
  {
    id: '1',
    icon: 'Award',
    title: 'Excellence',
    description: 'Committed to delivering the highest quality in every project we undertake'
  },
  {
    id: '2',
    icon: 'Users',
    title: 'Client Focus',
    description: 'Building lasting relationships through exceptional service and trust'
  },
  {
    id: '3',
    icon: 'Target',
    title: 'Innovation',
    description: 'Embracing advanced technologies and modern construction techniques'
  },
  {
    id: '4',
    icon: 'Eye',
    title: 'Integrity',
    description: 'Operating with transparency, honesty, and professional ethics'
  }
];

// Default Stats
const defaultStats: StatItem[] = [
  { id: '1', value: '32+', label: 'Years of Experience' },
  { id: '2', value: '500+', label: 'Completed Projects' },
];

// Default Team Members (can be empty initially)
const defaultTeam: TeamMember[] = [];

// Default About Content
export const defaultAboutContent: AboutContent = {
  id: 'about-main',
  
  // Hero Section
  heroTitle: 'About RASS Engineering',
  heroSubtitle: "Building Nepal's infrastructure with precision, dedication, and engineering excellence since 2050 B.S.",
  
  // Mission & Vision
  mission: 'To deliver world-class engineering and construction solutions that exceed client expectations while maintaining the highest standards of safety, quality, and environmental responsibility. We strive to be the most trusted partner for specialized construction services in Nepal.',
  vision: "To be recognized as Nepal's leading engineering and construction company, known for innovation, reliability, and sustainable practices. We envision a future where every structure we work on stands as a testament to engineering excellence and durability.",
  
  // Story Section
  storyTitle: 'Our Story',
  history: `Founded in 2050 B.S., RASS Engineering & Construction Pvt. Ltd. has been a pioneer in specialized construction solutions across Nepal. What started as a vision to provide world-class engineering services has grown into a trusted name in the industry.

Under the exceptional leadership of Rabi Kumar Paudel, who served as Director from 2050 B.S. to 2073 B.S. and has been our Managing Director since 2073 B.S., we have successfully completed over 500 projects across various sectors.

Our commitment to quality, innovation, and client satisfaction has made us the preferred choice for specialized construction services in Nepal.`,
  storyImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  foundedYear: '2050 B.S.',
  experience: '32+',
  completedProjects: '500+',
  
  // Leadership
  directorName: 'Rabi Kumar Paudel',
  directorPosition: 'Managing Director',
  directorExperience: 'Director from 2050 B.S. to 2073 B.S., Managing Director since 2073 B.S.',
  directorBio: 'With decades of hands-on experience in construction engineering, Rabi Kumar Paudel has been instrumental in shaping RASS Engineering into the industry leader it is today. His vision, technical expertise, and commitment to quality continue to drive our success.',
  
  // Collections
  values: defaultValues,
  team: defaultTeam,
  stats: defaultStats,
};

// Initial Admin State
export const initialAdminState: AdminState = {
  hero: {
    title: 'Engineering Excellence Since 2050 B.S.',
    titleHighlight: 'Engineering Excellence', // ✅ Added required field
    subtitle: 'Premier specialized construction solutions across Nepal',
    images: [],
  },
  
  aboutContent: defaultAboutContent,
  
  services: [],
  projects: [],
  blog: [],
  
  contact: {
    phone: '977-01-5907561',
    email: 'rass.engineering2016@gmail.com',
    address: 'Basundhara, Kathmandu, Nepal',
    heading: 'Get in Touch',
    subheading: 'We\'re here to help with your construction needs',
  },
  
  settings: {
    siteName: 'RASS Engineering & Construction Pvt. Ltd.',
    tagline: '32+ Years of Engineering Excellence',
    logo: 'https://res.cloudinary.com/dihev9qxc/image/upload/v1765519977/WhatsApp_Image_2025-12-09_at_15.04.23_99b99d02_havp7x.jpg',
    favicon: '',
    seoTitle: 'RASS Engineering - Premier Construction Services in Nepal',
    seoDescription: 'Leading engineering and construction company in Nepal with 32+ years of experience. Specializing in waterproofing, structural retrofitting, and specialized construction solutions.',
  },
  
  quoteSubmissions: [],
  contactSubmissions: [],
};

// ==================== PROPERLY TYPED REDUCER ====================
// ✅ FIXED: Changed from 'action: any' to 'action: AdminAction'
export function adminReducer(state: AdminState, action: AdminAction): AdminState {
  const payload = action.payload as any; // ✅ Cast once here if needed
  
  switch (action.type) {
    case 'SET_HERO':
      return { ...state, hero: { ...state.hero, ...payload } };
      
    case 'SET_ABOUT_CONTENT':
      return { ...state, aboutContent: { ...state.aboutContent, ...payload } };
      
    case 'SET_ABOUT':
      return { ...state, about: payload };
      
    case 'SET_SERVICES':
      return { ...state, services: payload };
      
    case 'ADD_SERVICE':
      return { ...state, services: [...state.services, payload] };
      
    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map((service) =>
          service.id === payload.id ? payload : service
        ),
      };
      
    case 'DELETE_SERVICE':
      return {
        ...state,
        services: state.services.filter((service) => service.id !== action.payload),
      };
      
    case 'SET_PROJECTS':
      return { ...state, projects: payload };
      
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, payload] };
      
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === payload.id ? payload : project
        ),
      };
      
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((project) => project.id !== action.payload),
      };
      
    case 'SET_BLOG':
      return { ...state, blog: payload };
      
    case 'ADD_BLOG':
      return { ...state, blog: [...state.blog, payload] };
      
    case 'UPDATE_BLOG':
      return {
        ...state,
        blog: state.blog.map((post) =>
          post.id === payload.id ? payload : post
        ),
      };
      
    case 'DELETE_BLOG':
      return {
        ...state,
        blog: state.blog.filter((post) => post.id !== action.payload),
      };
      
    case 'SET_CONTACT':
      return { ...state, contact: { ...state.contact, ...payload } };
      
    case 'SET_SETTINGS':
      return { ...state, settings: { ...state.settings, ...payload } };
      
    case 'UPDATE_QUOTE_STATUS':
      return {
        ...state,
        quoteSubmissions: state.quoteSubmissions.map((submission) =>
          submission.id === payload.id
            ? { ...submission, status: payload.status }
            : submission
        ),
      };
      
    case 'UPDATE_CONTACT_STATUS':
      return {
        ...state,
        contactSubmissions: state.contactSubmissions.map((submission) =>
          submission.id === payload.id
            ? { ...submission, status: payload.status }
            : submission
        ),
      };
      
    case 'LOAD_STATE':
      return payload;
      
    default:
      return state;
  }
}

// Local Storage Helper
const STORAGE_KEY = 'rass_admin_state';

export const loadStateFromStorage = (): AdminState | null => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) {
      return null;
    }
    return JSON.parse(serialized);
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return null;
  }
};

export const saveStateToStorage = (state: AdminState): void => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
};