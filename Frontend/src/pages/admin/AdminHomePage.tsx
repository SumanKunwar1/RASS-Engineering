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
import { Pencil, Plus, Trash2, Image as ImageIcon, Phone, Mail, Save, X, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as Icons from 'lucide-react';

interface AboutSection {
  id: string;
  title: string;
  subtitle: string;
  description1: string;
  description2: string;
  image: string;
  managingDirector: string;
  excerpt?: string;
  content?: string;
  author?: string;
  [key: string]: any;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  [key: string]: any;
}

interface ContactInfo {
  phone: string;
  email: string;
  heading?: string;
  subheading?: string;
  address?: string;
  mapUrl?: string;
  workingHours?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  [key: string]: any;
}

export default function AdminHome() {
  const { state, dispatch } = useAdmin();
  
  // Hero Section State
  const [isEditingHero, setIsEditingHero] = useState(false);
  const [heroData, setHeroData] = useState<HeroSection>(state.hero);
  const [heroImages, setHeroImages] = useState<string[]>(state.hero.images);

  // About Section State
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutData, setAboutData] = useState<AboutSection>({
    id: 'about-section',
    title: 'Building Trust Since 2050 B.S.',
    subtitle: 'ABOUT US',
    description1: 'Under the visionary leadership of Managing Director, RASS Engineering has been at the forefront of specialized construction solutions for over three decades.',
    description2: 'We combine advanced technologies with time-tested engineering principles to deliver exceptional results that stand the test of time.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    managingDirector: 'Ram Kumar Shrestha'
  });

  // Services State
  const [isEditingService, setIsEditingService] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [services, setServices] = useState<Service[]>([
    { id: '1', title: 'Deep Foundation', description: 'Specialized in pile foundation and deep excavation works', icon: 'Hammer' },
    { id: '2', title: 'Structural Works', description: 'Complete structural engineering solutions', icon: 'Building2' },
    { id: '3', title: 'Earth Retention', description: 'Advanced shoring and retaining systems', icon: 'Mountain' }
  ]);
  const [currentService, setCurrentService] = useState<Service | null>(null);

  // Contact Info State
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactData, setContactData] = useState<ContactInfo>({
    heading: 'Ready to Start Your Project?',
    subheading: 'Get a free site inspection and consultation from our expert engineers',
    phone: '+977-01-4782881',
    email: 'info@rassengineering.com'
  });

  // Available icons for services
  const availableIcons = [
    'Hammer', 'Building2', 'Mountain', 'Wrench', 'HardHat', 'Ruler',
    'Construction', 'Drill', 'Bolt', 'Cog', 'Settings', 'Tool'
  ];

  // ==================== HERO SECTION HANDLERS ====================
  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedHero = {
      ...heroData,
      images: heroImages
    };
    dispatch({ type: 'SET_HERO', payload: updatedHero });
    setIsEditingHero(false);
    toast.success('Hero section updated successfully!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          setHeroImages([...heroImages, base64]);
          toast.success('Image added!');
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setHeroImages(heroImages.filter((_, i) => i !== index));
    toast.success('Image removed!');
  };

  const handleImageUrlChange = (index: number, url: string) => {
    const newImages = [...heroImages];
    newImages[index] = url;
    setHeroImages(newImages);
  };

  // ==================== ABOUT SECTION HANDLERS ====================
  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_ABOUT', payload: aboutData });
    setIsEditingAbout(false);
    toast.success('About section updated successfully!');
  };

  const handleAboutImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setAboutData({ ...aboutData, image: base64 });
        toast.success('Image uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  // ==================== SERVICE HANDLERS ====================
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentService?.title && currentService?.description) {
      setServices([...services, { ...currentService, id: Date.now().toString() }]);
      setCurrentService(null);
      setIsAddingService(false);
      toast.success('Service added successfully!');
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleEditService = (service: Service) => {
    setCurrentService(service);
    setIsEditingService(true);
  };

  const handleUpdateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentService) {
      setServices(services.map(s => s.id === currentService.id ? currentService : s));
      setCurrentService(null);
      setIsEditingService(false);
      toast.success('Service updated successfully!');
    }
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
      toast.success('Service deleted successfully!');
    }
  };

  // ==================== CONTACT INFO HANDLERS ====================
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_CONTACT', payload: contactData });
    setIsEditingContact(false);
    toast.success('Contact information updated successfully!');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Home Page Management"
        description="Manage all sections of your homepage"
      />

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
              onClick={() => {
                setHeroData(state.hero);
                setHeroImages(state.hero.images);
                setIsEditingHero(true);
              }}
              className="bg-[#F46A1F] hover:bg-[#d85a15]"
            >
              <Pencil size={16} className="mr-2" />
              Edit Hero
            </Button>
          </div>
          <ContentCard 
            title="Hero Section"
          >
            <div className="space-y-4">
              {/* Preview */}
              <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg border">
                <div className="inline-block px-4 py-2 bg-[#F46A1F]/10 rounded-full mb-4">
                  <span className="text-[#F46A1F] font-semibold text-sm">Since 2050 B.S.</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-black mb-3">{state.hero.title}</h3>
                <p className="text-xl text-gray-600 mb-6">{state.hero.subtitle}</p>
                <Button className="bg-[#F46A1F] hover:bg-[#d85a15] text-white">
                  {state.hero.ctaText}
                </Button>
              </div>

              {/* Images Gallery */}
              <div>
                <h4 className="font-medium mb-3">Hero Carousel Images ({state.hero.images.length})</h4>
                {state.hero.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {state.hero.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Hero ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
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
          >
            <div className="space-y-6">
              {/* Text Content */}
              <div className="space-y-4 border-b pb-6">
                <h4 className="font-semibold text-sm">Hero Text Content</h4>
                
                <div>
                  <Label htmlFor="hero-title">Main Title</Label>
                  <Input
                    id="hero-title"
                    value={heroData.title}
                    onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                    placeholder="32+ Years of Engineering Excellence"
                  />
                </div>

                <div>
                  <Label htmlFor="hero-subtitle">Subtitle</Label>
                  <Input
                    id="hero-subtitle"
                    value={heroData.subtitle}
                    onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                    placeholder="Specialized Construction Solutions & Engineering Services"
                  />
                </div>

                <div>
                  <Label htmlFor="hero-cta">CTA Button Text</Label>
                  <Input
                    id="hero-cta"
                    value={heroData.ctaText}
                    onChange={(e) => setHeroData({ ...heroData, ctaText: e.target.value })}
                    placeholder="View Services"
                  />
                </div>
              </div>

              {/* Image Management */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Manage Carousel Images</h4>
                
                {/* Upload New Images */}
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="hero-image-upload"
                  />
                  <label htmlFor="hero-image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload size={24} className="text-muted-foreground" />
                    <span className="text-sm font-medium">Click to upload or drag images</span>
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
                        />
                        <div className="flex-1 min-w-0">
                          <Input
                            value={image}
                            onChange={(e) => handleImageUrlChange(index, e.target.value)}
                            placeholder="Image URL or base64"
                            className="text-xs"
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRemoveImage(index)}
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
        </TabsContent>

        {/* ==================== ABOUT SECTION TAB ==================== */}
        <TabsContent value="about" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">About Us Section</h2>
            <Button
              onClick={() => setIsEditingAbout(true)}
              className="bg-[#F46A1F] hover:bg-[#d85a15]"
            >
              <Pencil size={16} className="mr-2" />
              Edit About
            </Button>
          </div>
          <ContentCard 
            title="About Us Section"
          >
            <div className="space-y-4">
              {/* Preview */}
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
                  <img 
                    src={aboutData.image} 
                    alt="About"
                    className="w-full h-64 object-cover rounded-lg"
                  />
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
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="about-subtitle">Subtitle</Label>
                <Input
                  id="about-subtitle"
                  value={aboutData.subtitle}
                  onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })}
                  placeholder="ABOUT US"
                />
              </div>

              <div>
                <Label htmlFor="about-title">Main Title</Label>
                <Input
                  id="about-title"
                  value={aboutData.title}
                  onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                  placeholder="Building Trust Since 2050 B.S."
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
                />
              </div>

              <div>
                <Label htmlFor="about-md">Managing Director Name</Label>
                <Input
                  id="about-md"
                  value={aboutData.managingDirector}
                  onChange={(e) => setAboutData({ ...aboutData, managingDirector: e.target.value })}
                  placeholder="Ram Kumar Shrestha"
                />
              </div>

              <div className="space-y-2">
                <Label>Section Image</Label>
                <div className="flex items-center gap-3">
                  {aboutData.image && (
                    <img 
                      src={aboutData.image} 
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAboutImageUpload}
                      className="hidden"
                      id="about-image-upload"
                    />
                    <label htmlFor="about-image-upload">
                      <Button
                        type="button"
                        variant="outline"
                        className="cursor-pointer w-full"
                        onClick={() => document.getElementById('about-image-upload')?.click()}
                      >
                        <Upload size={16} className="mr-2" />
                        Upload Image
                      </Button>
                    </label>
                  </div>
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
            >
              <Plus size={16} className="mr-2" />
              Add Service
            </Button>
          </div>
          <ContentCard 
            title="Services"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => {
                const IconComponent = Icons[service.icon as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }> | undefined;
                return (
                  <Card key={service.id} className="relative">
                    <CardContent className="p-6">
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 text-primary hover:text-primary"
                          onClick={() => handleEditService(service)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                        {IconComponent && <IconComponent size={24} className="text-orange-500" />}
                      </div>
                      <h4 className="font-bold mb-2">{service.title}</h4>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ContentCard>

          {/* Add Service Modal */}
          <FormModal
            open={isAddingService}
            onOpenChange={setIsAddingService}
            title="Add New Service"
            description="Create a new service card"
            onSubmit={handleAddService}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="service-title">Service Title</Label>
                <Input
                  id="service-title"
                  value={currentService?.title || ''}
                  onChange={(e) => setCurrentService(prev => prev ? { ...prev, title: e.target.value } : null)}
                  placeholder="Deep Foundation"
                />
              </div>

              <div>
                <Label htmlFor="service-desc">Description</Label>
                <Textarea
                  id="service-desc"
                  value={currentService?.description || ''}
                  onChange={(e) => setCurrentService(prev => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="Specialized in pile foundation and deep excavation works"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="service-icon">Icon</Label>
                <select
                  id="service-icon"
                  value={currentService?.icon || 'Hammer'}
                  onChange={(e) => setCurrentService(prev => prev ? { ...prev, icon: e.target.value } : null)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
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
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-service-title">Service Title</Label>
                <Input
                  id="edit-service-title"
                  value={currentService?.title || ''}
                  onChange={(e) => setCurrentService(prev => prev ? { ...prev, title: e.target.value } : null)}
                />
              </div>

              <div>
                <Label htmlFor="edit-service-desc">Description</Label>
                <Textarea
                  id="edit-service-desc"
                  value={currentService?.description || ''}
                  onChange={(e) => setCurrentService(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="edit-service-icon">Icon</Label>
                <select
                  id="edit-service-icon"
                  value={currentService?.icon || 'Hammer'}
                  onChange={(e) => setCurrentService(prev => prev ? { ...prev, icon: e.target.value } : null)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
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
            >
              <Pencil size={16} className="mr-2" />
              Edit Contact
            </Button>
          </div>
          <ContentCard 
            title="Contact CTA Section"
          >
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
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="contact-heading">CTA Heading</Label>
                <Input
                  id="contact-heading"
                  value={contactData.heading || ''}
                  onChange={(e) => setContactData({ ...contactData, heading: e.target.value })}
                  placeholder="Ready to Start Your Project?"
                />
              </div>

              <div>
                <Label htmlFor="contact-subheading">CTA Subheading</Label>
                <Textarea
                  id="contact-subheading"
                  value={contactData.subheading || ''}
                  onChange={(e) => setContactData({ ...contactData, subheading: e.target.value })}
                  placeholder="Get a free site inspection and consultation from our expert engineers"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="contact-phone">Phone Number</Label>
                <Input
                  id="contact-phone"
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  placeholder="+977-01-4782881"
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