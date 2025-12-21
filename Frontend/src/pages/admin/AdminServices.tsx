import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { FormModal, DeleteConfirmModal } from '@/components/admin/FormModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ServiceItem } from '@/types/admin';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminServices() {
  const { state, dispatch } = useAdmin();
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [deletingService, setDeletingService] = useState<ServiceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const columns: Column<ServiceItem>[] = [
    {
      key: 'icon',
      label: 'Icon',
      render: (item) => (
        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
          <span className="text-xs text-primary font-medium">{item.icon.substring(0, 2)}</span>
        </div>
      ),
    },
    { key: 'title', label: 'Title' },
    {
      key: 'description',
      label: 'Description',
      render: (item) => (
        <span className="text-muted-foreground line-clamp-1 max-w-xs">{item.description}</span>
      ),
    },
    {
      key: 'features',
      label: 'Features',
      render: (item) => <span className="text-muted-foreground">{item.features.length} items</span>,
    },
    { key: 'actions', label: 'Actions', className: 'w-20' },
  ];

  const handleCreate = () => {
    setEditingService({
      id: Date.now().toString(),
      icon: 'Wrench',
      title: '',
      description: '',
      features: [],
      image: '',
    });
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    if (isCreating) {
      dispatch({ type: 'ADD_SERVICE', payload: editingService });
      toast.success('Service created successfully!');
    } else {
      dispatch({ type: 'UPDATE_SERVICE', payload: editingService });
      toast.success('Service updated successfully!');
    }
    setEditingService(null);
    setIsCreating(false);
  };

  const handleDelete = () => {
    if (!deletingService) return;
    dispatch({ type: 'DELETE_SERVICE', payload: deletingService.id });
    toast.success('Service deleted successfully!');
    setDeletingService(null);
  };

  const handleFeaturesChange = (value: string) => {
    if (!editingService) return;
    setEditingService({
      ...editingService,
      features: value.split('\n').filter((f) => f.trim()),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Manage your service offerings"
        action={{
          label: 'Add Service',
          onClick: handleCreate,
          icon: Plus,
        }}
      />

      <DataTable
        data={state.services}
        columns={columns}
        onEdit={(item) => {
          setEditingService(item);
          setIsCreating(false);
        }}
        onDelete={setDeletingService}
      />

      {/* Edit/Create Modal */}
      <FormModal
        open={!!editingService}
        onOpenChange={() => {
          setEditingService(null);
          setIsCreating(false);
        }}
        title={isCreating ? 'Add Service' : 'Edit Service'}
        onSubmit={handleSave}
        size="lg"
      >
        {editingService && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingService.title}
                  onChange={(e) =>
                    setEditingService({ ...editingService, title: e.target.value })
                  }
                  placeholder="Service title"
                />
              </div>
              <div>
                <Label htmlFor="icon">Icon Name (Lucide)</Label>
                <Input
                  id="icon"
                  value={editingService.icon}
                  onChange={(e) =>
                    setEditingService({ ...editingService, icon: e.target.value })
                  }
                  placeholder="Wrench, Building, Droplets"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editingService.description}
                onChange={(e) =>
                  setEditingService({ ...editingService, description: e.target.value })
                }
                placeholder="Describe this service"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea
                id="features"
                value={editingService.features.join('\n')}
                onChange={(e) => handleFeaturesChange(e.target.value)}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="image">Image URL (optional)</Label>
              <Input
                id="image"
                value={editingService.image || ''}
                onChange={(e) =>
                  setEditingService({ ...editingService, image: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        )}
      </FormModal>

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        open={!!deletingService}
        onOpenChange={() => setDeletingService(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        description={`Are you sure you want to delete "${deletingService?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
