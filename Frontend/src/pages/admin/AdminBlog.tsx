import React, { useState, useRef, useEffect } from 'react';
import { Plus, Upload, X, Trash2, Edit, Eye } from 'lucide-react';

// Blog Post Interface
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  published: boolean;
}

// Initial mock blog posts
const initialPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Essential Waterproofing Tips for Monsoon Season',
    excerpt: 'Prepare your building for heavy rainfall with these expert waterproofing strategies.',
    content: '<h2>Introduction to Waterproofing</h2><p>Monsoon season brings challenges...</p>',
    author: 'RASS Engineering Team',
    date: '2024-12-20',
    category: 'Waterproofing',
    image: 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=1200&q=80',
    readTime: '5 min',
    published: true
  }
];

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'preview'>('basic');
  const [previewContent, setPreviewContent] = useState('');

  // Form state
  const [formData, setFormData] = useState<BlogPost>({
    id: 0,
    title: '',
    excerpt: '',
    content: '',
    author: 'RASS Engineering Team',
    date: new Date().toISOString().split('T')[0],
    category: '',
    image: '',
    readTime: '5 min',
    published: false
  });

  // Quill editor reference
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<any>(null);

  // Initialize Quill editor
  useEffect(() => {
    if (isModalOpen && activeTab === 'content' && editorRef.current && !quillInstanceRef.current) {
      // Load Quill dynamically
      const script = document.createElement('script');
      script.src = 'https://cdn.quilljs.com/1.3.6/quill.js';
      script.async = true;
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      // Add custom styles for image resizing
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

          // Set initial content
          if (formData.content) {
            quillInstanceRef.current.root.innerHTML = formData.content;
          }

          // Listen for changes - save cursor position
          quillInstanceRef.current.on('text-change', (delta: any, oldDelta: any, source: string) => {
            if (source === 'user') {
              const html = quillInstanceRef.current.root.innerHTML;
              setFormData(prev => ({ ...prev, content: html }));
            }
          });

          // Add image resize functionality
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

  // Custom image handler for Quill
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          const range = quillInstanceRef.current.getSelection(true);
          quillInstanceRef.current.insertEmbed(range.index, 'image', base64);
          quillInstanceRef.current.setSelection(range.index + 1);
          
          // Setup resize for newly inserted image
          setTimeout(() => setupImageResize(), 100);
        };
        reader.readAsDataURL(file);
      }
    };
  };

  // Setup image resize functionality
  const setupImageResize = () => {
    if (!quillInstanceRef.current) return;

    const editor = quillInstanceRef.current.root;
    const images = editor.querySelectorAll('img');
    
    images.forEach((img: HTMLImageElement) => {
      if (img.dataset.resizable) return; // Already setup
      img.dataset.resizable = 'true';
      
      // Make image fit container by default
      if (!img.style.width) {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
      }
      
      let resizeHandle: HTMLDivElement | null = null;
      let isResizing = false;
      let startX = 0;
      let startY = 0;
      let startWidth = 0;
      let startHeight = 0;

      // Click to select image
      const selectImage = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Remove existing handles
        document.querySelectorAll('.image-resize-handle').forEach(h => h.remove());
        document.querySelectorAll('.resizing').forEach(i => i.classList.remove('resizing'));
        
        // Add selection styling
        img.classList.add('resizing');
        
        // Create resize handle
        resizeHandle = document.createElement('div');
        resizeHandle.className = 'image-resize-handle';
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.pointerEvents = 'auto';
        
        // Position handle at bottom-right of image
        const updateHandlePosition = () => {
          if (!resizeHandle) return;
          const imgRect = img.getBoundingClientRect();
          const containerRect = editor.parentElement?.getBoundingClientRect();
          if (containerRect) {
            resizeHandle.style.left = `${imgRect.right - containerRect.left - 6}px`;
            resizeHandle.style.top = `${imgRect.bottom - containerRect.top - 6}px`;
          }
        };
        
        updateHandlePosition();
        editor.parentElement?.style.setProperty('position', 'relative');
        editor.parentElement?.appendChild(resizeHandle);
        
        // Handle resize on mousedown
        const onHandleMouseDown = (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          isResizing = true;
          startX = e.clientX;
          startY = e.clientY;
          startWidth = img.offsetWidth;
          startHeight = img.offsetHeight;
          
          document.body.style.cursor = 'nwse-resize';
          document.body.style.userSelect = 'none';
          
          const onMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            // Use the larger delta for proportional resizing
            const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
            
            const newWidth = Math.max(50, Math.min(startWidth + delta, editor.offsetWidth - 20));
            const aspectRatio = startHeight / startWidth;
            const newHeight = newWidth * aspectRatio;
            
            img.style.width = `${newWidth}px`;
            img.style.height = `${newHeight}px`;
            img.style.maxWidth = 'none';
            
            updateHandlePosition();
          };
          
          const onMouseUp = () => {
            if (!isResizing) return;
            isResizing = false;
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            
            // Save content after resize
            setTimeout(() => {
              if (quillInstanceRef.current) {
                const html = quillInstanceRef.current.root.innerHTML;
                setFormData(prev => ({ ...prev, content: html }));
              }
            }, 100);
          };
          
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        };
        
        resizeHandle.addEventListener('mousedown', onHandleMouseDown);
      };

      img.addEventListener('click', selectImage);
    });

    // Click outside to deselect
    const deselectImages = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'IMG' && !target.classList.contains('image-resize-handle')) {
        document.querySelectorAll('.image-resize-handle').forEach(h => h.remove());
        document.querySelectorAll('.resizing').forEach(i => i.classList.remove('resizing'));
      }
    };
    
    editor.addEventListener('click', deselectImages);
  };

  // Update Quill content when switching tabs or editing
  useEffect(() => {
    if (quillInstanceRef.current && formData.content && activeTab === 'content') {
      const currentContent = quillInstanceRef.current.root.innerHTML;
      if (currentContent !== formData.content) {
        const selection = quillInstanceRef.current.getSelection();
        quillInstanceRef.current.root.innerHTML = formData.content;
        if (selection) {
          quillInstanceRef.current.setSelection(selection);
        }
      }
    }
  }, [activeTab]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = () => {
    setEditingPost(null);
    setFormData({
      id: Date.now(),
      title: '',
      excerpt: '',
      content: '',
      author: 'RASS Engineering Team',
      date: new Date().toISOString().split('T')[0],
      category: '',
      image: '',
      readTime: '5 min',
      published: false
    });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({ ...post });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingPost) {
      setPosts(prev => prev.map(p => p.id === formData.id ? formData : p));
    } else {
      setPosts(prev => [...prev, formData]);
    }
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const handleDelete = (id: number) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
  };

  const handlePreview = () => {
    setPreviewContent(formData.content);
    setActiveTab('preview');
  };

  const categories = ['Waterproofing', 'Structural Engineering', 'Flooring Solutions', 'Construction Tips', 'Technology', 'Safety'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-600 mt-1">Create and manage your blog content</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus size={20} />
            Add Blog Post
          </button>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {post.category}
                </div>
                {post.published && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Published
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                <div className="space-y-1 text-sm text-gray-500 mb-4">
                  <p>📅 {new Date(post.date).toLocaleDateString()}</p>
                  <p>✍️ {post.author}</p>
                  <p>⏱️ {post.readTime}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(post.id)}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col my-8">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
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
                  onClick={() => setActiveTab('content')}
                  className={`flex-1 px-6 py-3 font-semibold transition-colors ${
                    activeTab === 'content'
                      ? 'text-orange-500 border-b-2 border-orange-500 bg-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Content Editor
                </button>
                <button
                  onClick={handlePreview}
                  className={`flex-1 px-6 py-3 font-semibold transition-colors ${
                    activeTab === 'preview'
                      ? 'text-orange-500 border-b-2 border-orange-500 bg-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Preview
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'basic' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Blog Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter blog title"
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
                        <strong>💡 Tips:</strong> Use the rich text editor below to format your content. Click on images to resize them by dragging the corner handle.
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

              {/* Modal Footer */}
              <div className="flex justify-between items-center gap-3 p-6 border-t bg-gray-50">
                <div className="text-sm text-gray-600">
                  {formData.content && (
                    <span>Content length: {formData.content.replace(/<[^>]*>/g, '').length} characters</span>
                  )}
                </div>
                <div className="flex gap-3">
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
                    {editingPost ? 'Update Post' : 'Create Post'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
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

// Add to window object for Quill
declare global {
  interface Window {
    Quill: any;
  }
}