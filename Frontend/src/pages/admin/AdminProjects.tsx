import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable, StatusBadge, Column } from '@/components/admin/DataTable';
import { FormModal, DeleteConfirmModal } from '@/components/admin/FormModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectItem } from '@/types/admin';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

export default function AdminProjects() {
  const { state, dispatch } = useAdmin();
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [deletingProject, setDeletingProject] = useState<ProjectItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const columns: Column<ProjectItem>[] = [
    {
      key: 'image',
      label: 'Image',
      render: (item) => (
        <div className="w-16 h-10 rounded overflow-hidden bg-muted">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        </div>
      ),
    },
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'location', label: 'Location' },
    { key: 'year', label: 'Year' },
    {
      key: 'status',
      label: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
    { key: 'actions', label: 'Actions', className: 'w-20' },
  ];

  const handleCreate = () => {
    setEditingProject({
      id: Date.now().toString(),
      title: '',
      description: '',
      category: '',
      image: '',
      location: '',
      year: new Date().getFullYear().toString(),
      client: '',
      features: [],
      status: 'ongoing',
    });
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (isCreating) {
      dispatch({ type: 'ADD_PROJECT', payload: editingProject });
      toast.success('Project created successfully!');
    } else {
      dispatch({ type: 'UPDATE_PROJECT', payload: editingProject });
      toast.success('Project updated successfully!');
    }
    setEditingProject(null);
    setIsCreating(false);
  };

  const handleDelete = () => {
    if (!deletingProject) return;
    dispatch({ type: 'DELETE_PROJECT', payload: deletingProject.id });
    toast.success('Project deleted successfully!');
    setDeletingProject(null);
  };

  const handleFeaturesChange = (value: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      features: value.split('\n').filter((f) => f.trim()),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage your portfolio of projects"
        action={{
          label: 'Add Project',
          onClick: handleCreate,
          icon: Plus,
        }}
      />

      <DataTable
        data={state.projects}
        columns={columns}
        onEdit={(item) => {
          setEditingProject(item);
          setIsCreating(false);
        }}
        onDelete={setDeletingProject}
      />

      {/* Edit/Create Modal */}
      <FormModal
        open={!!editingProject}
        onOpenChange={() => {
          setEditingProject(null);
          setIsCreating(false);
        }}
        title={isCreating ? 'Add Project' : 'Edit Project'}
        onSubmit={handleSave}
        size="lg"
      >
        {editingProject && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={editingProject.title}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, title: e.target.value })
                }
                placeholder="Project name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editingProject.description}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, description: e.target.value })
                }
                placeholder="Describe this project"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={editingProject.category}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, category: e.target.value })
                  }
                  placeholder="Commercial, Healthcare, etc."
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editingProject.status}
                  onValueChange={(value: 'completed' | 'ongoing' | 'upcoming') =>
                    setEditingProject({ ...editingProject, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editingProject.location}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, location: e.target.value })
                  }
                  placeholder="Kathmandu, Nepal"
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={editingProject.year}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, year: e.target.value })
                  }
                  placeholder="2024"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                value={editingProject.client}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, client: e.target.value })
                }
                placeholder="Client name"
              />
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={editingProject.image}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, image: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea
                id="features"
                value={editingProject.features.join('\n')}
                onChange={(e) => handleFeaturesChange(e.target.value)}
                placeholder="Waterproofing&#10;Structural repair&#10;Facade treatment"
                rows={4}
              />
            </div>
          </div>
        )}
      </FormModal>

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        open={!!deletingProject}
        onOpenChange={() => setDeletingProject(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        description={`Are you sure you want to delete "${deletingProject?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
