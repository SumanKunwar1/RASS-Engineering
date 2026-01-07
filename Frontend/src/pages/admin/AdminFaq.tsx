import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { FormModal } from '@/components/admin/FormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import axios from 'axios';

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

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  active: boolean;
}

const categories = [
  { value: 'general', label: 'General' },
  { value: 'services', label: 'Services' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'technical', label: 'Technical' },
  { value: 'projects', label: 'Projects' }
];

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'general',
    order: 0,
    active: true
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/faqs/admin/all');
      
      if (response.data.success) {
        setFaqs(response.data.data);
      }
    } catch (error: any) {
      toast.error('Failed to fetch FAQs');
      console.error('Fetch FAQs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (faq?: FAQ) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        order: faq.order,
        active: faq.active
      });
    } else {
      setEditingFaq(null);
      setFormData({
        question: '',
        answer: '',
        category: 'general',
        order: faqs.length,
        active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category: 'general',
      order: 0,
      active: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question || !formData.answer) {
      toast.error('Question and answer are required');
      return;
    }

    try {
      if (editingFaq) {
        // Update existing FAQ
        const response = await api.put(`/faqs/${editingFaq._id}`, formData);
        
        if (response.data.success) {
          setFaqs(faqs.map(f => f._id === editingFaq._id ? response.data.data : f));
          toast.success('FAQ updated successfully');
        }
      } else {
        // Create new FAQ
        const response = await api.post('/faqs', formData);
        
        if (response.data.success) {
          setFaqs([...faqs, response.data.data]);
          toast.success('FAQ created successfully');
        }
      }
      
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save FAQ');
      console.error('Save FAQ error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) {
      return;
    }

    try {
      const response = await api.delete(`/faqs/${id}`);
      
      if (response.data.success) {
        setFaqs(faqs.filter(f => f._id !== id));
        toast.success('FAQ deleted successfully');
      }
    } catch (error: any) {
      toast.error('Failed to delete FAQ');
      console.error('Delete FAQ error:', error);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const response = await api.patch(`/faqs/${id}/toggle-active`);
      
      if (response.data.success) {
        setFaqs(faqs.map(f => f._id === id ? response.data.data : f));
        toast.success(response.data.message);
      }
    } catch (error: any) {
      toast.error('Failed to toggle FAQ status');
      console.error('Toggle active error:', error);
    }
  };

  const filteredFaqs = filterCategory === 'all' 
    ? faqs 
    : faqs.filter(f => f.category === filterCategory);

  const getCategoryLabel = (value: string) => {
    return categories.find(cat => cat.value === value)?.label || value;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQ Management"
        description="Manage frequently asked questions"
      >
        <Button onClick={() => handleOpenModal()} className="bg-[#F46A1F] hover:bg-[#d85a15]">
          <Plus size={16} className="mr-2" />
          Add FAQ
        </Button>
      </PageHeader>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterCategory('all')}
            >
              All ({faqs.length})
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={filterCategory === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterCategory(cat.value)}
              >
                {cat.label} ({faqs.filter(f => f.category === cat.value).length})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ List */}
      <Card>
        <CardContent className="p-6">
          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq._id}
                  className={`p-4 rounded-lg border-2 ${
                    faq.active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-[#F46A1F]/10 text-[#F46A1F] text-xs font-semibold rounded uppercase">
                          {getCategoryLabel(faq.category)}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded">
                          Order: {faq.order}
                        </span>
                        {!faq.active && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-black mb-2">{faq.question}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{faq.answer}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleActive(faq._id)}
                        title={faq.active ? 'Deactivate' : 'Activate'}
                      >
                        {faq.active ? <Eye size={16} /> : <EyeOff size={16} />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenModal(faq)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(faq._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No FAQs found</p>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <FormModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        title={editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
              required
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="question">Question *</Label>
            <Textarea
              id="question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Enter the question"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="answer">Answer *</Label>
            <Textarea
              id="answer"
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Enter the answer"
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lower numbers appear first
              </p>
            </div>

            <div>
              <Label htmlFor="active">Status</Label>
              <select
                id="active"
                value={formData.active ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}

