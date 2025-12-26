import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { PageHeader, ContentCard } from '@/components/admin/PageHeader';
import { FormModal } from '@/components/admin/FormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2, Phone, Mail, Upload, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as Icons from 'lucide-react';

interface HeroButton {
  id: string;
  label: string;
  route: string;
  variant?: 'primary' | 'outline';
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  [key: string]: any;
}

interface ContactInfo {
  heading: string;
  subheading: string;
  phone: string;
  email: string;
  [key: string]: any;
}

export default function AdminHome() {
  const { 
    state, 
    saveHeroSection, 
    saveAboutSection, 
    saveServices, 
    saveContactCTA,
    uploadImages,
    deleteImage,
    loadHomepageData,
    isLoading 
  } = useAdmin();
  
  // Hero Section State
  const [isEditingHero, setIsEditingHero] = useState(false);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [heroTitle, setHeroTitle] = useState<string>('');
  const [heroTitleHighlight, setHeroTitleHighlight] = useState<string>('');
  const [heroSubtitle, setHeroSubtitle] = useState<string>('');
  const [heroButtons, setHeroButtons] = useState<HeroButton[]>([]);
  const [isAddingButton, setIsAddingButton] = useState(false);
  const [editingButton, setEditingButton] = useState<HeroButton | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  // About Section State
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutData, setAboutData] = useState({
    subtitle: '',
    title: '',
    description1: '',
    description2: '',
    image: '',
    managingDirector: ''
  });

  // Services State
  const [isEditingService, setIsEditingService] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [currentService, setCurrentService] = useState<Service | null>(null);

  // Contact Info State
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactData, setContactData] = useState<ContactInfo>({
    heading: '',
    subheading: '',
    phone: '',
    email: ''
  });

  // Available icons for services
  const availableIcons = [
    'Hammer', 'Building2', 'Mountain', 'Wrench', 'HardHat', 'Ruler',
    'Construction', 'Drill', 'Bolt', 'Cog', 'Settings', 'Tool'
  ];

  // Load data on component mount and when state changes
  useEffect(() => {
    if (state.hero) {
      setHeroImages(state.hero.images || []);
      setHeroTitle(state.hero.title || '32+ Years of');
      setHeroTitleHighlight(state.hero.titleHighlight || 'Engineering Excellence');
      setHeroSubtitle(state.hero.subtitle || 'Specialized Construction Solutions & Engineering Services');
      setHeroButtons(state.hero.buttons || []);
    }
    
    if (state.services) {
      setServices(state.services);
    }
    
    if (state.about) {
      const managingDirector = typeof state.about.managingDirector === 'object' 
        ? state.about.managingDirector.name || ''
        : state.about.managingDirector || '';
        
      setAboutData({
        subtitle: state.about.subtitle || 'ABOUT US',
        title: state.about.title || 'Building Trust Since 2050 B.S.',
        description1: state.about.description1 || '',
        description2: state.about.description2 || '',
        image: state.about.image || '',
        managingDirector: managingDirector
      });
    }
    
    if (state.contact) {
      setContactData({
        heading: state.contact.heading || 'Ready to Start Your Project?',
        subheading: state.contact.subheading || 'Get a free site inspection and consultation from our expert engineers',
        phone: state.contact.phone || '+977-01-4782881',
        email: state.contact.email || 'info@rassengineering.com'
      });
    }
  }, [state]);

  // ==================== HERO SECTION HANDLERS ====================
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedHero = {
      title: heroTitle,
      titleHighlight: heroTitleHighlight,
      subtitle: heroSubtitle,
      buttons: heroButtons,
      images: heroImages
    };
    
    try {
      await saveHeroSection(updatedHero);
      setIsEditingHero(false);
      toast.success('Hero section updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save hero section');
    }
  };

  // ==================== HERO IMAGE UPLOAD - AUTO-SAVES ====================
  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    
    try {
      console.log('Uploading', files.length, 'hero images...');
      
      // Upload images to Cloudinary
      const uploadedImages = await uploadImages(Array.from(files), 'hero');
      console.log('Upload successful:', uploadedImages);
      
      // Get the new image URLs
      const newImageUrls = uploadedImages.map(img => img.url);
      
      // Update local state with new images
      const updatedImages = [...heroImages, ...newImageUrls];
      setHeroImages(updatedImages);
      
      // IMPORTANT: Auto-save to database immediately
      console.log('Saving to database...');
      await saveHeroSection({
        title: heroTitle,
        titleHighlight: heroTitleHighlight,
        subtitle: heroSubtitle,
        buttons: heroButtons,
        images: updatedImages
      });
      
      toast.success(`${uploadedImages.length} image(s) uploaded and saved!`);
    } catch (error: any) {
      console.error('Hero upload error:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  // ==================== HERO IMAGE REMOVE - AUTO-SAVES ====================
  const handleRemoveHeroImage = async (index: number) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    const imageToRemove = heroImages[index];
    console.log('Removing image:', imageToRemove);
    
    // Delete from Cloudinary if it's a Cloudinary URL
    if (imageToRemove.includes('cloudinary.com')) {
      try {
        console.log('Deleting from Cloudinary...');
        await deleteImage(imageToRemove);
        console.log('Deleted from Cloudinary successfully');
      } catch (error: any) {
        console.error('Cloudinary delete error:', error);
        toast.error('Failed to delete from Cloudinary: ' + error.message);
        return; // Stop if Cloudinary delete fails
      }
    }
    
    // Update local state (remove image)
    const updatedImages = heroImages.filter((_, i) => i !== index);
    setHeroImages(updatedImages);
    
    // IMPORTANT: Auto-save to database immediately
    try {
      console.log('Saving updated images to database...');
      await saveHeroSection({
        title: heroTitle,
        titleHighlight: heroTitleHighlight,
        subtitle: heroSubtitle,
        buttons: heroButtons,
        images: updatedImages
      });
      
      toast.success('Image removed and saved successfully!');
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error('Failed to save changes');
      // Revert the local state if save failed
      setHeroImages(heroImages);
    }
  };

  const handleImageUrlChange = (index: number, url: string) => {
    const newImages = [...heroImages];
    newImages[index] = url;
    setHeroImages(newImages);
  };

  // ==================== HERO BUTTONS HANDLERS ====================
  const handleAddButton = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingButton?.label || !editingButton?.route) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const newButton: HeroButton = {
      id: editingButton.id || Date.now().toString(),
      label: editingButton.label,
      route: editingButton.route,
      variant: editingButton.variant || 'primary'
    };
    
    if (editingButton.id && heroButtons.find(b => b.id === editingButton.id)) {
      setHeroButtons(heroButtons.map(b => b.id === editingButton.id ? newButton : b));
      toast.success('Button updated successfully!');
    } else {
      setHeroButtons([...heroButtons, newButton]);
      toast.success('Button added successfully!');
    }
    
    setEditingButton(null);
    setIsAddingButton(false);
  };

  const handleEditButton = (button: HeroButton) => {
    setEditingButton({ ...button });
    setIsAddingButton(true);
  };

  const handleDeleteButton = (id: string) => {
    if (confirm('Are you sure you want to delete this button?')) {
      setHeroButtons(heroButtons.filter(b => b.id !== id));
      toast.success('Button deleted successfully!');
    }
  };

  // ==================== ABOUT SECTION HANDLERS ====================
  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await saveAboutSection(aboutData);
      setIsEditingAbout(false);
      toast.success('About section updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save about section');
    }
  };

  // ==================== ABOUT IMAGE UPLOAD - AUTO-SAVES ====================
  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImages(true);
    
    try {
      console.log('Uploading about image...');
      
      // Upload image to Cloudinary
      const uploadedImages = await uploadImages([file], 'about');
      console.log('About upload successful:', uploadedImages);
      
      if (uploadedImages.length > 0) {
        const newImageUrl = uploadedImages[0].url;
        
        // Update local state
        const updatedAboutData = { ...aboutData, image: newImageUrl };
        setAboutData(updatedAboutData);
        
        // IMPORTANT: Auto-save to database immediately
        console.log('Saving about section to database...');
        await saveAboutSection(updatedAboutData);
        
        toast.success('About image uploaded and saved successfully!');
      }
    } catch (error: any) {
      console.error('About upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  // ==================== SERVICE HANDLERS ====================
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentService?.title || !currentService?.description || !currentService?.icon) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const newService = {
      ...currentService,
      id: Date.now().toString()
    };
    
    const updatedServices = [...services, newService];
    
    try {
      await saveServices(updatedServices);
      setServices(updatedServices);
      setCurrentService(null);
      setIsAddingService(false);
      toast.success('Service added successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add service');
    }
  };

  const handleEditService = (service: Service) => {
    setCurrentService({ ...service });
    setIsEditingService(true);
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentService) return;
    
    const updatedServices = services.map(s => 
      s.id === currentService.id ? currentService : s
    );
    
    try {
      await saveServices(updatedServices);
      setServices(updatedServices);
      setCurrentService(null);
      setIsEditingService(false);
      toast.success('Service updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update service');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    const updatedServices = services.filter(s => s.id !== id);
    
    try {
      await saveServices(updatedServices);
      setServices(updatedServices);
      toast.success('Service deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete service');
    }
  };

  // ==================== CONTACT INFO HANDLERS ====================
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await saveContactCTA(contactData);
      setIsEditingContact(false);
      toast.success('Contact information updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save contact information');
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    try {
      await loadHomepageData();
      toast.success('Data refreshed successfully!');
    } catch (error: any) {
      toast.error('Failed to refresh data');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Home Page Management"
        description="Manage all sections of your homepage"
      >
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Refresh Data
        </Button>
      </PageHeader>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="about">About Us</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="contact">Contact CTA</TabsTrigger>
        </TabsList>

        {/* ==================== HERO SECTION TAB ==================== */}
        <TabsContent value="hero" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Hero Section</h2>
            <Button
              onClick={() => setIsEditingHero(true)}
              className="bg-[#F46A1F] hover:bg-[#d85a15]"
              disabled={isLoading}
            >
              <Pencil size={16} className="mr-2" />
              Edit Hero
            </Button>
          </div>
          <ContentCard title="Hero Section">
            <div className="space-y-4">
              {/* Preview */}
              <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg border">
                <div className="inline-block px-4 py-2 bg-[#F46A1F]/10 rounded-full mb-4">
                  <span className="text-[#F46A1F] font-semibold text-sm">Since 2050 B.S.</span>
                </div>
                <h3 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight mb-6">
                  {heroTitle}
                  <span className="block text-[#F46A1F]">{heroTitleHighlight}</span>
                </h3>
                <p className="text-xl text-gray-600 mb-6">{heroSubtitle}</p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  {heroButtons.map((button) => (
                    <Button 
                      key={button.id}
                      className={button.variant === 'outline' 
                        ? 'border-2 border-black text-black px-8 py-3 hover:bg-black hover:text-white' 
                        : 'bg-[#F46A1F] hover:bg-[#d85a15] text-white px-8 py-3'
                      }
                    >
                      {button.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Images Gallery */}
              <div>
                <h4 className="font-medium mb-3">Hero Carousel Images ({heroImages.length})</h4>
                {heroImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {heroImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Hero ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                          onError={(e) => {
                            console.error('Image failed to load:', image);
                            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Error+Loading+Image';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm">Image {index + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No images added yet</p>
                )}
              </div>
            </div>
          </ContentCard>

          {/* Edit Hero Modal */}
          <FormModal
            open={isEditingHero}
            onOpenChange={setIsEditingHero}
            title="Edit Hero Section"
            description="Update hero content and manage carousel images"
            onSubmit={handleSaveHero}
            isLoading={isLoading}
          >
            <div className="space-y-6">
              {/* Text Content */}
              <div className="space-y-4 border-b pb-6">
                <h4 className="font-semibold text-sm">Hero Text Content</h4>
                
                <div>
                  <Label htmlFor="hero-title">Main Title (Big Text)</Label>
                  <Input
                    id="hero-title"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    placeholder="32+ Years of"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground mt-1">This is the big text part of the heading</p>
                </div>

                <div>
                  <Label htmlFor="hero-title-highlight">Title Highlight (Colored Text)</Label>
                  <Input
                    id="hero-title-highlight"
                    value={heroTitleHighlight}
                    onChange={(e) => setHeroTitleHighlight(e.target.value)}
                    placeholder="Engineering Excellence"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground mt-1">This text appears in the accent color (#F46A1F)</p>
                </div>

                <div>
                  <Label htmlFor="hero-subtitle">Subtitle (Small Text)</Label>
                  <Input
                    id="hero-subtitle"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    placeholder="Specialized Construction Solutions & Engineering Services"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground mt-1">This is the small descriptive text</p>
                </div>
              </div>

              {/* CTA Buttons Section */}
              <div className="space-y-4 border-b pb-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Call-to-Action Buttons</h4>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setEditingButton({ id: '', label: '', route: '', variant: 'primary' });
                      setIsAddingButton(true);
                    }}
                    className="bg-[#F46A1F] hover:bg-[#d85a15]"
                    disabled={isLoading}
                  >
                    <Plus size={14} className="mr-1" />
                    Add Button
                  </Button>
                </div>

                {heroButtons.length > 0 ? (
                  <div className="space-y-3">
                    {heroButtons.map((button) => (
                      <div key={button.id} className="p-3 bg-muted rounded-lg flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{button.label}</div>
                          <div className="text-xs text-muted-foreground">{button.route} • {button.variant || 'primary'}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditButton(button)}
                            disabled={isLoading}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteButton(button.id)}
                            disabled={isLoading}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No buttons added yet</p>
                )}
              </div>

              {/* Image Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Manage Carousel Images</h4>
                  {uploadingImages && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </div>
                  )}
                </div>
                
                {/* Upload New Images */}
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    className="hidden"
                    id="hero-image-upload"
                    disabled={isLoading || uploadingImages}
                  />
                  <label 
                    htmlFor="hero-image-upload" 
                    className={`cursor-pointer flex flex-col items-center gap-2 ${(isLoading || uploadingImages) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Upload size={24} className="text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {uploadingImages ? 'Uploading...' : 'Click to upload or drag images'}
                    </span>
                    <span className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</span>
                  </label>
                </div>

                {/* Image List */}
                {heroImages.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium">Current Images ({heroImages.length})</h5>
                    {heroImages.map((image, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <img 
                          src={image} 
                          alt={`Preview ${index + 1}`}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/64x64?text=Error';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <Input
                            value={image}
                            onChange={(e) => handleImageUrlChange(index, e.target.value)}
                            placeholder="Image URL"
                            className="text-xs"
                            disabled={isLoading}
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRemoveHeroImage(index)}
                          disabled={isLoading}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </FormModal>

          {/* Add/Edit Button Modal */}
          <FormModal
            open={isAddingButton}
            onOpenChange={setIsAddingButton}
            title={editingButton?.id ? "Edit Button" : "Add New Button"}
            description={editingButton?.id ? "Update button details" : "Create a new CTA button"}
            onSubmit={handleAddButton}
            isLoading={isLoading}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="button-label">Button Label</Label>
                <Input
                  id="button-label"
                  value={editingButton?.label || ''}
                  onChange={(e) => setEditingButton(prev => prev ? { ...prev, label: e.target.value } : { id: '', label: e.target.value, route: '', variant: 'primary' })}
                  placeholder="View Services"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="button-route">Route/URL</Label>
                <Input
                  id="button-route"
                  value={editingButton?.route || ''}
                  onChange={(e) => setEditingButton(prev => prev ? { ...prev, route: e.target.value } : { id: '', label: '', route: e.target.value, variant: 'primary' })}
                  placeholder="/services"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">e.g., /services, /request-quote, /about</p>
              </div>

              <div>
                <Label htmlFor="button-variant">Button Style</Label>
                <select
                  id="button-variant"
                  value={editingButton?.variant || 'primary'}
                  onChange={(e) => setEditingButton(prev => prev ? { ...prev, variant: e.target.value as 'primary' | 'outline' } : { id: '', label: '', route: '', variant: e.target.value as 'primary' | 'outline' })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  disabled={isLoading}
                >
                  <option value="primary">Primary (Orange Background)</option>
                  <option value="outline">Outline (Black Border)</option>
                </select>
              </div>
            </div>
          </FormModal>
        </TabsContent>

        {/* ==================== ABOUT SECTION TAB ==================== */}
        <TabsContent value="about" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">About Us Section</h2>
            <Button
              onClick={() => setIsEditingAbout(true)}
              className="bg-[#F46A1F] hover:bg-[#d85a15]"
              disabled={isLoading}
            >
              <Pencil size={16} className="mr-2" />
              Edit About
            </Button>
          </div>
          <ContentCard title="About Us Section">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6 p-6 bg-muted/30 rounded-lg">
                <div>
                  <div className="text-[#F46A1F] font-semibold mb-2">{aboutData.subtitle}</div>
                  <h3 className="text-3xl font-bold text-black mb-4">{aboutData.title}</h3>
                  <p className="text-gray-700 mb-3 leading-relaxed">{aboutData.description1}</p>
                  <p className="text-gray-700 mb-4 leading-relaxed">{aboutData.description2}</p>
                  <div className="text-sm">
                    <span className="text-gray-600">Managing Director: </span>
                    <span className="font-semibold text-black">{aboutData.managingDirector}</span>
                  </div>
                </div>
                <div>
                  {aboutData.image && (
                    <img 
                      src={aboutData.image} 
                      alt="About"
                      className="w-full h-64 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Error+Loading+Image';
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </ContentCard>

          {/* Edit About Modal */}
          <FormModal
            open={isEditingAbout}
            onOpenChange={setIsEditingAbout}
            title="Edit About Us Section"
            description="Update about section content and image"
            onSubmit={handleSaveAbout}
            isLoading={isLoading}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="about-subtitle">Subtitle</Label>
                <Input
                  id="about-subtitle"
                  value={aboutData.subtitle}
                  onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })}
                  placeholder="ABOUT US"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="about-title">Main Title</Label>
                <Input
                  id="about-title"
                  value={aboutData.title}
                  onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                  placeholder="Building Trust Since 2050 B.S."
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="about-desc1">First Description</Label>
                <Textarea
                  id="about-desc1"
                  value={aboutData.description1}
                  onChange={(e) => setAboutData({ ...aboutData, description1: e.target.value })}
                  rows={3}
                  placeholder="First description paragraph..."
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="about-desc2">Second Description</Label>
                <Textarea
                  id="about-desc2"
                  value={aboutData.description2}
                  onChange={(e) => setAboutData({ ...aboutData, description2: e.target.value })}
                  rows={3}
                  placeholder="Second description paragraph..."
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="about-director">Managing Director Name</Label>
                <Input
                  id="about-director"
                  value={aboutData.managingDirector}
                  onChange={(e) => setAboutData({ ...aboutData, managingDirector: e.target.value })}
                  placeholder="Ram Kumar Shrestha"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="about-image">Image URL</Label>
                <Input
                  id="about-image"
                  value={aboutData.image}
                  onChange={(e) => setAboutData({ ...aboutData, image: e.target.value })}
                  placeholder="https://..."
                  disabled={isLoading}
                />
                <div className="mt-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAboutImageUpload}
                    className={`block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer ${isLoading || uploadingImages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isLoading || uploadingImages}
                  />
                  {uploadingImages && (
                    <div className="mt-2 text-sm text-muted-foreground flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading image...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FormModal>
        </TabsContent>

        {/* ==================== SERVICES TAB ==================== */}
        <TabsContent value="services" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Services</h2>
            <Button
              onClick={() => {
                setCurrentService({ id: '', title: '', description: '', icon: 'Hammer' });
                setIsAddingService(true);
              }}
              className="bg-[#F46A1F] hover:bg-[#d85a15]"
              disabled={isLoading}
            >
              <Plus size={16} className="mr-2" />
              Add Service
            </Button>
          </div>

          <ContentCard title="Service Cards">
            {services.length > 0 ? (
              <div className="space-y-3">
                {services.map((service) => {
                  const IconComponent = Icons[service.icon as keyof typeof Icons] as React.ComponentType<{ className?: string; size?: number }>;
                  return (
                    <div key={service.id} className="p-4 bg-muted rounded-lg flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {IconComponent && (
                          <div className="mt-1">
                            <IconComponent size={24} className="text-[#F46A1F]" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{service.title}</h4>
                          <p className="text-xs text-muted-foreground">{service.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditService(service)}
                          disabled={isLoading}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteService(service.id)}
                          disabled={isLoading}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No services added yet</p>
            )}
          </ContentCard>

          {/* Add Service Modal */}
          <FormModal
            open={isAddingService}
            onOpenChange={setIsAddingService}
            title="Add New Service"
            description="Create a new service card"
            onSubmit={handleAddService}
            isLoading={isLoading}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="service-title">Service Title</Label>
                <Input
                  id="service-title"
                  value={currentService?.title || ''}
                  onChange={(e) => setCurrentService(prev => ({ ...prev, title: e.target.value, id: prev?.id || '', description: prev?.description || '', icon: prev?.icon || 'Hammer' }))}
                  placeholder="Deep Foundation"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="service-desc">Description</Label>
                <Textarea
                  id="service-desc"
                  value={currentService?.description || ''}
                  onChange={(e) => setCurrentService(prev => ({ ...prev, description: e.target.value, id: prev?.id || '', title: prev?.title || '', icon: prev?.icon || 'Hammer' }))}
                  placeholder="Specialized in pile foundation and deep excavation works"
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="service-icon">Icon</Label>
                <select
                  id="service-icon"
                  value={currentService?.icon || 'Hammer'}
                  onChange={(e) => setCurrentService(prev => ({ ...prev, icon: e.target.value, id: prev?.id || '', title: prev?.title || '', description: prev?.description || '' }))}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  disabled={isLoading}
                >
                  {availableIcons.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
                <div className="mt-2 p-3 bg-muted rounded-lg flex items-center gap-2">
                  {currentService && (() => {
                    const PreviewIcon = Icons[currentService.icon as keyof typeof Icons] as React.ComponentType<{ size?: number }> | undefined;
                    return PreviewIcon ? <div className="text-orange-500"><PreviewIcon size={24} /></div> : null;
                  })()}
                  <span className="text-sm">Icon Preview</span>
                </div>
              </div>
            </div>
          </FormModal>

          {/* Edit Service Modal */}
          <FormModal
            open={isEditingService}
            onOpenChange={setIsEditingService}
            title="Edit Service"
            description="Update service details"
            onSubmit={handleUpdateService}
            isLoading={isLoading}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-service-title">Service Title</Label>
                <Input
                  id="edit-service-title"
                  value={currentService?.title || ''}
                  onChange={(e) => setCurrentService(prev => prev ? { ...prev, title: e.target.value } : null)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="edit-service-desc">Description</Label>
                <Textarea
                  id="edit-service-desc"
                  value={currentService?.description || ''}
                  onChange={(e) => setCurrentService(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="edit-service-icon">Icon</Label>
                <select
                  id="edit-service-icon"
                  value={currentService?.icon || 'Hammer'}
                  onChange={(e) => setCurrentService(prev => prev ? { ...prev, icon: e.target.value } : null)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  disabled={isLoading}
                >
                  {availableIcons.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
            </div>
          </FormModal>
        </TabsContent>

        {/* ==================== CONTACT CTA TAB ==================== */}
        <TabsContent value="contact" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Contact CTA Section</h2>
            <Button
              onClick={() => setIsEditingContact(true)}
              className="bg-[#F46A1F] hover:bg-[#d85a15]"
              disabled={isLoading}
            >
              <Pencil size={16} className="mr-2" />
              Edit Contact
            </Button>
          </div>
          <ContentCard title="Contact CTA Section">
            <div className="p-6 bg-black text-white rounded-lg">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">{contactData.heading}</h3>
              <p className="text-lg text-gray-300 mb-8">
                {contactData.subheading}
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#F46A1F] rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Call Us</div>
                    <div className="font-semibold">{contactData.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#F46A1F] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Email Us</div>
                    <div className="font-semibold truncate">{contactData.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </ContentCard>

          {/* Contact Edit Modal */}
          <FormModal
            open={isEditingContact}
            onOpenChange={setIsEditingContact}
            title="Edit Contact CTA Section"
            description="Update contact information and CTA heading"
            onSubmit={handleSaveContact}
            isLoading={isLoading}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="contact-heading">CTA Heading</Label>
                <Input
                  id="contact-heading"
                  value={contactData.heading}
                  onChange={(e) => setContactData({ ...contactData, heading: e.target.value })}
                  placeholder="Ready to Start Your Project?"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="contact-subheading">CTA Subheading</Label>
                <Textarea
                  id="contact-subheading"
                  value={contactData.subheading}
                  onChange={(e) => setContactData({ ...contactData, subheading: e.target.value })}
                  placeholder="Get a free site inspection and consultation from our expert engineers"
                  rows={2}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="contact-phone">Phone Number</Label>
                <Input
                  id="contact-phone"
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  placeholder="+977-01-4782881"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="contact-email">Email Address</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  placeholder="info@rassengineering.com"
                  disabled={isLoading}
                />
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> These changes will update the contact information displayed in the 
                  "Contact CTA" section on the homepage.
                </p>
              </div>
            </div>
          </FormModal>
        </TabsContent>
      </Tabs>
    </div>
  );
}