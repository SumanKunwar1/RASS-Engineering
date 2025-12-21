import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { PageHeader, ContentCard } from '@/components/admin/PageHeader';
import { FormModal } from '@/components/admin/FormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SiteSettings } from '@/types/admin';
import { toast } from 'sonner';
import { Pencil, Globe, Image, Search } from 'lucide-react';

export default function AdminSettings() {
  const { state, dispatch } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<SiteSettings>(state.settings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_SETTINGS', payload: editData });
    setIsEditing(false);
    toast.success('Settings updated successfully!');
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data to defaults? This cannot be undone.')) {
      localStorage.removeItem('rass_admin_data');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Site Settings"
        description="Configure your website settings and SEO"
        action={{
          label: 'Edit Settings',
          onClick: () => {
            setEditData(state.settings);
            setIsEditing(true);
          },
          icon: Pencil,
        }}
      />

      {/* Settings Preview */}
      <div className="grid md:grid-cols-2 gap-6">
        <ContentCard title="General Settings">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Site Name</p>
                <p className="font-medium">{state.settings.siteName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tagline</p>
                <p className="font-medium">{state.settings.tagline}</p>
              </div>
            </div>
          </div>
        </ContentCard>

        <ContentCard title="SEO Settings">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Search className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">SEO Title</p>
                <p className="font-medium">{state.settings.seoTitle}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">SEO Description</p>
              <p className="text-sm">{state.settings.seoDescription}</p>
            </div>
          </div>
        </ContentCard>
      </div>

      {/* Danger Zone */}
      <ContentCard title="Danger Zone">
        <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
          <div>
            <h4 className="font-medium text-destructive">Reset All Data</h4>
            <p className="text-sm text-muted-foreground">
              This will reset all admin data to default values. This action cannot be undone.
            </p>
          </div>
          <Button variant="destructive" onClick={handleResetData}>
            Reset Data
          </Button>
        </div>
      </ContentCard>

      {/* API Integration Note */}
      <ContentCard title="API Integration">
        <div className="p-4 border border-info/20 rounded-lg bg-info/5">
          <h4 className="font-medium text-info mb-2">Ready for Backend Integration</h4>
          <p className="text-sm text-muted-foreground mb-3">
            This admin panel is designed to work with any backend API. Currently, data is stored in 
            localStorage for demonstration. To connect to your backend:
          </p>
          <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
            <li>Replace localStorage calls in AdminContext with API calls</li>
            <li>Update the reducer to handle async operations</li>
            <li>Add authentication middleware for admin routes</li>
            <li>Implement proper error handling and loading states</li>
          </ol>
        </div>
      </ContentCard>

      {/* Edit Modal */}
      <FormModal
        open={isEditing}
        onOpenChange={setIsEditing}
        title="Edit Site Settings"
        onSubmit={handleSave}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={editData.siteName}
              onChange={(e) => setEditData({ ...editData, siteName: e.target.value })}
              placeholder="RASS Engineering"
            />
          </div>

          <div>
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={editData.tagline}
              onChange={(e) => setEditData({ ...editData, tagline: e.target.value })}
              placeholder="Building Excellence Through Innovation"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={editData.logo}
                onChange={(e) => setEditData({ ...editData, logo: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div>
              <Label htmlFor="favicon">Favicon URL</Label>
              <Input
                id="favicon"
                value={editData.favicon}
                onChange={(e) => setEditData({ ...editData, favicon: e.target.value })}
                placeholder="https://example.com/favicon.ico"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">SEO Settings</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={editData.seoTitle}
                  onChange={(e) => setEditData({ ...editData, seoTitle: e.target.value })}
                  placeholder="Page title for search engines"
                />
              </div>
              <div>
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={editData.seoDescription}
                  onChange={(e) =>
                    setEditData({ ...editData, seoDescription: e.target.value })
                  }
                  placeholder="Brief description for search results"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="gaId">Google Analytics ID (optional)</Label>
                <Input
                  id="gaId"
                  value={editData.googleAnalyticsId || ''}
                  onChange={(e) =>
                    setEditData({ ...editData, googleAnalyticsId: e.target.value })
                  }
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
