import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable, StatusBadge, Column } from '@/components/admin/DataTable';
import { FormModal, DeleteConfirmModal } from '@/components/admin/FormModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { BlogPost } from '@/types/admin';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

export default function AdminBlog() {
  const { state, dispatch } = useAdmin();
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const columns: Column<BlogPost>[] = [
    {
      key: 'image',
      label: 'Image',
      render: (item) => (
        <div className="w-16 h-10 rounded overflow-hidden bg-muted">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Title',
      render: (item) => <span className="font-medium line-clamp-1 max-w-xs">{item.title}</span>,
    },
    { key: 'category', label: 'Category' },
    { key: 'author', label: 'Author' },
    { key: 'date', label: 'Date' },
    {
      key: 'published',
      label: 'Status',
      render: (item) => <StatusBadge status={item.published ? 'published' : 'draft'} />,
    },
    { key: 'actions', label: 'Actions', className: 'w-20' },
  ];

  const handleCreate = () => {
    setEditingPost({
      id: Date.now().toString(),
      title: '',
      excerpt: '',
      content: '',
      author: 'Admin',
      date: new Date().toISOString().split('T')[0],
      category: '',
      image: '',
      readTime: '5 min',
      published: false,
    });
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    if (isCreating) {
      dispatch({ type: 'ADD_BLOG', payload: editingPost });
      toast.success('Blog post created successfully!');
    } else {
      dispatch({ type: 'UPDATE_BLOG', payload: editingPost });
      toast.success('Blog post updated successfully!');
    }
    setEditingPost(null);
    setIsCreating(false);
  };

  const handleDelete = () => {
    if (!deletingPost) return;
    dispatch({ type: 'DELETE_BLOG', payload: deletingPost.id });
    toast.success('Blog post deleted successfully!');
    setDeletingPost(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Posts"
        description="Manage your blog content"
        action={{
          label: 'Add Post',
          onClick: handleCreate,
          icon: Plus,
        }}
      />

      <DataTable
        data={state.blog}
        columns={columns}
        onEdit={(item) => {
          setEditingPost(item);
          setIsCreating(false);
        }}
        onDelete={setDeletingPost}
      />

      {/* Edit/Create Modal */}
      <FormModal
        open={!!editingPost}
        onOpenChange={() => {
          setEditingPost(null);
          setIsCreating(false);
        }}
        title={isCreating ? 'Add Blog Post' : 'Edit Blog Post'}
        onSubmit={handleSave}
        size="xl"
      >
        {editingPost && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editingPost.title}
                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                placeholder="Blog post title"
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={editingPost.excerpt}
                onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                placeholder="Brief summary of the post"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={editingPost.category}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, category: e.target.value })
                  }
                  placeholder="Waterproofing, Engineering, etc."
                />
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={editingPost.author}
                  onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={editingPost.date}
                  onChange={(e) => setEditingPost({ ...editingPost, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="readTime">Read Time</Label>
                <Input
                  id="readTime"
                  value={editingPost.readTime}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, readTime: e.target.value })
                  }
                  placeholder="5 min"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image">Featured Image URL</Label>
              <Input
                id="image"
                value={editingPost.image}
                onChange={(e) => setEditingPost({ ...editingPost, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={editingPost.content}
                onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                placeholder="Write your blog post content here..."
                rows={10}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="published"
                checked={editingPost.published}
                onCheckedChange={(checked) =>
                  setEditingPost({ ...editingPost, published: checked })
                }
              />
              <Label htmlFor="published">Published</Label>
            </div>
          </div>
        )}
      </FormModal>

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        open={!!deletingPost}
        onOpenChange={() => setDeletingPost(null)}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${deletingPost?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
