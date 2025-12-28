import React, { useState, useEffect } from 'react';
import { Eye, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

// Types
interface QuoteSubmission {
  _id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  serviceType: string;
  projectType?: string;
  projectSize?: string;
  timeline?: string;
  budget?: string;
  description: string;
  address: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  createdAt: string;
  updatedAt: string;
}

interface ContactSubmission {
  _id: string;
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

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

// Modal Component
const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default function AdminSubmissions() {
  const [quoteSubmissions, setQuoteSubmissions] = useState<QuoteSubmission[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<'quotes' | 'contacts'>('quotes');
  const [viewingQuote, setViewingQuote] = useState<QuoteSubmission | null>(null);
  const [viewingContact, setViewingContact] = useState<ContactSubmission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [quotesRes, contactsRes] = await Promise.all([
        api.get('/quotes'),
        api.get('/contacts')
      ]);

      if (quotesRes.data.success) {
        setQuoteSubmissions(quotesRes.data.data);
      }
      if (contactsRes.data.success) {
        setContactSubmissions(contactsRes.data.data);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch submissions';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Fetch submissions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteStatus = async (id: string, status: QuoteSubmission['status']) => {
    try {
      const response = await api.patch(`/quotes/${id}/status`, { status });
      
      if (response.data.success) {
        setQuoteSubmissions(prev =>
          prev.map(q => q._id === id ? { ...q, status } : q)
        );
        toast.success('Quote status updated successfully');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update quote status';
      toast.error(errorMsg);
      console.error('Update quote status error:', err);
    }
  };

  const updateContactStatus = async (id: string, status: ContactSubmission['status']) => {
    try {
      const response = await api.patch(`/contacts/${id}/status`, { status });
      
      if (response.data.success) {
        setContactSubmissions(prev =>
          prev.map(c => c._id === id ? { ...c, status } : c)
        );
        toast.success('Contact status updated successfully');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update contact status';
      toast.error(errorMsg);
      console.error('Update contact status error:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
      case 'read':
        return 'bg-yellow-100 text-yellow-800';
      case 'quoted':
      case 'replied':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const newQuotes = quoteSubmissions.filter(q => q.status === 'new').length;
  const newContacts = contactSubmissions.filter(c => c.status === 'new').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Submissions</h1>
          <p className="text-gray-600 mt-1">View and manage quote requests and contact messages</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('quotes')}
                className={`px-6 py-4 font-semibold transition-colors relative ${
                  activeTab === 'quotes'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Quote Requests
                {newQuotes > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-orange-600 text-white rounded-full">
                    {newQuotes}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`px-6 py-4 font-semibold transition-colors relative ${
                  activeTab === 'contacts'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Contact Messages
                {newContacts > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-orange-600 text-white rounded-full">
                    {newContacts}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Quote Requests Table */}
          {activeTab === 'quotes' && (
            <div className="p-6">
              {quoteSubmissions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No quote requests yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Company</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Service</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quoteSubmissions.map((quote) => (
                        <tr key={quote._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900">{quote.name}</td>
                          <td className="py-3 px-4 text-gray-600">{quote.company || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-600">{quote.email}</td>
                          <td className="py-3 px-4 text-gray-600 capitalize">{quote.serviceType}</td>
                          <td className="py-3 px-4 text-gray-600">{formatDate(quote.createdAt)}</td>
                          <td className="py-3 px-4">
                            <select
                              value={quote.status}
                              onChange={(e) => updateQuoteStatus(quote._id, e.target.value as any)}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(quote.status)}`}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="quoted">Quoted</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => setViewingQuote(quote)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Contact Messages Table */}
          {activeTab === 'contacts' && (
            <div className="p-6">
              {contactSubmissions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No contact messages yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Phone</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Service</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactSubmissions.map((contact) => (
                        <tr key={contact._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900">{contact.name}</td>
                          <td className="py-3 px-4 text-gray-600">{contact.email}</td>
                          <td className="py-3 px-4 text-gray-600">{contact.phone}</td>
                          <td className="py-3 px-4 text-gray-600 capitalize">{contact.serviceType}</td>
                          <td className="py-3 px-4 text-gray-600">{formatDate(contact.createdAt)}</td>
                          <td className="py-3 px-4">
                            <select
                              value={contact.status}
                              onChange={(e) => updateContactStatus(contact._id, e.target.value as any)}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contact.status)}`}
                            >
                              <option value="new">New</option>
                              <option value="read">Read</option>
                              <option value="replied">Replied</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => setViewingContact(contact)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* View Quote Modal */}
      <Modal
        isOpen={viewingQuote !== null}
        onClose={() => setViewingQuote(null)}
        title="Quote Request Details"
      >
        {viewingQuote && (
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(viewingQuote.status)}`}>
                {viewingQuote.status.toUpperCase()}
              </span>
              <span className="text-sm text-gray-500">{formatDate(viewingQuote.createdAt)}</span>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="font-medium text-gray-900">{viewingQuote.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Company</p>
                  <p className="font-medium text-gray-900">{viewingQuote.company || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                  <p className="font-medium text-gray-900">{viewingQuote.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email Address</p>
                  <p className="font-medium text-gray-900">{viewingQuote.email}</p>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Project Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Service Required</p>
                  <p className="font-medium text-gray-900 capitalize">{viewingQuote.serviceType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Project Type</p>
                  <p className="font-medium text-gray-900 capitalize">{viewingQuote.projectType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Project Size</p>
                  <p className="font-medium text-gray-900">{viewingQuote.projectSize ? `${viewingQuote.projectSize} sq.ft` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Timeline</p>
                  <p className="font-medium text-gray-900 capitalize">{viewingQuote.timeline?.replace(/-/g, ' ') || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Budget Range</p>
                  <p className="font-medium text-gray-900">{viewingQuote.budget || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Project Location</p>
                  <p className="font-medium text-gray-900">{viewingQuote.address}</p>
                </div>
              </div>
            </div>

            {/* Project Description */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Project Description</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{viewingQuote.description}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <a
                href={`mailto:${viewingQuote.email}`}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-center font-semibold"
              >
                Send Email
              </a>
              <a
                href={`tel:${viewingQuote.phone}`}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center font-semibold"
              >
                Call Now
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* View Contact Modal */}
      <Modal
        isOpen={viewingContact !== null}
        onClose={() => setViewingContact(null)}
        title="Contact Message Details"
      >
        {viewingContact && (
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(viewingContact.status)}`}>
                {viewingContact.status.toUpperCase()}
              </span>
              <span className="text-sm text-gray-500">{formatDate(viewingContact.createdAt)}</span>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="font-medium text-gray-900">{viewingContact.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                  <p className="font-medium text-gray-900">{viewingContact.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Email Address</p>
                  <p className="font-medium text-gray-900">{viewingContact.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Service Type</p>
                  <p className="font-medium text-gray-900 capitalize">{viewingContact.serviceType}</p>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Message</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{viewingContact.message}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <a
                href={`mailto:${viewingContact.email}`}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-center font-semibold"
              >
                Send Email
              </a>
              <a
                href={`tel:${viewingContact.phone}`}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center font-semibold"
              >
                Call Now
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}