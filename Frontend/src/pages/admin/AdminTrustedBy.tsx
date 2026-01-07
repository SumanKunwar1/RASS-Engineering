import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { FormModal } from '@/components/admin/FormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2, Eye, EyeOff, Loader2, Upload } from 'lucide-react';
import axios from 'axios';
import { useImageUpload } from '@/hooks/userImagesUploads';

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

interface TrustedCompany {
  _id: string;
  name: string;
  logo: string;
  order: number;
  active: boolean;
}

export default function AdminTrustedBy() {
  const [companies, setCompanies] = useState<TrustedCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<TrustedCompany | null>(null);
  const { uploadSingleImage, isUploading } = useImageUpload();
  
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    order: 0,
    active: true
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/trusted-by/admin/all');
      
      if (response.data.success) {
        setCompanies(response.data.data);
      }
    } catch (error: any) {
      toast.error('Failed to fetch companies');
      console.error('Fetch companies error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (company?: TrustedCompany) => {
    if (company) {
      setEditingCompany(company);
      setFormData({
        name: company.name,
        logo: company.logo,
        order: company.order,
        active: company.active
      });
    } else {
      setEditingCompany(null);
      setFormData({
        name: '',
        logo: '',
        order: companies.length,
        active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCompany(null);
    setFormData({
      name: '',
      logo: '',
      order: 0,
      active: true
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadSingleImage(file, 'rass-engineering/trusted-by');
      setFormData({ ...formData, logo: result.url });
      toast.success('Logo uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload logo');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.logo) {
      toast.error('Name and logo are required');
      return;
    }

    try {
      if (editingCompany) {
        // Update existing company
        const response = await api.put(`/trusted-by/${editingCompany._id}`, formData);
        
        if (response.data.success) {
          setCompanies(companies.map(c => c._id === editingCompany._id ? response.data.data : c));
          toast.success('Company updated successfully');
        }
      } else {
        // Create new company
        const response = await api.post('/trusted-by', formData);
        
        if (response.data.success) {
          setCompanies([...companies, response.data.data]);
          toast.success('Company added successfully');
        }
      }
      
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save company');
      console.error('Save company error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company?')) {
      return;
    }

    try {
      const response = await api.delete(`/trusted-by/${id}`);
      
      if (response.data.success) {
        setCompanies(companies.filter(c => c._id !== id));
        toast.success('Company deleted successfully');
      }
    } catch (error: any) {
      toast.error('Failed to delete company');
      console.error('Delete company error:', error);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const response = await api.patch(`/trusted-by/${id}/toggle-active`);
      
      if (response.data.success) {
        setCompanies(companies.map(c => c._id === id ? response.data.data : c));
        toast.success(response.data.message);
      }
    } catch (error: any) {
      toast.error('Failed to toggle company status');
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
        title="Trusted By Management"
        description="Manage client logos and company names"
      >
        <Button onClick={() => handleOpenModal()} className="bg-[#F46A1F] hover:bg-[#d85a15]">
          <Plus size={16} className="mr-2" />
          Add Company
        </Button>
      </PageHeader>

      {/* Companies Grid */}
      <Card>
        <CardContent className="p-6">
          {companies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {companies.map((company) => (
                <div
                  key={company._id}
                  className={`relative group border-2 rounded-xl p-4 transition-all ${
                    company.active 
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
                      onClick={() => handleToggleActive(company._id)}
                      title={company.active ? 'Deactivate' : 'Activate'}
                    >
                      {company.active ? <Eye size={14} /> : <EyeOff size={14} />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 bg-white shadow"
                      onClick={() => handleOpenModal(company)}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 bg-white shadow text-destructive hover:text-destructive"
                      onClick={() => handleDelete(company._id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>

                  {/* Status Badge */}
                  {!company.active && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded">
                        Inactive
                      </span>
                    </div>
                  )}

                  {/* Company Content */}
                  <div className="flex flex-col items-center justify-center min-h-[140px]">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="max-h-16 w-auto object-contain mb-3"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-[#F46A1F]/10 rounded-full flex items-center justify-center mb-3">
                        <span className="text-2xl font-bold text-[#F46A1F]">
                          {company.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <p className="text-sm font-semibold text-gray-700 text-center line-clamp-2">
                      {company.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Order: {company.order}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">No companies added yet</p>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <FormModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        title={editingCompany ? 'Edit Company' : 'Add New Company'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter company name"
              required
            />
          </div>

          <div>
            <Label htmlFor="logo">Company Logo *</Label>
            <div className="space-y-3">
              <Input
                id="logo"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="Logo URL"
                required
              />
              
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="logo-upload"
                  className={`flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      <span className="text-sm">Upload Logo</span>
                    </>
                  )}
                </label>
              </div>

              {formData.logo && (
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                  <img
                    src={formData.logo}
                    alt="Preview"
                    className="max-h-20 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/100?text=Invalid+URL';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order">Display Order</Label>
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