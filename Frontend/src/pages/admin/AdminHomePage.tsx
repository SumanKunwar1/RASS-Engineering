import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { PageHeader, ContentCard } from '@/components/admin/PageHeader';
import { FormModal } from '@/components/admin/FormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HeroSection } from '@/types/admin';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

export default function AdminHome() {
  const { state, dispatch } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<HeroSection>(state.hero);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_HERO', payload: editData });
    setIsEditing(false);
    toast.success('Home page updated successfully!');
  };

  const handleImageAdd = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setEditData({
        ...editData,
        images: [...editData.images, url],
      });
    }
  };

  const handleImageRemove = (index: number) => {
    setEditData({
      ...editData,
      images: editData.images.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Home Page"
        description="Manage your homepage hero section and featured content"
        action={{
          label: 'Edit Hero',
          onClick: () => {
            setEditData(state.hero);
            setIsEditing(true);
          },
          icon: Pencil,
        }}
      />

      {/* Current Hero Preview */}
      <ContentCard title="Hero Section Preview">
        <div className="space-y-4">
          <div className="p-6 bg-muted/50 rounded-lg">
            <h3 className="text-2xl font-bold text-foreground mb-2">{state.hero.title}</h3>
            <p className="text-muted-foreground mb-4">{state.hero.subtitle}</p>
            <Button size="sm">{state.hero.ctaText}</Button>
          </div>

          <div>
            <h4 className="font-medium mb-3">Hero Images ({state.hero.images.length})</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {state.hero.images.map((img, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={img}
                    alt={`Hero ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </ContentCard>

      {/* Edit Modal */}
      <FormModal
        open={isEditing}
        onOpenChange={setIsEditing}
        title="Edit Hero Section"
        description="Update the homepage hero section content"
        onSubmit={handleSave}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Enter hero title"
            />
          </div>

          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea
              id="subtitle"
              value={editData.subtitle}
              onChange={(e) => setEditData({ ...editData, subtitle: e.target.value })}
              placeholder="Enter hero subtitle"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ctaText">CTA Button Text</Label>
              <Input
                id="ctaText"
                value={editData.ctaText}
                onChange={(e) => setEditData({ ...editData, ctaText: e.target.value })}
                placeholder="Get Started"
              />
            </div>
            <div>
              <Label htmlFor="ctaLink">CTA Button Link</Label>
              <Input
                id="ctaLink"
                value={editData.ctaLink}
                onChange={(e) => setEditData({ ...editData, ctaLink: e.target.value })}
                placeholder="/contact"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Hero Images</Label>
              <Button type="button" size="sm" variant="outline" onClick={handleImageAdd}>
                <Plus size={14} className="mr-1" />
                Add Image
              </Button>
            </div>
            <div className="space-y-2">
              {editData.images.map((img, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-16 h-10 rounded bg-muted overflow-hidden flex-shrink-0">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <Input
                    value={img}
                    onChange={(e) => {
                      const newImages = [...editData.images];
                      newImages[index] = e.target.value;
                      setEditData({ ...editData, images: newImages });
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleImageRemove(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
