import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { FormModal } from '@/components/admin/FormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2, Eye, EyeOff, Loader2, Star } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('rass_admin_token');
};

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

interface Testimonial {
  _id: string;
  name: string;
  position: string;
  company: string;
  testimonial: string;
  image?: string;
  rating: number;
  order: number;
  active: boolean;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    testimonial: '',
    image: '',
    rating: 5,
    order: 0,
    active: true
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await api.get('/testimonials/admin/all');
      
      if (response.data.success) {
        setTestimonials(response.data.data);
      }
    } catch (error: any) {
      toast.error('Failed to fetch testimonials');
      console.error('Fetch testimonials error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        position: testimonial.position,
        company: testimonial.company,
        testimonial: testimonial.testimonial,
        image: testimonial.image || '',
        rating: testimonial.rating,
        order: testimonial.order,
        active: testimonial.active
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: '',
        position: '',
        company: '',
        testimonial: '',
        image: '',
        rating: 5,
        order: testimonials.length,
        active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
    setFormData({
      name: '',
      position: '',
      company: '',
      testimonial: '',
      image: '',
      rating: 5,
      order: 0,
      active: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.position || !formData.company || !formData.testimonial) {
      toast.error('Name, position, company and testimonial are required');
      return;
    }

    try {
      if (editingTestimonial) {
        const response = await api.put(`/testimonials/${editingTestimonial._id}`, formData);
        
        if (response.data.success) {
          setTestimonials(testimonials.map(t => t._id === editingTestimonial._id ? response.data.data : t));
          toast.success('Testimonial updated successfully');
        }
      } else {
        const response = await api.post('/testimonials', formData);
        
        if (response.data.success) {
          setTestimonials([...testimonials, response.data.data]);
          toast.success('Testimonial added successfully');
        }
      }
      
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save testimonial');
      console.error('Save testimonial error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      const response = await api.delete(`/testimonials/${id}`);
      
      if (response.data.success) {
        setTestimonials(testimonials.filter(t => t._id !== id));
        toast.success('Testimonial deleted successfully');
      }
    } catch (error: any) {
      toast.error('Failed to delete testimonial');
      console.error('Delete testimonial error:', error);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const response = await api.patch(`/testimonials/${id}/toggle-active`);
      
      if (response.data.success) {
        setTestimonials(testimonials.map(t => t._id === id ? response.data.data : t));
        toast.success(response.data.message);
      }
    } catch (error: any) {
      toast.error('Failed to toggle testimonial status');
      console.error('Toggle active error:', error);
    }
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
        title="Testimonials Management"
        description="Manage client testimonials and reviews"
      >
        <Button onClick={() => handleOpenModal()} className="bg-[#F46A1F] hover:bg-[#d85a15]">
          <Plus size={16} className="mr-2" />
          Add Testimonial
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-6">
          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial._id}
                  className={`relative group border-2 rounded-xl p-6 transition-all ${
                    testimonial.active 
                      ? 'border-gray-200 bg-white hover:border-[#F46A1F]' 
                      : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 bg-white shadow"
                      onClick={() => handleToggleActive(testimonial._id)}
                      title={testimonial.active ? 'Deactivate' : 'Activate'}
                    >
                      {testimonial.active ? <Eye size={14} /> : <EyeOff size={14} />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 bg-white shadow"
                      onClick={() => handleOpenModal(testimonial)}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 bg-white shadow text-destructive hover:text-destructive"
                      onClick={() => handleDelete(testimonial._id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>

                  {!testimonial.active && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded">
                        Inactive
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-4 mb-4">
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-[#F46A1F]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-[#F46A1F]">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600 truncate">{testimonial.position}</p>
                      <p className="text-sm text-[#F46A1F] font-semibold truncate">{testimonial.company}</p>
                    </div>
                  </div>

                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating ? 'text-[#F46A1F] fill-[#F46A1F]' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-3 mb-2 italic">
                    "{testimonial.testimonial}"
                  </p>

                  <p className="text-xs text-gray-500">Order: {testimonial.order}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">No testimonials added yet</p>
          )}
        </CardContent>
      </Card>

      <FormModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        title={editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="CEO"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Company Name"
              required
            />
          </div>

          <div>
            <Label htmlFor="testimonial">Testimonial *</Label>
            <Textarea
              id="testimonial"
              value={formData.testimonial}
              onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
              placeholder="Write the testimonial here..."
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.testimonial.length}/1000 characters
            </p>
          </div>

          <div>
            <Label htmlFor="image">Profile Image URL (Optional)</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Paste the image URL here
            </p>
            
            {formData.image && (
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg mt-3">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/100?text=Invalid';
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <select
                id="rating"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
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