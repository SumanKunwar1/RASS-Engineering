import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { PageHeader } from '@/components/admin/PageHeader';
import { FormModal } from '@/components/admin/FormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AboutContent, CompanyValue, TeamMember } from '@/types/admin';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2, Eye, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Image Upload Utility
const handleImageUpload = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Stat Item Interface (matching admin.ts stats structure)
interface StatItem {
  label: string;
  value: string;
}

// Helper function to convert AboutSection to AboutContent
const ensureAboutContent = (data: any): AboutContent => {
  // If it's already AboutContent with required fields
  if (data && 'heroTitle' in data && 'mission' in data) {
    return data as AboutContent;
  }
  
  // If it's AboutSection, convert it
  if (data && 'title' in data && 'subtitle' in data) {
    return {
      heroTitle: data.title || 'About Us',
      heroSubtitle: data.subtitle || '',
      mission: data.description1 || '',
      vision: data.description2 || '',
      history: '',
      values: [],
      team: [],
      stats: []
    };
  }
  
  // Default fallback
  return {
    heroTitle: 'About RASS Engineering',
    heroSubtitle: "Building Nepal's infrastructure with precision",
    mission: '',
    vision: '',
    history: '',
    values: [],
    team: [],
    stats: []
  };
};

export default function AdminAbout() {
  const { state, dispatch } = useAdmin();
  
  // Safely get about data and ensure it's AboutContent type
  const aboutData: AboutContent = ensureAboutContent(state.about);
  
  // Main content editing
  const [isEditingMain, setIsEditingMain] = useState(false);
  const [mainData, setMainData] = useState({
    heroTitle: aboutData.heroTitle || '',
    heroSubtitle: aboutData.heroSubtitle || '',
    mission: aboutData.mission || '',
    vision: aboutData.vision || ''
  });
  
  // Story/History section editing
  const [isEditingStory, setIsEditingStory] = useState(false);
  const [storyData, setStoryData] = useState({
    history: aboutData.history || '',
    storyImage: (aboutData as any).storyImage || '',
    storyTitle: (aboutData as any).storyTitle || 'Our Story'
  });
  
  // Team member editing
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  
  // Company value editing
  const [editingValue, setEditingValue] = useState<CompanyValue | null>(null);
  
  // Stats editing
  const [isEditingStats, setIsEditingStats] = useState(false);
  const [statsData, setStatsData] = useState<StatItem[]>(aboutData.stats || []);
  const [editingStat, setEditingStat] = useState<StatItem | null>(null);

  // Save main content (Hero, Mission, Vision)
  const handleSaveMain = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedAbout: AboutContent = {
      ...aboutData,
      heroTitle: mainData.heroTitle,
      heroSubtitle: mainData.heroSubtitle,
      mission: mainData.mission,
      vision: mainData.vision
    };
    dispatch({ type: 'SET_ABOUT', payload: updatedAbout as any });
    setIsEditingMain(false);
    toast.success('About page content updated successfully!');
  };

  // Save story section
  const handleSaveStory = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedAbout: any = {
      ...aboutData,
      history: storyData.history,
      storyImage: storyData.storyImage,
      storyTitle: storyData.storyTitle
    };
    dispatch({ type: 'SET_ABOUT', payload: updatedAbout });
    setIsEditingStory(false);
    toast.success('Story section updated successfully!');
  };

  // Handle story image upload
  const handleStoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await handleImageUpload(file);
        setStoryData({ ...storyData, storyImage: base64 });
        toast.success('Image uploaded successfully!');
      } catch (error) {
        toast.error('Failed to upload image');
      }
    }
  };

  // Team Member CRUD
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

  const handleTeamMemberImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingTeamMember) {
      try {
        const base64 = await handleImageUpload(file);
        setEditingTeamMember({ ...editingTeamMember, image: base64 });
        toast.success('Image uploaded successfully!');
      } catch (error) {
        toast.error('Failed to upload image');
      }
    }
  };

  const handleSaveTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeamMember) return;

    const currentTeam = aboutData.team || [];
    const exists = currentTeam.find((t) => t.id === editingTeamMember.id);
    const newTeam = exists
      ? currentTeam.map((t) => (t.id === editingTeamMember.id ? editingTeamMember : t))
      : [...currentTeam, editingTeamMember];

    const updatedAbout: AboutContent = {
      ...aboutData,
      team: newTeam
    };
    dispatch({ type: 'SET_ABOUT', payload: updatedAbout as any });
    setEditingTeamMember(null);
    toast.success('Team member saved successfully!');
  };

  const handleDeleteTeamMember = (id: string) => {
    const currentTeam = aboutData.team || [];
    const updatedAbout: AboutContent = {
      ...aboutData,
      team: currentTeam.filter((t) => t.id !== id)
    };
    dispatch({ type: 'SET_ABOUT', payload: updatedAbout as any });
    toast.success('Team member deleted successfully!');
  };

  // Company Values CRUD
  const handleAddValue = () => {
    const newValue: CompanyValue = {
      id: Date.now().toString(),
      icon: 'Award',
      title: '',
      description: '',
    };
    setEditingValue(newValue);
  };

  const handleSaveValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingValue) return;

    const currentValues = aboutData.values || [];
    const exists = currentValues.find((v) => v.id === editingValue.id);
    const newValues = exists
      ? currentValues.map((v) => (v.id === editingValue.id ? editingValue : v))
      : [...currentValues, editingValue];

    const updatedAbout: AboutContent = {
      ...aboutData,
      values: newValues
    };
    dispatch({ type: 'SET_ABOUT', payload: updatedAbout as any });
    setEditingValue(null);
    toast.success('Company value saved successfully!');
  };

  const handleDeleteValue = (id: string) => {
    const currentValues = aboutData.values || [];
    const updatedAbout: AboutContent = {
      ...aboutData,
      values: currentValues.filter((v) => v.id !== id)
    };
    dispatch({ type: 'SET_ABOUT', payload: updatedAbout as any });
    toast.success('Company value deleted successfully!');
  };

  // Stats CRUD
  const handleAddStat = () => {
    const newStat: StatItem = {
      label: '',
      value: '',
    };
    setEditingStat(newStat);
  };

  const handleSaveStat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStat) return;

    const currentStats = aboutData.stats || [];
    const newStats = [...currentStats, editingStat];

    setStatsData(newStats);
    const updatedAbout: AboutContent = {
      ...aboutData,
      stats: newStats
    };
    dispatch({ type: 'SET_ABOUT', payload: updatedAbout as any });
    setEditingStat(null);
    toast.success('Stat saved successfully!');
  };

  const handleDeleteStat = (index: number) => {
    const newStats = statsData.filter((_, i) => i !== index);
    setStatsData(newStats);
    const updatedAbout: AboutContent = {
      ...aboutData,
      stats: newStats
    };
    dispatch({ type: 'SET_ABOUT', payload: updatedAbout as any });
    toast.success('Stat deleted successfully!');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="About Page Management"
        description="Complete control over your About page content, team members, values, and more"
      />

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Main Content</TabsTrigger>
          <TabsTrigger value="story">Story Section</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="values">Company Values</TabsTrigger>
        </TabsList>

        {/* Main Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Hero & Mission/Vision</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Edit the hero section and mission/vision statements
                </p>
              </div>
              <Button onClick={() => {
                setMainData({
                  heroTitle: aboutData.heroTitle,
                  heroSubtitle: aboutData.heroSubtitle,
                  mission: aboutData.mission,
                  vision: aboutData.vision
                });
                setIsEditingMain(true);
              }}>
                <Pencil size={16} className="mr-2" />
                Edit Content
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Hero Title</h4>
                    <p className="text-lg font-bold">{aboutData.heroTitle}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Hero Subtitle</h4>
                    <p className="text-sm">{aboutData.heroSubtitle}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="text-primary" size={20} />
                      <h4 className="font-semibold">Mission</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{aboutData.mission}</p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="text-primary" size={20} />
                      <h4 className="font-semibold">Vision</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{aboutData.vision}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Company Statistics</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Display key metrics and achievements
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleAddStat}>
                <Plus size={14} className="mr-1" />
                Add Stat
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statsData.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 text-center relative">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 absolute top-2 right-2 text-destructive"
                        onClick={() => handleDeleteStat(index)}
                      >
                        <Trash2 size={12} />
                      </Button>
                      <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Story Section Tab */}
        <TabsContent value="story" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Company Story</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Edit your company's history and background
                </p>
              </div>
              <Button onClick={() => {
                setStoryData({
                  storyTitle: (aboutData as any).storyTitle || 'Our Story',
                  history: aboutData.history,
                  storyImage: (aboutData as any).storyImage || ''
                });
                setIsEditingStory(true);
              }}>
                <Pencil size={16} className="mr-2" />
                Edit Story
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(aboutData as any).storyImage && (
                  <img
                    src={(aboutData as any).storyImage}
                    alt="Company Story"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h4 className="font-semibold mb-2">{(aboutData as any).storyTitle || 'Our Story'}</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aboutData.history}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Members Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your team members and their profiles
                </p>
              </div>
              <Button onClick={handleAddTeamMember}>
                <Plus size={16} className="mr-2" />
                Add Team Member
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(aboutData.team || []).map((member) => (
                  <Card key={member.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {member.image ? (
                            <img 
                              src={member.image} 
                              alt={member.name} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <span className="text-2xl font-bold text-muted-foreground">
                              {member.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{member.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">{member.position}</p>
                          {member.email && (
                            <p className="text-xs text-muted-foreground truncate mt-1">{member.email}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => setEditingTeamMember(member)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteTeamMember(member.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      {member.bio && (
                        <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{member.bio}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Values Tab */}
        <TabsContent value="values" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Company Values</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Define your core company values and principles
                </p>
              </div>
              <Button onClick={handleAddValue}>
                <Plus size={16} className="mr-2" />
                Add Value
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {(aboutData.values || []).map((value) => (
                  <Card key={value.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">{value.title}</h4>
                          <p className="text-sm text-muted-foreground">{value.description}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8"
                            onClick={() => setEditingValue(value)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive"
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Main Content Modal */}
      <FormModal
        open={isEditingMain}
        onOpenChange={setIsEditingMain}
        title="Edit Main Content"
        onSubmit={handleSaveMain}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="heroTitle">Hero Title</Label>
            <Input
              id="heroTitle"
              value={mainData.heroTitle}
              onChange={(e) => setMainData({ ...mainData, heroTitle: e.target.value })}
              placeholder="About RASS Engineering"
            />
          </div>
          <div>
            <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
            <Input
              id="heroSubtitle"
              value={mainData.heroSubtitle}
              onChange={(e) => setMainData({ ...mainData, heroSubtitle: e.target.value })}
              placeholder="Building Nepal's infrastructure with precision..."
            />
          </div>
          <div>
            <Label htmlFor="mission">Mission Statement</Label>
            <Textarea
              id="mission"
              value={mainData.mission}
              onChange={(e) => setMainData({ ...mainData, mission: e.target.value })}
              rows={4}
              placeholder="To deliver world-class engineering solutions..."
            />
          </div>
          <div>
            <Label htmlFor="vision">Vision Statement</Label>
            <Textarea
              id="vision"
              value={mainData.vision}
              onChange={(e) => setMainData({ ...mainData, vision: e.target.value })}
              rows={4}
              placeholder="To be recognized as Nepal's leading..."
            />
          </div>
        </div>
      </FormModal>

      {/* Edit Story Modal */}
      <FormModal
        open={isEditingStory}
        onOpenChange={setIsEditingStory}
        title="Edit Company Story"
        onSubmit={handleSaveStory}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="storyTitle">Section Title</Label>
            <Input
              id="storyTitle"
              value={storyData.storyTitle}
              onChange={(e) => setStoryData({ ...storyData, storyTitle: e.target.value })}
              placeholder="Our Story"
            />
          </div>
          <div>
            <Label htmlFor="history">Company History</Label>
            <Textarea
              id="history"
              value={storyData.history}
              onChange={(e) => setStoryData({ ...storyData, history: e.target.value })}
              rows={6}
              placeholder="Founded in 2050 B.S., RASS Engineering..."
            />
          </div>
          <div>
            <Label htmlFor="storyImage">Story Image</Label>
            <div className="flex items-center gap-4">
              <Input
                id="storyImage"
                type="file"
                accept="image/*"
                onChange={handleStoryImageUpload}
                className="flex-1"
              />
              {storyData.storyImage && (
                <img 
                  src={storyData.storyImage} 
                  alt="Preview" 
                  className="w-20 h-20 object-cover rounded"
                />
              )}
            </div>
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
              <Label htmlFor="memberImage">Profile Image</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="memberImage"
                  type="file"
                  accept="image/*"
                  onChange={handleTeamMemberImageUpload}
                  className="flex-1"
                />
                {editingTeamMember.image && (
                  <img 
                    src={editingTeamMember.image} 
                    alt="Preview" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="memberName">Name *</Label>
              <Input
                id="memberName"
                value={editingTeamMember.name}
                onChange={(e) =>
                  setEditingTeamMember({ ...editingTeamMember, name: e.target.value })
                }
                required
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="memberPosition">Position *</Label>
              <Input
                id="memberPosition"
                value={editingTeamMember.position}
                onChange={(e) =>
                  setEditingTeamMember({ ...editingTeamMember, position: e.target.value })
                }
                required
                placeholder="Senior Engineer"
              />
            </div>
            <div>
              <Label htmlFor="memberEmail">Email</Label>
              <Input
                id="memberEmail"
                type="email"
                value={editingTeamMember.email || ''}
                onChange={(e) =>
                  setEditingTeamMember({ ...editingTeamMember, email: e.target.value })
                }
                placeholder="john@example.com"
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
                rows={4}
                placeholder="Brief bio about the team member..."
              />
            </div>
          </div>
        )}
      </FormModal>

      {/* Edit Company Value Modal */}
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
                placeholder="Award, Users, Target, Eye, etc."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use any Lucide icon name (e.g., Award, Users, Target, Eye, Heart)
              </p>
            </div>
            <div>
              <Label htmlFor="valueTitle">Title *</Label>
              <Input
                id="valueTitle"
                value={editingValue.title}
                onChange={(e) => setEditingValue({ ...editingValue, title: e.target.value })}
                required
                placeholder="Excellence"
              />
            </div>
            <div>
              <Label htmlFor="valueDescription">Description *</Label>
              <Textarea
                id="valueDescription"
                value={editingValue.description}
                onChange={(e) =>
                  setEditingValue({ ...editingValue, description: e.target.value })
                }
                rows={3}
                required
                placeholder="Committed to delivering the highest quality..."
              />
            </div>
          </div>
        )}
      </FormModal>

      {/* Edit Stat Modal */}
      <FormModal
        open={!!editingStat}
        onOpenChange={() => setEditingStat(null)}
        title="Add Statistic"
        onSubmit={handleSaveStat}
      >
        {editingStat && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="statValue">Value *</Label>
              <Input
                id="statValue"
                value={editingStat.value}
                onChange={(e) => setEditingStat({ ...editingStat, value: e.target.value })}
                required
                placeholder="500+"
              />
            </div>
            <div>
              <Label htmlFor="statLabel">Label *</Label>
              <Input
                id="statLabel"
                value={editingStat.label}
                onChange={(e) => setEditingStat({ ...editingStat, label: e.target.value })}
                required
                placeholder="Completed Projects"
              />
            </div>
          </div>
        )}
      </FormModal>
    </div>
  );
}