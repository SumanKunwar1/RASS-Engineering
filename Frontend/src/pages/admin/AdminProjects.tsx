import React, { useState } from 'react';
import { Plus, Upload, X, Image as ImageIcon, Trash2, Edit } from 'lucide-react';

// Mock data structure
interface ProjectData {
  id: number;
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
  gallery: string[];
}

// Initial mock projects
const initialProjects: ProjectData[] = [
  {
    id: 1,
    title: 'Kathmandu Corporate Tower Waterproofing',
    category: 'Waterproofing',
    location: 'Kathmandu, Nepal',
    year: '2024',
    client: 'Confidential',
    description: 'Complete waterproofing solution for a 15-story corporate tower including basement, terrace, and facade treatment.',
    scope: ['Basement waterproofing', 'Terrace treatment', 'Facade protection', 'Water tank sealing'],
    challenges: 'Working on an occupied building required careful planning and execution without disrupting daily operations.',
    solution: 'Implemented advanced membrane waterproofing system with minimal disruption using weekend and night shifts.',
    results: ['Zero leakage post-treatment', '100% client satisfaction', 'Completed 2 weeks ahead of schedule'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
      'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800&q=80',
    ]
  }
];

export default function AdminProjects() {
  const [projects, setProjects] = useState<ProjectData[]>(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'images'>('basic');

  // Form state
  const [formData, setFormData] = useState<ProjectData>({
    id: 0,
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

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'gallery') => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'main') {
          setFormData(prev => ({ ...prev, image: base64String }));
        } else {
          setFormData(prev => ({ ...prev, gallery: [...prev.gallery, base64String] }));
        }
      };
      reader.readAsDataURL(file);
    });
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
      id: Date.now(),
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
    setIsModalOpen(true);
  };

  const handleEdit = (project: ProjectData) => {
    setEditingProject(project);
    setFormData(project);
    setScopeInput(project.scope.join('\n'));
    setResultsInput(project.results.join('\n'));
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const projectToSave = {
      ...formData,
      scope: scopeInput.split('\n').filter(s => s.trim()),
      results: resultsInput.split('\n').filter(r => r.trim())
    };

    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === projectToSave.id ? projectToSave : p));
    } else {
      setProjects(prev => [...prev, projectToSave]);
    }

    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleDelete = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
  };

  const categories = ['Waterproofing', 'Structural Retrofitting', 'Epoxy Flooring', 'ACP Cladding', 'Metal Fabrication', 'Expansion Joint'];

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

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
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
                    onClick={() => setDeleteConfirm(project.id)}
                    className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

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
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`flex-1 px-6 py-3 font-semibold transition-colors ${
                    activeTab === 'basic'
                      ? 'text-orange-500 border-b-2 border-orange-500 bg-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Basic Info
                </button>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 px-6 py-3 font-semibold transition-colors ${
                    activeTab === 'details'
                      ? 'text-orange-500 border-b-2 border-orange-500 bg-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Project Details
                </button>
                <button
                  onClick={() => setActiveTab('images')}
                  className={`flex-1 px-6 py-3 font-semibold transition-colors ${
                    activeTab === 'images'
                      ? 'text-orange-500 border-b-2 border-orange-500 bg-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Images
                </button>
              </div>

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
                            <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
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
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
                >
                  {editingProject ? 'Update Project' : 'Create Project'}
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