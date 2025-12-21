import React from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { StatCard } from '@/components/admin/StatCard';
import { ContentCard } from '@/components/admin/PageHeader';
import { DataTable, StatusBadge, Column } from '@/components/admin/DataTable';
import {
  FolderKanban,
  FileText,
  Wrench,
  MessageSquareQuote,
  Mail,
  TrendingUp,
} from 'lucide-react';
import { QuoteSubmission, ContactSubmission } from '@/types/admin';

export default function AdminDashboard() {
  const { state, dispatch } = useAdmin();

  const stats = [
    {
      title: 'Total Projects',
      value: state.projects.length,
      icon: FolderKanban,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Blog Posts',
      value: state.blog.length,
      icon: FileText,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Services',
      value: state.services.length,
      icon: Wrench,
    },
    {
      title: 'Quote Requests',
      value: state.quoteSubmissions.filter((q) => q.status === 'new').length,
      icon: MessageSquareQuote,
    },
  ];

  const recentQuotes = state.quoteSubmissions.slice(0, 5);
  const recentContacts = state.contactSubmissions.slice(0, 5);

  const quoteColumns: Column<QuoteSubmission>[] = [
    { key: 'name', label: 'Name' },
    { key: 'serviceType', label: 'Service' },
    { key: 'createdAt', label: 'Date' },
    {
      key: 'status',
      label: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  const contactColumns: Column<ContactSubmission>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'createdAt', label: 'Date' },
    {
      key: 'status',
      label: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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
          <DataTable
            data={recentQuotes}
            columns={quoteColumns}
            onView={(item) => console.log('View quote:', item)}
          />
        </ContentCard>

        {/* Recent Contact Messages */}
        <ContentCard
          title="Recent Contact Messages"
          description="Latest messages from the contact form"
        >
          <DataTable
            data={recentContacts}
            columns={contactColumns}
            onView={(item) => console.log('View contact:', item)}
          />
        </ContentCard>
      </div>

      {/* Content Summary */}
      <ContentCard title="Content Overview" description="Quick summary of your website content">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-primary">{state.projects.filter(p => p.status === 'completed').length}</p>
            <p className="text-sm text-muted-foreground mt-1">Completed Projects</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-info">{state.projects.filter(p => p.status === 'ongoing').length}</p>
            <p className="text-sm text-muted-foreground mt-1">Ongoing Projects</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-success">{state.blog.filter(b => b.published).length}</p>
            <p className="text-sm text-muted-foreground mt-1">Published Blogs</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-warning">{state.blog.filter(b => !b.published).length}</p>
            <p className="text-sm text-muted-foreground mt-1">Draft Posts</p>
          </div>
        </div>
      </ContentCard>
    </div>
  );
}
