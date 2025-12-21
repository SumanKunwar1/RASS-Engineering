import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { PageHeader } from '@/components/admin/PageHeader';
import { ContentCard } from '@/components/admin/PageHeader';
import { DataTable, StatusBadge, Column } from '@/components/admin/DataTable';
import { QuoteSubmission, ContactSubmission } from '@/types/admin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function AdminSubmissions() {
  const { state, dispatch } = useAdmin();
  const [viewingQuote, setViewingQuote] = useState<QuoteSubmission | null>(null);
  const [viewingContact, setViewingContact] = useState<ContactSubmission | null>(null);

  const quoteColumns: Column<QuoteSubmission>[] = [
    { key: 'name', label: 'Name' },
    { key: 'company', label: 'Company' },
    { key: 'email', label: 'Email' },
    { key: 'serviceType', label: 'Service' },
    { key: 'createdAt', label: 'Date' },
    {
      key: 'status',
      label: 'Status',
      render: (item) => (
        <Select
          value={item.status}
          onValueChange={(value: QuoteSubmission['status']) => {
            dispatch({
              type: 'UPDATE_QUOTE_STATUS',
              payload: { id: item.id, status: value },
            });
            toast.success('Status updated!');
          }}
        >
          <SelectTrigger className="w-28 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="quoted">Quoted</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    { key: 'actions', label: 'Actions', className: 'w-20' },
  ];

  const contactColumns: Column<ContactSubmission>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'createdAt', label: 'Date' },
    {
      key: 'status',
      label: 'Status',
      render: (item) => (
        <Select
          value={item.status}
          onValueChange={(value: ContactSubmission['status']) => {
            dispatch({
              type: 'UPDATE_CONTACT_STATUS',
              payload: { id: item.id, status: value },
            });
            toast.success('Status updated!');
          }}
        >
          <SelectTrigger className="w-24 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    { key: 'actions', label: 'Actions', className: 'w-20' },
  ];

  const newQuotes = state.quoteSubmissions.filter((q) => q.status === 'new').length;
  const newContacts = state.contactSubmissions.filter((c) => c.status === 'new').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Submissions"
        description="View and manage quote requests and contact messages"
      />

      <Tabs defaultValue="quotes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="quotes" className="relative">
            Quote Requests
            {newQuotes > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {newQuotes}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="contacts" className="relative">
            Contact Messages
            {newContacts > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {newContacts}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quotes" className="mt-6">
          <DataTable
            data={state.quoteSubmissions}
            columns={quoteColumns}
            onView={setViewingQuote}
          />
        </TabsContent>

        <TabsContent value="contacts" className="mt-6">
          <DataTable
            data={state.contactSubmissions}
            columns={contactColumns}
            onView={setViewingContact}
          />
        </TabsContent>
      </Tabs>

      {/* View Quote Modal */}
      <Dialog open={!!viewingQuote} onOpenChange={() => setViewingQuote(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Quote Request Details</DialogTitle>
            <DialogDescription>Submitted on {viewingQuote?.createdAt}</DialogDescription>
          </DialogHeader>
          {viewingQuote && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{viewingQuote.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{viewingQuote.company}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{viewingQuote.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{viewingQuote.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Service Type</p>
                <p className="font-medium">{viewingQuote.serviceType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Message</p>
                <p className="font-medium">{viewingQuote.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Contact Modal */}
      <Dialog open={!!viewingContact} onOpenChange={() => setViewingContact(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Contact Message Details</DialogTitle>
            <DialogDescription>Submitted on {viewingContact?.createdAt}</DialogDescription>
          </DialogHeader>
          {viewingContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{viewingContact.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{viewingContact.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{viewingContact.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Message</p>
                <p className="font-medium">{viewingContact.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
