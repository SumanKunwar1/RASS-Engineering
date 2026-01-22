import React, { useState, useEffect } from 'react';
import { Plus, Upload, X, Image as ImageIcon, Trash2, Edit, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ProjectData {
  _id?: string;
  title: string;
  category: string;
  location: string;
  year: string;
  client: string;
  description: string;
  scope: string[];
  challenges: string;
  solution: string;
  results: string[];
  image: string;
  imagePublicId?: string;
  gallery: { url: string; publicId: string }[];
  isActive?: boolean;
}

const getAuthToken = () => localStorage.getItem('rass_admin_token');

const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: { Authorization: `Bearer ${getAuthToken()}` }
  });

  instance.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return instance;
};

// COMPRESSION FUNCTION - Reduces image size by 60-70%
const compressImage = (file: File, maxQuality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Set max dimensions to match Cloudinary transformation
        const maxWidth = 1200;
        const maxHeight = 800;
        let width = img.width;
        let height = img.height;
        
        // Calculate aspect ratio and resize
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to JPEG with compression quality
        resolve(canvas.toDataURL('image/jpeg', maxQuality));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// Original fileToBase64 for backward compatibility (fallback)
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'images'>('basic');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const [formData, setFormData] = useState<ProjectData>({
    title: '',
    category: '',
    location: '',
    year: new Date().getFullYear().toString(),
    client: '',
    description: '',
    scope: [],
    challenges: '',
    solution: '',
    results: [],
    image: '',
    gallery: []
  });

  const [scopeInput, setScopeInput] = useState('');
  const [resultsInput, setResultsInput] = useState('');

  const categories = ['Waterproofing', 'Structural Retrofitting', 'Epoxy Flooring', 'ACP Cladding', 'Metal Fabrication', 'Expansion Joint'];

  // Fetch all projects
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get('/projects');
      setProjects(response.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle image upload with compression
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'gallery') => {
    const files = e.target.files;
    if (!files) return;

    try {
      const fileArray = Array.from(files);
      setUploadProgress(`Processing ${fileArray.length} image(s)...`);
      
      // Use compression for images
      const base64Promises = fileArray.map(file => {
        // Compress gallery images to 75% quality, main images to 85% quality
        const quality = type === 'main' ? 0.85 : 0.75;
        return compressImage(file, quality);
      });
      
      const base64Results = await Promise.all(base64Promises);
      setUploadProgress('');

      if (type === 'main') {
        setFormData(prev => ({ ...prev, image: base64Results[0] }));
      } else {
        setFormData(prev => ({
          ...prev,
          gallery: [
            ...prev.gallery,
            ...base64Results.map(base64 => ({ url: base64, publicId: '' }))
          ]
        }));
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setError('Failed to process image');
      setUploadProgress('');
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleCreate = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      category: '',
      location: '',
      year: new Date().getFullYear().toString(),
      client: '',
      description: '',
      scope: [],
      challenges: '',
      solution: '',
      results: [],
      image: '',
      gallery: []
    });
    setScopeInput('');
    setResultsInput('');
    setActiveTab('basic');
    setError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: ProjectData) => {
    setEditingProject(project);
    setFormData(project);
    setScopeInput(project.scope.join('\n'));
    setResultsInput(project.results.join('\n'));
    setActiveTab('basic');
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setError(null);

    // Validation
    if (!formData.title || !formData.category || !formData.location || !formData.year || 
        !formData.client || !formData.description || !formData.image) {
      setError('Please fill all required fields');
      return;
    }

    setSaving(true);
    setUploadProgress('Uploading project...');

    try {
      const axiosInstance = createAxiosInstance();
      
      const projectToSave = {
        ...formData,
        scope: scopeInput.split('\n').filter(s => s.trim()),
        results: resultsInput.split('\n').filter(r => r.trim()),
        gallery: formData.gallery.map(img => typeof img === 'string' ? img : img.url)
      };

      if (editingProject && editingProject._id) {
        // Update existing project
        setUploadProgress('Updating project...');
        await axiosInstance.put(`/projects/${editingProject._id}`, projectToSave);
      } else {
        // Create new project
        setUploadProgress('Creating project...');
        await axiosInstance.post('/projects', projectToSave);
      }

      setUploadProgress('');
      setIsModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err.response?.data?.message || 'Failed to save project');
      setUploadProgress('');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    setError(null);

    try {
      const axiosInstance = createAxiosInstance();
      await axiosInstance.delete(`/projects/${id}`);
      setDeleteConfirm(null);
      fetchProjects();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete project');
    } finally {
      setSaving(false);
    }
  };

  const toggleProjectActive = async (id: string, currentStatus: boolean) => {
    try {
      const axiosInstance = createAxiosInstance();
      await axiosInstance.patch(`/projects/${id}/toggle-active`);
      fetchProjects();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle project status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Projects Management</h1>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors shadow-lg"
          >
            <Plus size={20} />
            Add Project
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Projects Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {projects.length === 0 ? (
            <div className="p-12 text-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No projects yet. Create your first project!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Client</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {projects.map(project => (
                    <tr key={project._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{project.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{project.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{project.client}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => toggleProjectActive(project._id!, project.isActive!)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            project.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                          }`}
                        >
                          {project.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(project)}
                            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(project._id!)}
                            className="text-red-600 hover:text-red-700 font-semibold transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto w-full max-w-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Upload Progress */}
              {uploadProgress && (
                <div className="p-4 bg-blue-50 border-b border-blue-200">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    <p className="text-sm text-blue-700">{uploadProgress}</p>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="border-b">
                <div className="flex gap-0">
                  {['basic', 'details', 'images'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                        activeTab === tab
                          ? 'border-b-2 border-orange-500 text-orange-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {activeTab === 'basic' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Project title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Year *</label>
                        <input
                          type="text"
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="2024"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Kathmandu, Nepal"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Client *</label>
                      <input
                        type="text"
                        value={formData.client}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Client name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Describe the project..."
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Scope of Work (one per line)</label>
                      <textarea
                        value={scopeInput}
                        onChange={(e) => setScopeInput(e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                        placeholder="Basement waterproofing&#10;Terrace treatment&#10;Facade protection"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Challenges</label>
                      <textarea
                        value={formData.challenges}
                        onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Describe the challenges faced..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Solution</label>
                      <textarea
                        value={formData.solution}
                        onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Describe the solution implemented..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Results Achieved (one per line)</label>
                      <textarea
                        value={resultsInput}
                        onChange={(e) => setResultsInput(e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                        placeholder="Zero leakage post-treatment&#10;100% client satisfaction&#10;Completed ahead of schedule"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'images' && (
                  <div className="space-y-6">
                    {/* Main Image */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Main Project Image *</label>
                      {formData.image ? (
                        <div className="relative">
                          <img src={formData.image} alt="Main" className="w-full h-64 object-cover rounded-lg" />
                          <button
                            onClick={() => setFormData({ ...formData, image: '' })}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                          <Upload className="w-12 h-12 text-gray-400 mb-3" />
                          <span className="text-sm text-gray-600">Click to upload main image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'main')}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Gallery */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Project Gallery</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {formData.gallery.map((img, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={typeof img === 'string' ? img : img.url} 
                              alt={`Gallery ${index + 1}`} 
                              className="w-full h-32 object-cover rounded-lg" 
                            />
                            <button
                              onClick={() => removeGalleryImage(index)}
                              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Add gallery images</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageUpload(e, 'gallery')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 className="animate-spin" size={16} />}
                  {saving ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Delete Project</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this project? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}