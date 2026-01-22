import React, { useState, useRef, useEffect } from 'react';
import { Plus, Upload, X, Trash2, Edit, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface BlogPost {
  _id?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  imagePublicId?: string;
  readTime: string;
  published: boolean;
  slug?: string;
  views?: number;
  tags?: string[];
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

// IMAGE COMPRESSION FUNCTION - Reduces image size by 60-70%
const compressImage = (file: File, maxQuality: number = 0.85): Promise<string> => {
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
        
        // Set max dimensions for featured image
        const maxWidth = 1200;
        const maxHeight = 630;
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

// Calculate total payload size
const calculatePayloadSize = (formData: BlogPost): number => {
  const imageSize = formData.image ? formData.image.length : 0;
  const contentSize = formData.content.length;
  const metadataSize = JSON.stringify({
    title: formData.title,
    excerpt: formData.excerpt,
    author: formData.author,
    date: formData.date,
    category: formData.category,
    readTime: formData.readTime,
    published: formData.published,
    tags: formData.tags
  }).length;
  
  return imageSize + contentSize + metadataSize;
};

// Format bytes to human readable
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'preview'>('basic');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    excerpt: '',
    content: '',
    author: 'RASS Engineering Team',
    date: new Date().toISOString().split('T')[0],
    category: '',
    image: '',
    readTime: '5 min',
    published: false,
    tags: []
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<any>(null);

  const categories = ['Waterproofing', 'Structural Engineering', 'Flooring Solutions', 'Construction Tips', 'Technology', 'Safety', 'Case Studies', 'Industry News'];

  // Fetch all blogs
  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get('/blogs/admin/all');
      console.log('Fetched blogs:', response.data);
      setPosts(response.data.data || []);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch blogs';
      setError(errorMsg);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Initialize Quill editor
  useEffect(() => {
    if (isModalOpen && activeTab === 'content' && editorRef.current && !quillInstanceRef.current) {
      const script = document.createElement('script');
      script.src = 'https://cdn.quilljs.com/1.3.6/quill.js';
      script.async = true;
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      const style = document.createElement('style');
      style.textContent = `
        .ql-editor img {
          cursor: pointer;
          max-width: 100%;
          display: inline-block;
        }
        .ql-editor img.resizing {
          outline: 3px solid #F46A1F;
          outline-offset: 2px;
        }
        .image-resize-handle {
          position: absolute;
          width: 14px;
          height: 14px;
          background: #F46A1F;
          border: 3px solid white;
          border-radius: 50%;
          cursor: nwse-resize;
          z-index: 1000;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          pointer-events: auto;
        }
        .image-resize-handle:hover {
          background: #d85a15;
          transform: scale(1.2);
        }
      `;
      document.head.appendChild(style);

      script.onload = () => {
        if (window.Quill && editorRef.current) {
          const toolbarOptions = [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],
            ['clean']
          ];

          quillInstanceRef.current = new window.Quill(editorRef.current, {
            theme: 'snow',
            modules: {
              toolbar: {
                container: toolbarOptions,
                handlers: {
                  image: imageHandler
                }
              }
            },
            placeholder: 'Write your blog content here...',
            scrollingContainer: editorRef.current.parentElement
          });

          if (formData.content) {
            quillInstanceRef.current.root.innerHTML = formData.content;
          }

          quillInstanceRef.current.on('text-change', (delta: any, oldDelta: any, source: string) => {
            if (source === 'user') {
              const html = quillInstanceRef.current.root.innerHTML;
              setFormData(prev => ({ ...prev, content: html }));
            }
          });

          setupImageResize();
        }
      };
    }

    return () => {
      if (quillInstanceRef.current) {
        quillInstanceRef.current = null;
      }
    };
  }, [isModalOpen, activeTab]);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        setUploadProgress('Compressing image...');
        // Compress images in content to 70% quality (smaller than featured image)
        const base64 = await compressImage(file, 0.7);
        setUploadProgress('');

        const range = quillInstanceRef.current.getSelection();
        quillInstanceRef.current.insertEmbed(range.index, 'image', base64);
      } catch (error) {
        console.error('Image compression error:', error);
        setError('Failed to process image');
        setUploadProgress('');
      }
    };

    input.click();
  };

  const setupImageResize = () => {
    const script = document.createElement('script');
    script.innerHTML = `
      (function() {
        const images = document.querySelectorAll('.ql-editor img');
        images.forEach(img => {
          img.addEventListener('click', function(e) {
            if (e.target.classList.contains('image-resize-handle')) return;
            
            const handle = document.querySelector('.image-resize-handle');
            if (handle) handle.remove();
            
            const rect = img.getBoundingClientRect();
            const handle2 = document.createElement('div');
            handle2.className = 'image-resize-handle';
            handle2.style.left = (rect.right - rect.left - 10) + 'px';
            handle2.style.top = (rect.bottom - rect.top - 10) + 'px';
            
            img.parentElement.appendChild(handle2);
          });
        });
      })();
    `;
    document.body.appendChild(script);
  };

  // Handle featured image upload with compression
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress('Compressing featured image...');
      const compressedImage = await compressImage(file, 0.85);
      setFormData(prev => ({ ...prev, image: compressedImage }));
      setUploadProgress('');
    } catch (err) {
      console.error('Image upload error:', err);
      setError('Failed to process image');
      setUploadProgress('');
    }
  };

  const handleCreate = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: 'RASS Engineering Team',
      date: new Date().toISOString().split('T')[0],
      category: '',
      image: '',
      readTime: '5 min',
      published: false,
      tags: []
    });
    setActiveTab('basic');
    setError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData(post);
    setActiveTab('basic');
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setError(null);

    // Validation
    if (!formData.title || !formData.excerpt || !formData.content || !formData.category || !formData.image) {
      setError('Please fill all required fields');
      return;
    }

    // Check payload size
    const payloadSize = calculatePayloadSize(formData);
    const payloadMB = payloadSize / (1024 * 1024);

    if (payloadMB > 50) {
      setError(`Payload too large (${formatBytes(payloadSize)}). Please reduce image quality or content size.`);
      return;
    }

    if (payloadMB > 20) {
      console.warn(`Large payload: ${formatBytes(payloadSize)}. Consider optimizing images.`);
    }

    setSaving(true);
    setUploadProgress(`Uploading blog post (${formatBytes(payloadSize)})...`);

    try {
      const axiosInstance = createAxiosInstance();

      if (editingPost && editingPost._id) {
        setUploadProgress('Updating blog post...');
        await axiosInstance.put(`/blogs/${editingPost._id}`, formData);
      } else {
        setUploadProgress('Creating blog post...');
        await axiosInstance.post('/blogs', formData);
      }

      setUploadProgress('');
      setIsModalOpen(false);
      fetchBlogs();
    } catch (err: any) {
      console.error('Save error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to save blog post';
      setError(errorMsg);
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
      await axiosInstance.delete(`/blogs/${id}`);
      setDeleteConfirm(null);
      fetchBlogs();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete blog post');
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const axiosInstance = createAxiosInstance();
      await axiosInstance.patch(`/blogs/${id}/toggle-published`);
      fetchBlogs();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle blog status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  const payloadSize = calculatePayloadSize(formData);
  const payloadMB = payloadSize / (1024 * 1024);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Blog Management</h1>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors shadow-lg"
          >
            <Plus size={20} />
            New Post
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

        {/* Blog Posts Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {posts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No blog posts yet. Create your first post!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Views</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {posts.map(post => (
                    <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{post.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{post.category}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => togglePublished(post._id!, post.published)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            post.published
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                          }`}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{post.views || 0}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(post)}
                            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(post._id!)}
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
            <div className="bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto w-full max-w-4xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
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

              {/* Payload Size Warning */}
              {payloadMB > 10 && (
                <div className="p-4 bg-yellow-50 border-b border-yellow-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-800">Large Payload</p>
                      <p className="text-sm text-yellow-700">
                        Current payload: {formatBytes(payloadSize)} (optimal: &lt;10MB). Consider optimizing images.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="border-b">
                <div className="flex gap-0">
                  {['basic', 'content', 'preview'].map(tab => (
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
                        placeholder="Blog post title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt *</label>
                      <textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Brief summary of the post (shown in blog list)"
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
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
                        <input
                          type="text"
                          value={formData.author}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Author name"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Publish Date</label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Read Time</label>
                        <input
                          type="text"
                          value={formData.readTime}
                          onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="5 min"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Featured Image *</label>
                      {formData.image ? (
                        <div className="relative">
                          <img src={formData.image} alt="Featured" className="w-full h-64 object-cover rounded-lg" />
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
                          <span className="text-sm text-gray-600">Click to upload featured image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="published"
                        checked={formData.published}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                      />
                      <label htmlFor="published" className="text-sm font-semibold text-gray-700">
                        Publish immediately
                      </label>
                    </div>
                  </div>
                )}

                {activeTab === 'content' && (
                  <div className="space-y-4" style={{ position: 'relative', height: '600px', display: 'flex', flexDirection: 'column' }}>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>💡 Tips:</strong> Images in content are automatically compressed. Use the editor below to format your content.
                      </p>
                    </div>
                    <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                      <div ref={editorRef} style={{ minHeight: '500px', backgroundColor: 'white' }} />
                    </div>
                  </div>
                )}

                {activeTab === 'preview' && (
                  <div className="prose prose-lg max-w-none">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{formData.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-8">
                      <span>📅 {new Date(formData.date).toLocaleDateString()}</span>
                      <span>✍️ {formData.author}</span>
                      <span>⏱️ {formData.readTime}</span>
                    </div>
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formData.content || '<p>No content yet. Go to Content Editor to start writing.</p>' }} 
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center gap-3 p-6 border-t bg-gray-50">
                <div className="text-sm text-gray-600">
                  Payload: {formatBytes(payloadSize)}
                </div>
                <div className="flex gap-3">
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
                    {saving ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Delete Blog Post</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this blog post? This action cannot be undone.
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

declare global {
  interface Window {
    Quill: any;
  }
}