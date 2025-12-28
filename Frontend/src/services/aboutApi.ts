import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token
const getAuthToken = () => {
  return localStorage.getItem('rass_admin_token');
};

// Axios instance with auth
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AboutContent {
  _id?: string;
  heroTitle: string;
  heroSubtitle: string;
  mission: string;
  vision: string;
  history: string;
  storyTitle?: string;
  storyImage?: string;
  foundedYear?: string;
  experience?: string;
  completedProjects?: string;
  directorName?: string;
  directorPosition?: string;
  directorExperience?: string;
  directorBio?: string;
  values: CompanyValue[];
  team: TeamMember[];
  stats: StatItem[];
}

export interface CompanyValue {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  email?: string;
  bio?: string;
  image?: string;
}

export interface StatItem {
  label: string;
  value: string;
}

// Get about content (public)
export const getAboutContent = async () => {
  const response = await axios.get(`${API_BASE_URL}/about`);
  return response.data;
};

// Update entire about content (admin)
export const updateAboutContent = async (data: Partial<AboutContent>) => {
  const response = await api.put('/about', data);
  return response.data;
};

// Update main content (admin)
export const updateMainContent = async (data: {
  heroTitle: string;
  heroSubtitle: string;
  mission: string;
  vision: string;
}) => {
  const response = await api.patch('/about/main', data);
  return response.data;
};

// Update story section (admin)
export const updateStory = async (data: {
  history: string;
  storyTitle?: string;
  storyImage?: string;
}) => {
  const response = await api.patch('/about/story', data);
  return response.data;
};

// Update leadership (admin)
export const updateLeadership = async (data: {
  directorName?: string;
  directorPosition?: string;
  directorExperience?: string;
  directorBio?: string;
}) => {
  const response = await api.patch('/about/leadership', data);
  return response.data;
};

// Team member operations (admin)
export const saveTeamMember = async (member: TeamMember) => {
  const response = await api.post('/about/team', member);
  return response.data;
};

export const deleteTeamMember = async (id: string) => {
  const response = await api.delete(`/about/team/${id}`);
  return response.data;
};

// Company value operations (admin)
export const saveCompanyValue = async (value: CompanyValue) => {
  const response = await api.post('/about/values', value);
  return response.data;
};

export const deleteCompanyValue = async (id: string) => {
  const response = await api.delete(`/about/values/${id}`);
  return response.data;
};

// Stats operations (admin)
export const addStat = async (stat: StatItem) => {
  const response = await api.post('/about/stats', stat);
  return response.data;
};

export const deleteStat = async (index: number) => {
  const response = await api.delete(`/about/stats/${index}`);
  return response.data;
};