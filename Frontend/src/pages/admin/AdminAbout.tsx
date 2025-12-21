import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { PageHeader, ContentCard } from '@/components/admin/PageHeader';
import { FormModal } from '@/components/admin/FormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AboutContent, CompanyValue, TeamMember } from '@/types/admin';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminAbout() {
  const { state, dispatch } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<AboutContent>(state.about);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [editingValue, setEditingValue] = useState<CompanyValue | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_ABOUT', payload: editData });
    setIsEditing(false);
    toast.success('About page updated successfully!');
  };

  const handleAddTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: '',
      position: '',
      bio: '',
      image: '',
    };
    setEditingTeamMember(newMember);
  };

  const handleSaveTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeamMember) return;

    const exists = editData.team.find((t) => t.id === editingTeamMember.id);
    const newTeam = exists
      ? editData.team.map((t) => (t.id === editingTeamMember.id ? editingTeamMember : t))
      : [...editData.team, editingTeamMember];

    setEditData({ ...editData, team: newTeam });
    setEditingTeamMember(null);
    toast.success('Team member saved!');
  };

  const handleDeleteTeamMember = (id: string) => {
    setEditData({
      ...editData,
      team: editData.team.filter((t) => t.id !== id),
    });
    toast.success('Team member removed!');
  };

  const handleAddValue = () => {
    const newValue: CompanyValue = {
      id: Date.now().toString(),
      icon: 'Star',
      title: '',
      description: '',
    };
    setEditingValue(newValue);
  };

  const handleSaveValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingValue) return;

    const exists = editData.values.find((v) => v.id === editingValue.id);
    const newValues = exists
      ? editData.values.map((v) => (v.id === editingValue.id ? editingValue : v))
      : [...editData.values, editingValue];

    setEditData({ ...editData, values: newValues });
    setEditingValue(null);
    toast.success('Value saved!');
  };

  const handleDeleteValue = (id: string) => {
    setEditData({
      ...editData,
      values: editData.values.filter((v) => v.id !== id),
    });
    toast.success('Value removed!');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="About Page"
        description="Manage your about page content, team, and company values"
        action={{
          label: 'Edit Content',
          onClick: () => {
            setEditData(state.about);
            setIsEditing(true);
          },
          icon: Pencil,
        }}
      />

      {/* Preview Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <ContentCard title="Mission & Vision">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Mission</h4>
              <p className="text-foreground">{state.about.mission}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Vision</h4>
              <p className="text-foreground">{state.about.vision}</p>
            </div>
          </div>
        </ContentCard>

        <ContentCard title="Company Stats">
          <div className="grid grid-cols-2 gap-4">
            {state.about.stats.map((stat, index) => (
              <div key={index} className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </ContentCard>
      </div>

      {/* Team Members */}
      <ContentCard
        title="Team Members"
        headerAction={
          <Button size="sm" variant="outline" onClick={handleAddTeamMember}>
            <Plus size={14} className="mr-1" />
            Add Member
          </Button>
        }
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.about.team.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-muted-foreground">
                        {member.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{member.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">{member.position}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingTeamMember(member)}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleDeleteTeamMember(member.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentCard>

      {/* Company Values */}
      <ContentCard
        title="Company Values"
        headerAction={
          <Button size="sm" variant="outline" onClick={handleAddValue}>
            <Plus size={14} className="mr-1" />
            Add Value
          </Button>
        }
      >
        <div className="grid md:grid-cols-2 gap-4">
          {state.about.values.map((value) => (
            <Card key={value.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-medium">{value.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{value.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditingValue(value)}>
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleDeleteValue(value.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentCard>

      {/* Edit About Modal */}
      <FormModal
        open={isEditing}
        onOpenChange={setIsEditing}
        title="Edit About Page"
        onSubmit={handleSave}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="heroTitle">Hero Title</Label>
            <Input
              id="heroTitle"
              value={editData.heroTitle}
              onChange={(e) => setEditData({ ...editData, heroTitle: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
            <Input
              id="heroSubtitle"
              value={editData.heroSubtitle}
              onChange={(e) => setEditData({ ...editData, heroSubtitle: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="mission">Mission Statement</Label>
            <Textarea
              id="mission"
              value={editData.mission}
              onChange={(e) => setEditData({ ...editData, mission: e.target.value })}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="vision">Vision Statement</Label>
            <Textarea
              id="vision"
              value={editData.vision}
              onChange={(e) => setEditData({ ...editData, vision: e.target.value })}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="history">Company History</Label>
            <Textarea
              id="history"
              value={editData.history}
              onChange={(e) => setEditData({ ...editData, history: e.target.value })}
              rows={4}
            />
          </div>
        </div>
      </FormModal>

      {/* Edit Team Member Modal */}
      <FormModal
        open={!!editingTeamMember}
        onOpenChange={() => setEditingTeamMember(null)}
        title={editingTeamMember?.name ? 'Edit Team Member' : 'Add Team Member'}
        onSubmit={handleSaveTeamMember}
      >
        {editingTeamMember && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="memberName">Name</Label>
              <Input
                id="memberName"
                value={editingTeamMember.name}
                onChange={(e) =>
                  setEditingTeamMember({ ...editingTeamMember, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="memberPosition">Position</Label>
              <Input
                id="memberPosition"
                value={editingTeamMember.position}
                onChange={(e) =>
                  setEditingTeamMember({ ...editingTeamMember, position: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="memberBio">Bio</Label>
              <Textarea
                id="memberBio"
                value={editingTeamMember.bio}
                onChange={(e) =>
                  setEditingTeamMember({ ...editingTeamMember, bio: e.target.value })
                }
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="memberImage">Image URL</Label>
              <Input
                id="memberImage"
                value={editingTeamMember.image}
                onChange={(e) =>
                  setEditingTeamMember({ ...editingTeamMember, image: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="memberEmail">Email (optional)</Label>
              <Input
                id="memberEmail"
                type="email"
                value={editingTeamMember.email || ''}
                onChange={(e) =>
                  setEditingTeamMember({ ...editingTeamMember, email: e.target.value })
                }
              />
            </div>
          </div>
        )}
      </FormModal>

      {/* Edit Value Modal */}
      <FormModal
        open={!!editingValue}
        onOpenChange={() => setEditingValue(null)}
        title={editingValue?.title ? 'Edit Company Value' : 'Add Company Value'}
        onSubmit={handleSaveValue}
      >
        {editingValue && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="valueIcon">Icon Name (Lucide)</Label>
              <Input
                id="valueIcon"
                value={editingValue.icon}
                onChange={(e) => setEditingValue({ ...editingValue, icon: e.target.value })}
                placeholder="Award, Users, Target, etc."
              />
            </div>
            <div>
              <Label htmlFor="valueTitle">Title</Label>
              <Input
                id="valueTitle"
                value={editingValue.title}
                onChange={(e) => setEditingValue({ ...editingValue, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="valueDescription">Description</Label>
              <Textarea
                id="valueDescription"
                value={editingValue.description}
                onChange={(e) =>
                  setEditingValue({ ...editingValue, description: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
        )}
      </FormModal>
    </div>
  );
}
