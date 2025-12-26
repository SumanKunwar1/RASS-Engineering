// Admin Panel Type Definitions - FIXED VERSION
// Fixed the managingDirector type conflict

// ==================== HERO BUTTON ====================
export interface HeroButton {
  id: string;
  label: string;
  route: string;
  variant?: 'primary' | 'outline';
}

// ==================== HERO SECTION ====================
export interface HeroSection {
  id?: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  images: string[];
  buttons?: HeroButton[];
  ctaText?: string;
  ctaLink?: string;
  tagline?: string;
  excerpt?: string;
  content?: string;
  [key: string]: any;
}

// ==================== MANAGING DIRECTOR ====================
export interface ManagingDirector {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  email: string;
}

// ==================== ABOUT SECTION ====================
// ✅ FIXED: managingDirector can be string OR object
export interface AboutSection {
  id: string;
  title: string;
  subtitle: string;
  description1: string;
  description2: string;
  image: string;
  managingDirector: string | ManagingDirector; // ✅ Now accepts both
  excerpt?: string;
  content?: string;
  author?: string;
  [key: string]: any;
}

// ==================== SERVICE ====================
export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  features?: string[];
  image?: string;
  excerpt?: string;
  content?: string;
  [key: string]: any;
}

// Alias for compatibility
export type Service = ServiceItem;

// ... rest of the types remain the same (keep your existing code)
// Just make sure to include all your existing types from the file
// ==================== PROJECT ====================
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
  excerpt?: string;
  content?: string;
  [key: string]: any;
}

// ==================== BLOG ====================
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
  [key: string]: any;
}

// ==================== TEAM ====================
export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  email?: string;
  linkedin?: string;
  phone?: string;
  excerpt?: string;
  content?: string;
  [key: string]: any;
}

// ==================== COMPANY VALUES ====================
export interface CompanyValue {
  id: string;
  icon: string;
  title: string;
  description: string;
  excerpt?: string;
  content?: string;
  [key: string]: any;
}

// ==================== STATS ====================
export interface StatItem {
  id?: string;
  label: string;
  value: string;
  icon?: string;
}

// ==================== ABOUT CONTENT ====================
export interface AboutContent {
  id?: string;
  heroTitle: string;
  heroSubtitle: string;
  mission: string;
  vision: string;
  storyTitle?: string;
  history: string;
  storyImage?: string;
  foundedYear?: string;
  experience?: string;
  completedProjects?: string;
  directorName?: string;
  directorPosition?: string;
  directorBio?: string;
  directorExperience?: string;
  values: CompanyValue[];
  team: TeamMember[];
  stats: StatItem[];
  excerpt?: string;
  content?: string;
  [key: string]: any;
}

// ==================== CONTACT INFO ====================
export interface ContactInfo {
  phone: string;
  email: string;
  heading?: string;
  subheading?: string;
  address?: string;
  mapUrl?: string;
  workingHours?: string;
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  excerpt?: string;
  content?: string;
  [key: string]: any;
}

// ==================== FORM SUBMISSIONS ====================
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
  [key: string]: any;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied';
  [key: string]: any;
}

// ==================== SETTINGS ====================
export interface SiteSettings {
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  seoTitle: string;
  seoDescription: string;
  googleAnalyticsId?: string;
  [key: string]: any;
}

// ==================== ADMIN STATE ====================
export interface AdminState {
  hero: HeroSection;
  about?: AboutSection;
  aboutContent?: AboutContent;
  services: ServiceItem[];
  projects: ProjectItem[];
  blog: BlogPost[];
  contact: ContactInfo;
  settings: SiteSettings;
  quoteSubmissions: QuoteSubmission[];
  contactSubmissions: ContactSubmission[];
  [key: string]: any;
}

// ==================== ADMIN ACTIONS ====================
// ✅ FIXED: Properly typed union with exact payload types
export type AdminActionType =
  | 'SET_HERO'
  | 'SET_ABOUT'
  | 'SET_ABOUT_CONTENT'
  | 'ADD_SERVICE'
  | 'UPDATE_SERVICE'
  | 'DELETE_SERVICE'
  | 'SET_SERVICES'
  | 'ADD_PROJECT'
  | 'UPDATE_PROJECT'
  | 'DELETE_PROJECT'
  | 'SET_PROJECTS'
  | 'ADD_BLOG'
  | 'UPDATE_BLOG'
  | 'DELETE_BLOG'
  | 'SET_BLOG'
  | 'SET_CONTACT'
  | 'SET_SETTINGS'
  | 'UPDATE_QUOTE_STATUS'
  | 'UPDATE_CONTACT_STATUS'
  | 'LOAD_STATE';

// ✅ FIXED: Each action now has the correct payload type
export type AdminAction =
  | { type: 'SET_HERO'; payload: Partial<HeroSection> }
  | { type: 'SET_ABOUT'; payload: Partial<AboutSection> }
  | { type: 'SET_ABOUT_CONTENT'; payload: Partial<AboutContent> }
  | { type: 'ADD_SERVICE'; payload: ServiceItem }
  | { type: 'UPDATE_SERVICE'; payload: ServiceItem }
  | { type: 'DELETE_SERVICE'; payload: string }
  | { type: 'SET_SERVICES'; payload: ServiceItem[] }
  | { type: 'ADD_PROJECT'; payload: ProjectItem }
  | { type: 'UPDATE_PROJECT'; payload: ProjectItem }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'SET_PROJECTS'; payload: ProjectItem[] }
  | { type: 'ADD_BLOG'; payload: BlogPost }
  | { type: 'UPDATE_BLOG'; payload: BlogPost }
  | { type: 'DELETE_BLOG'; payload: string }
  | { type: 'SET_BLOG'; payload: BlogPost[] }
  | { type: 'SET_CONTACT'; payload: Partial<ContactInfo> }
  | { type: 'SET_SETTINGS'; payload: Partial<SiteSettings> }
  | { type: 'UPDATE_QUOTE_STATUS'; payload: { id: string; status: QuoteSubmission['status'] } }
  | { type: 'UPDATE_CONTACT_STATUS'; payload: { id: string; status: ContactSubmission['status'] } }
  | { type: 'LOAD_STATE'; payload: AdminState };

// ==================== UTILITY TYPES ====================

export type Optional<T> = {
  [P in keyof T]?: T[P];
};

export type ReadonlyAdminState = Readonly<AdminState>;

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

// ==================== FORM MODAL TYPES ====================

export interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// ==================== CONTENT CARD TYPES ====================

export interface ContentCardProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}

// ==================== PAGE HEADER TYPES ====================

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: any;
  };
  children?: React.ReactNode;
}

// ==================== ICON TYPES ====================

export type IconName =
  | 'Hammer'
  | 'Building2'
  | 'Mountain'
  | 'Wrench'
  | 'HardHat'
  | 'Ruler'
  | 'Construction'
  | 'Drill'
  | 'Bolt'
  | 'Cog'
  | 'Settings'
  | 'Tool'
  | 'Phone'
  | 'Mail'
  | 'Pencil'
  | 'Plus'
  | 'Trash2'
  | 'Upload'
  | 'X'
  | 'ChevronLeft'
  | 'ChevronRight'
  | 'CheckCircle2'
  | 'ArrowRight'
  | 'Award'
  | 'Users'
  | 'Target'
  | 'Eye'
  | 'Heart'
  | 'Star'
  | 'Shield'
  | 'Zap'
  | string;

// ==================== FILE UPLOAD TYPES ====================

export interface FileUploadEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    files: FileList;
  };
}

export interface FileUploadResult {
  base64: string;
  file: File;
  preview?: string;
  name: string;
  size: number;
  type: string;
}

// ==================== IMAGE TYPES ====================

export interface ImageData {
  url: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
}

export interface ImageUploadOptions {
  maxSize?: number;
  formats?: string[];
  compress?: boolean;
  quality?: number;
}

// ==================== TOAST TYPES ====================

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id?: string;
  type: ToastType;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ==================== PAGINATION TYPES ====================

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationState;
}

// ==================== FILTER TYPES ====================

export interface FilterState {
  search?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: any;
}

// ==================== SORT TYPES ====================

export interface SortState {
  field: string;
  order: 'asc' | 'desc';
}

// ==================== TABLE TYPES ====================

export interface TableColumn<T> {
  key: keyof T;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
}

export interface TableState<T> {
  data: T[];
  loading: boolean;
  error?: string;
  pagination?: PaginationState;
  sort?: SortState;
  filter?: FilterState;
}