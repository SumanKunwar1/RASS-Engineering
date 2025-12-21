import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { PageHeader, ContentCard } from '@/components/admin/PageHeader';
import { FormModal } from '@/components/admin/FormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ContactInfo } from '@/types/admin';
import { toast } from 'sonner';
import { Pencil, Phone, Mail, MapPin, Clock, Share2 } from 'lucide-react';

export default function AdminContact() {
  const { state, dispatch } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ContactInfo>(state.contact);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_CONTACT', payload: editData });
    setIsEditing(false);
    toast.success('Contact information updated successfully!');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Information"
        description="Manage your business contact details and social links"
        action={{
          label: 'Edit Contact',
          onClick: () => {
            setEditData(state.contact);
            setIsEditing(true);
          },
          icon: Pencil,
        }}
      />

      {/* Contact Info Preview */}
      <div className="grid md:grid-cols-2 gap-6">
        <ContentCard title="Contact Details">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{state.contact.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{state.contact.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{state.contact.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Working Hours</p>
                <p className="font-medium">{state.contact.workingHours}</p>
              </div>
            </div>
          </div>
        </ContentCard>

        <ContentCard title="Social Links">
          <div className="space-y-4">
            {Object.entries(state.contact.socialLinks).map(([key, value]) => (
              value && (
                <div key={key} className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Share2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground capitalize">{key}</p>
                    <p className="font-medium text-sm truncate max-w-xs">{value}</p>
                  </div>
                </div>
              )
            ))}
            {Object.values(state.contact.socialLinks).every(v => !v) && (
              <p className="text-muted-foreground">No social links configured</p>
            )}
          </div>
        </ContentCard>
      </div>

      {/* Edit Modal */}
      <FormModal
        open={isEditing}
        onOpenChange={setIsEditing}
        title="Edit Contact Information"
        onSubmit={handleSave}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                placeholder="977-01-5907561"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                placeholder="info@example.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={editData.address}
              onChange={(e) => setEditData({ ...editData, address: e.target.value })}
              placeholder="Kathmandu, Nepal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workingHours">Working Hours</Label>
              <Input
                id="workingHours"
                value={editData.workingHours}
                onChange={(e) => setEditData({ ...editData, workingHours: e.target.value })}
                placeholder="Sun - Fri: 10:00 AM - 6:00 PM"
              />
            </div>
            <div>
              <Label htmlFor="mapUrl">Google Maps URL</Label>
              <Input
                id="mapUrl"
                value={editData.mapUrl}
                onChange={(e) => setEditData({ ...editData, mapUrl: e.target.value })}
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Social Links</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={editData.socialLinks.facebook || ''}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      socialLinks: { ...editData.socialLinks, facebook: e.target.value },
                    })
                  }
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={editData.socialLinks.linkedin || ''}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      socialLinks: { ...editData.socialLinks, linkedin: e.target.value },
                    })
                  }
                  placeholder="https://linkedin.com/..."
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={editData.socialLinks.twitter || ''}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      socialLinks: { ...editData.socialLinks, twitter: e.target.value },
                    })
                  }
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={editData.socialLinks.instagram || ''}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      socialLinks: { ...editData.socialLinks, instagram: e.target.value },
                    })
                  }
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
