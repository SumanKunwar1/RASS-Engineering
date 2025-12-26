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

export default function AdminProjects() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'images'>('basic');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'gallery') => {
    const files = e.target.files;
    if (!files) return;

    try {
      const fileArray = Array.from(files);
      const base64Promises = fileArray.map(file => fileToBase64(file));
      const base64Results = await Promise.all(base64Promises);

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
        await axiosInstance.put(`/projects/${editingProject._id}`, projectToSave);
      } else {
        // Create new project
        await axiosInstance.post('/projects', projectToSave);
      }

      await fetchProjects();
      setIsModalOpen(false);
      setEditingProject(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save project');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const axiosInstance = createAxiosInstance();
      await axiosInstance.delete(`/projects/${id}`);
      await fetchProjects();
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete project');
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects Management</h1>
            <p className="text-gray-600 mt-1">Manage your portfolio of projects</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus size={20} />
            Add Project
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">
              <X size={20} />
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-orange-500" size={48} />
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div key={project._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {project.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h3>
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p>📍 {project.location}</p>
                    <p>📅 {project.year}</p>
                    <p>👤 {project.client}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(project._id || null)}
                      className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit/Create Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b bg-gray-50">
                {['basic', 'details', 'images'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 px-6 py-3 font-semibold transition-colors capitalize ${
                      activeTab === tab
                        ? 'text-orange-500 border-b-2 border-orange-500 bg-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab === 'basic' ? 'Basic Info' : tab === 'details' ? 'Project Details' : 'Images'}
                  </button>
                ))}
              </div>

              {/* Error in Modal */}
              {error && (
                <div className="m-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'basic' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter project title"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
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
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
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