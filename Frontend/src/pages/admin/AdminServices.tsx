import React, { useState } from 'react';
import { Trash2, Edit, Plus, X, Upload } from 'lucide-react';

// Types
interface SubService {
  title: string;
  blogId: number;
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  subServices: SubService[];
  applications: string[];
  gradient: string;
  image: string;
}

// Mock initial data
const initialServices: ServiceItem[] = [
  {
    id: 'structural-engineering',
    title: 'Structural Engineering',
    description: 'Comprehensive structural design and analysis services for buildings and infrastructure projects.',
    subServices: [
      { title: 'Building Design & Analysis', blogId: 1 },
      { title: 'Foundation Engineering', blogId: 2 },
      { title: 'Seismic Analysis', blogId: 3 }
    ],
    applications: ['Residential', 'Commercial', 'Industrial', 'Infrastructure'],
    gradient: 'from-blue-500 to-blue-700',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800'
  },
  {
    id: 'mep-services',
    title: 'MEP Services',
    description: 'Mechanical, Electrical, and Plumbing design solutions for efficient building operations.',
    subServices: [
      { title: 'HVAC System Design', blogId: 4 },
      { title: 'Electrical Distribution', blogId: 5 },
      { title: 'Plumbing & Fire Protection', blogId: 6 }
    ],
    applications: ['Smart Buildings', 'Energy Efficiency', 'Sustainable Design'],
    gradient: 'from-green-500 to-green-700',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800'
  }
];

// Modal Component
const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, itemName }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{itemName}"? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminServices() {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [deletingService, setDeletingService] = useState<ServiceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState<ServiceItem>({
    id: '',
    title: '',
    description: '',
    subServices: [],
    applications: [],
    gradient: 'from-blue-500 to-blue-700',
    image: ''
  });

  // Sub-service form state
  const [newSubService, setNewSubService] = useState({ title: '', blogId: 0 });
  const [newApplication, setNewApplication] = useState('');

  const handleCreate = () => {
    setFormData({
      id: Date.now().toString(),
      title: '',
      description: '',
      subServices: [],
      applications: [],
      gradient: 'from-blue-500 to-blue-700',
      image: ''
    });
    setIsCreating(true);
    setEditingService(null);
  };

  const handleEdit = (service: ServiceItem) => {
    setFormData({ ...service });
    setEditingService(service);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Please enter a service title');
      return;
    }

    if (!formData.image.trim()) {
      alert('Please upload or provide an image URL');
      return;
    }

    if (isCreating) {
      setServices([...services, { ...formData, id: formData.id || Date.now().toString() }]);
      alert('Service created successfully!');
    } else {
      setServices(services.map(s => s.id === formData.id ? formData : s));
      alert('Service updated successfully!');
    }

    handleCloseModal();
  };

  const handleDelete = () => {
    if (!deletingService) return;
    setServices(services.filter(s => s.id !== deletingService.id));
    alert('Service deleted successfully!');
    setDeletingService(null);
  };

  const handleCloseModal = () => {
    setEditingService(null);
    setIsCreating(false);
    setFormData({
      id: '',
      title: '',
      description: '',
      subServices: [],
      applications: [],
      gradient: 'from-blue-500 to-blue-700',
      image: ''
    });
    setNewSubService({ title: '', blogId: 0 });
    setNewApplication('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setFormData({ ...formData, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const addSubService = () => {
    if (!newSubService.title.trim() || newSubService.blogId <= 0) {
      alert('Please enter both sub-service title and blog ID');
      return;
    }

    setFormData({
      ...formData,
      subServices: [...formData.subServices, { ...newSubService }]
    });
    setNewSubService({ title: '', blogId: 0 });
  };

  const removeSubService = (index: number) => {
    setFormData({
      ...formData,
      subServices: formData.subServices.filter((_, i) => i !== index)
    });
  };

  const addApplication = () => {
    if (!newApplication.trim()) {
      alert('Please enter an application');
      return;
    }

    setFormData({
      ...formData,
      applications: [...formData.applications, newApplication]
    });
    setNewApplication('');
  };

  const removeApplication = (index: number) => {
    setFormData({
      ...formData,
      applications: formData.applications.filter((_, i) => i !== index)
    });
  };

  const gradientOptions = [
    { value: 'from-blue-500 to-blue-700', label: 'Blue' },
    { value: 'from-green-500 to-green-700', label: 'Green' },
    { value: 'from-purple-500 to-purple-700', label: 'Purple' },
    { value: 'from-orange-500 to-orange-700', label: 'Orange' },
    { value: 'from-red-500 to-red-700', label: 'Red' },
    { value: 'from-indigo-500 to-indigo-700', label: 'Indigo' },
    { value: 'from-pink-500 to-pink-700', label: 'Pink' },
    { value: 'from-teal-500 to-teal-700', label: 'Teal' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
              <p className="text-gray-600 mt-1">Manage your service offerings and sub-services</p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus size={20} />
              Add Service
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                      <p className="text-gray-600 mt-1">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => setDeletingService(service)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  {/* Sub Services */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Specialized Services ({service.subServices.length})</h4>
                    <ul className="space-y-2">
                      {service.subServices.map((sub, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-semibold">
                            {String.fromCharCode(97 + idx)}
                          </span>
                          <span>{sub.title}</span>
                          <span className="text-gray-400">→ Blog #{sub.blogId}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Applications */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Applications ({service.applications.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.applications.map((app, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">No services yet. Click "Add Service" to create one.</p>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isCreating || editingService !== null}
        onClose={handleCloseModal}
        title={isCreating ? 'Create New Service' : 'Edit Service'}
      >
        <div className="space-y-6">
          {/* Service Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Service Image *
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                    <p className="text-sm text-gray-600 mb-1">
                      Click to upload image or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                  </label>
                </div>
              </div>
              {formData.image && (
                <div className="w-40">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Or paste image URL:</p>
              <input
                type="text"
                value={formData.image.startsWith('data:') ? '' : formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Service Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Structural Engineering"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Service ID (URL-friendly)
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., structural-engineering"
                disabled={!isCreating}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={3}
              placeholder="Describe this service..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Gradient Overlay Color
            </label>
            <select
              value={formData.gradient}
              onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {gradientOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Services Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Specialized Services (Clickable Links to Blog)</h3>
            
            <div className="space-y-3 mb-4">
              {formData.subServices.map((sub, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {String.fromCharCode(97 + idx)}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{sub.title}</p>
                    <p className="text-sm text-gray-500">Links to: /blog/{sub.blogId}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubService(idx)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={newSubService.title}
                onChange={(e) => setNewSubService({ ...newSubService, title: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Sub-service title"
              />
              <input
                type="number"
                value={newSubService.blogId || ''}
                onChange={(e) => setNewSubService({ ...newSubService, blogId: parseInt(e.target.value) || 0 })}
                className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Blog ID"
                min="1"
              />
              <button
                type="button"
                onClick={addSubService}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap"
              >
                Add
              </button>
            </div>
          </div>

          {/* Applications Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Applications</h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.applications.map((app, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                  <span className="text-sm text-gray-700">{app}</span>
                  <button
                    type="button"
                    onClick={() => removeApplication(idx)}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={newApplication}
                onChange={(e) => setNewApplication(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Application name"
              />
              <button
                type="button"
                onClick={addApplication}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap"
              >
                Add
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 justify-end border-t pt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              {isCreating ? 'Create Service' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deletingService !== null}
        onClose={() => setDeletingService(null)}
        onConfirm={handleDelete}
        itemName={deletingService?.title || ''}
      />
    </div>
  );
}