// Admin Panel Type Definitions
// These types mirror the structure of your frontend pages for CRUD operations

export interface HeroSection {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  images: string[];
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  image?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  year: string;
  client: string;
  features: string[];
  status: 'completed' | 'ongoing' | 'upcoming';
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  published: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  email?: string;
  linkedin?: string;
}

export interface CompanyValue {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface AboutContent {
  heroTitle: string;
  heroSubtitle: string;
  mission: string;
  vision: string;
  history: string;
  values: CompanyValue[];
  team: TeamMember[];
  stats: { label: string; value: string }[];
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  mapUrl: string;
  workingHours: string;
  socialLinks: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface QuoteSubmission {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  serviceType: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied';
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  seoTitle: string;
  seoDescription: string;
  googleAnalyticsId?: string;
}

export interface AdminState {
  hero: HeroSection;
  services: ServiceItem[];
  projects: ProjectItem[];
  blog: BlogPost[];
  about: AboutContent;
  contact: ContactInfo;
  settings: SiteSettings;
  quoteSubmissions: QuoteSubmission[];
  contactSubmissions: ContactSubmission[];
}

export type AdminAction =
  | { type: 'SET_HERO'; payload: HeroSection }
  | { type: 'ADD_SERVICE'; payload: ServiceItem }
  | { type: 'UPDATE_SERVICE'; payload: ServiceItem }
  | { type: 'DELETE_SERVICE'; payload: string }
  | { type: 'ADD_PROJECT'; payload: ProjectItem }
  | { type: 'UPDATE_PROJECT'; payload: ProjectItem }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_BLOG'; payload: BlogPost }
  | { type: 'UPDATE_BLOG'; payload: BlogPost }
  | { type: 'DELETE_BLOG'; payload: string }
  | { type: 'SET_ABOUT'; payload: AboutContent }
  | { type: 'SET_CONTACT'; payload: ContactInfo }
  | { type: 'SET_SETTINGS'; payload: SiteSettings }
  | { type: 'UPDATE_QUOTE_STATUS'; payload: { id: string; status: QuoteSubmission['status'] } }
  | { type: 'UPDATE_CONTACT_STATUS'; payload: { id: string; status: ContactSubmission['status'] } }
  | { type: 'LOAD_STATE'; payload: AdminState };
