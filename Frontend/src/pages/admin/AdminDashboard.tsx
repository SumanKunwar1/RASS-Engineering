import React, { useEffect, useState } from 'react';
import { StatCard } from '@/components/admin/StatCard';
import { ContentCard } from '@/components/admin/PageHeader';
import { DataTable, StatusBadge, Column } from '@/components/admin/DataTable';
import {
  FolderKanban,
  FileText,
  Wrench,
  MessageSquareQuote,
  Loader2,
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token
const getAuthToken = () => {
  return localStorage.getItem('rass_admin_token');
};

// Axios instance with auth
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface QuoteSubmission {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  createdAt: string;
}

interface ContactSubmission {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

interface Project {
  _id: string;
  status: 'completed' | 'ongoing' | 'planned';
}

interface Blog {
  _id: string;
  published: boolean;
}

interface Service {
  _id: string;
  active: boolean;
}

interface DashboardStats {
  projects: {
    total: number;
    completed: number;
    ongoing: number;
    planned: number;
  };
  blogs: {
    total: number;
    published: number;
    drafts: number;
  };
  services: {
    total: number;
    active: number;
  };
  submissions: {
    quotes: {
      total: number;
      new: number;
      contacted: number;
      quoted: number;
      closed: number;
    };
    contacts: {
      total: number;
      new: number;
      read: number;
      replied: number;
    };
  };
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentQuotes, setRecentQuotes] = useState<QuoteSubmission[]>([]);
  const [recentContacts, setRecentContacts] = useState<ContactSubmission[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [projectsRes, blogsRes, servicesRes, quotesRes, contactsRes] = await Promise.all([
        api.get('/projects/admin/all'),
        api.get('/blogs/admin/all'),
        api.get('/services/admin/all'),
        api.get('/quotes?limit=5'),
        api.get('/contacts?limit=5')
      ]);

      // Process projects
      const projects: Project[] = projectsRes.data.data || [];
      const projectStats = {
        total: projects.length,
        completed: projects.filter(p => p.status === 'completed').length,
        ongoing: projects.filter(p => p.status === 'ongoing').length,
        planned: projects.filter(p => p.status === 'planned').length
      };

      // Process blogs
      const blogs: Blog[] = blogsRes.data.data || [];
      const blogStats = {
        total: blogs.length,
        published: blogs.filter(b => b.published).length,
        drafts: blogs.filter(b => !b.published).length
      };

      // Process services
      const services: Service[] = servicesRes.data.data || [];
      const serviceStats = {
        total: services.length,
        active: services.filter(s => s.active).length
      };

      // Process quotes
      const quotes: QuoteSubmission[] = quotesRes.data.data || [];
      const quoteStats = {
        total: quotesRes.data.total || 0,
        new: quotes.filter(q => q.status === 'new').length,
        contacted: quotes.filter(q => q.status === 'contacted').length,
        quoted: quotes.filter(q => q.status === 'quoted').length,
        closed: quotes.filter(q => q.status === 'closed').length
      };

      // Process contacts
      const contacts: ContactSubmission[] = contactsRes.data.data || [];
      const contactStats = {
        total: contactsRes.data.total || 0,
        new: contacts.filter(c => c.status === 'new').length,
        read: contacts.filter(c => c.status === 'read').length,
        replied: contacts.filter(c => c.status === 'replied').length
      };

      setStats({
        projects: projectStats,
        blogs: blogStats,
        services: serviceStats,
        submissions: {
          quotes: quoteStats,
          contacts: contactStats
        }
      });

      setRecentQuotes(quotes);
      setRecentContacts(contacts);

    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const quoteColumns: Column<QuoteSubmission>[] = [
    { 
      key: '_id' as keyof QuoteSubmission, 
      label: 'Name',
      render: (item) => <span>{item.name}</span>
    },
    { 
      key: '_id' as keyof QuoteSubmission,
      label: 'Service',
      render: (item) => <span className="capitalize">{item.serviceType}</span>
    },
    { 
      key: '_id' as keyof QuoteSubmission,
      label: 'Date',
      render: (item) => <span className="text-sm">{formatDate(item.createdAt)}</span>
    },
    {
      key: '_id' as keyof QuoteSubmission,
      label: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  const contactColumns: Column<ContactSubmission>[] = [
    { 
      key: '_id' as keyof ContactSubmission, 
      label: 'Name',
      render: (item) => <span>{item.name}</span>
    },
    { 
      key: '_id' as keyof ContactSubmission, 
      label: 'Email',
      render: (item) => <span>{item.email}</span>
    },
    { 
      key: '_id' as keyof ContactSubmission,
      label: 'Date',
      render: (item) => <span className="text-sm">{formatDate(item.createdAt)}</span>
    },
    {
      key: '_id' as keyof ContactSubmission,
      label: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.projects.total,
      icon: FolderKanban,
      trend: stats.projects.ongoing > 0 ? { value: stats.projects.ongoing, isPositive: true } : undefined,
    },
    {
      title: 'Blog Posts',
      value: stats.blogs.total,
      icon: FileText,
      trend: stats.blogs.published > 0 ? { value: stats.blogs.published, isPositive: true } : undefined,
    },
    {
      title: 'Services',
      value: stats.services.total,
      icon: Wrench,
    },
    {
      title: 'Quote Requests',
      value: stats.submissions.quotes.new,
      icon: MessageSquareQuote,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Quote Requests */}
        <ContentCard
          title="Recent Quote Requests"
          description="Latest quote submissions from potential clients"
        >
          {recentQuotes.length > 0 ? (
            <DataTable
              data={recentQuotes}
              columns={quoteColumns}
              onView={(item) => window.location.href = '/admin/submissions'}
            />
          ) : (
            <p className="text-center text-gray-500 py-8">No quote requests yet</p>
          )}
        </ContentCard>

        {/* Recent Contact Messages */}
        <ContentCard
          title="Recent Contact Messages"
          description="Latest messages from the contact form"
        >
          {recentContacts.length > 0 ? (
            <DataTable
              data={recentContacts}
              columns={contactColumns}
              onView={(item) => window.location.href = '/admin/submissions'}
            />
          ) : (
            <p className="text-center text-gray-500 py-8">No contact messages yet</p>
          )}
        </ContentCard>
      </div>

      {/* Content Summary */}
      <ContentCard title="Content Overview" description="Quick summary of your website content">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-primary">{stats.projects.completed}</p>
            <p className="text-sm text-muted-foreground mt-1">Completed Projects</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-info">{stats.projects.ongoing}</p>
            <p className="text-sm text-muted-foreground mt-1">Ongoing Projects</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-success">{stats.blogs.published}</p>
            <p className="text-sm text-muted-foreground mt-1">Published Blogs</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-warning">{stats.blogs.drafts}</p>
            <p className="text-sm text-muted-foreground mt-1">Draft Posts</p>
          </div>
        </div>
      </ContentCard>

      {/* Submissions Summary */}
      <ContentCard title="Submissions Status" description="Overview of quote and contact submissions">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-2xl font-bold text-blue-600">{stats.submissions.quotes.new}</p>
            <p className="text-sm text-gray-600 mt-1">New Quotes</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-2xl font-bold text-yellow-600">{stats.submissions.quotes.contacted}</p>
            <p className="text-sm text-gray-600 mt-1">Contacted</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-2xl font-bold text-green-600">{stats.submissions.quotes.quoted}</p>
            <p className="text-sm text-gray-600 mt-1">Quoted</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-2xl font-bold text-purple-600">{stats.submissions.contacts.new}</p>
            <p className="text-sm text-gray-600 mt-1">New Contacts</p>
          </div>
        </div>
      </ContentCard>
    </div>
  );
}