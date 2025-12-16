import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

interface QuoteFormData {
  name: string;
  company: string;
  phone: string;
  email: string;
  serviceType: string;
  projectType: string;
  projectSize: string;
  timeline: string;
  budget: string;
  description: string;
  address: string;
}

const RequestQuote: React.FC = () => {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    company: '',
    phone: '',
    email: '',
    serviceType: '',
    projectType: '',
    projectSize: '',
    timeline: '',
    budget: '',
    description: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success('Quote request submitted! We will contact you within 24 hours.');
    setFormData({
      name: '',
      company: '',
      phone: '',
      email: '',
      serviceType: '',
      projectType: '',
      projectSize: '',
      timeline: '',
      budget: '',
      description: '',
      address: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Helmet>
        <title>Request a Quote | RASS Engineering & Construction</title>
        <meta
          name="description"
          content="Request a free quote for your construction project. Get professional estimates for specialized engineering services."
        />
        <link rel="canonical" href="/request-quote" />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <div className="inline-block px-4 py-2 bg-[#F46A1F]/10 rounded-full mb-6">
                <span className="text-[#F46A1F] font-semibold text-sm">GET A QUOTE</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
                Request a <span className="text-[#F46A1F]">Free Quote</span>
              </h1>
              <p className="text-xl text-gray-600">
                Tell us about your project and receive a detailed estimate from our experts
              </p>
            </motion.div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <form onSubmit={handleSubmit} className="bg-[#F4F4F4] p-8 md:p-12 rounded-2xl">
                <div className="space-y-8">
                  {/* Personal Information */}
                  <div>
                    <h2 className="text-2xl font-bold text-black mb-6">Personal Information</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-black mb-2 block">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="bg-white border-gray-300"
                          placeholder="Enter your name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="company" className="text-black mb-2 block">Company/Organization</Label>
                        <Input
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleChange}
                          className="bg-white border-gray-300"
                          placeholder="Optional"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-black mb-2 block">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="bg-white border-gray-300"
                          placeholder="Your phone number"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-black mb-2 block">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="bg-white border-gray-300"
                          placeholder="Your email"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <h2 className="text-2xl font-bold text-black mb-6">Project Details</h2>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="serviceType" className="text-black mb-2 block">Service Required *</Label>
                        <select
                          id="serviceType"
                          name="serviceType"
                          value={formData.serviceType}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#F46A1F]"
                        >
                          <option value="">Select a service</option>
                          <option value="construction">Construction Services</option>
                          <option value="engineering">Engineering Services</option>
                          <option value="consultation">Consultation</option>
                          <option value="multiple">Multiple Services</option>
                        </select>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="projectType" className="text-black mb-2 block">Project Type</Label>
                          <select
                            id="projectType"
                            name="projectType"
                            value={formData.projectType}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#F46A1F]"
                          >
                            <option value="">Select type</option>
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                            <option value="industrial">Industrial</option>
                            <option value="institutional">Institutional</option>
                            <option value="infrastructure">Infrastructure</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="projectSize" className="text-black mb-2 block">Project Size (sq.ft)</Label>
                          <Input
                            id="projectSize"
                            name="projectSize"
                            type="text"
                            value={formData.projectSize}
                            onChange={handleChange}
                            className="bg-white border-gray-300"
                            placeholder="Approximate area"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="timeline" className="text-black mb-2 block">Expected Timeline</Label>
                          <select
                            id="timeline"
                            name="timeline"
                            value={formData.timeline}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#F46A1F]"
                          >
                            <option value="">Select timeline</option>
                            <option value="immediate">Immediate (Within 1 week)</option>
                            <option value="1-month">Within 1 month</option>
                            <option value="2-3-months">2-3 months</option>
                            <option value="3-6-months">3-6 months</option>
                            <option value="6-months-plus">6+ months</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="budget" className="text-black mb-2 block">Budget Range (NPR)</Label>
                          <select
                            id="budget"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#F46A1F]"
                          >
                            <option value="">Select budget</option>
                            <option value="under-500k">Under NPR 5 Lakhs</option>
                            <option value="500k-1m">NPR 5-10 Lakhs</option>
                            <option value="1m-2m">NPR 10-20 Lakhs</option>
                            <option value="2m-5m">NPR 20-50 Lakhs</option>
                            <option value="5m-plus">NPR 50 Lakhs+</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address" className="text-black mb-2 block">Project Location *</Label>
                        <Input
                          id="address"
                          name="address"
                          type="text"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          className="bg-white border-gray-300"
                          placeholder="City, District"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description" className="text-black mb-2 block">Project Description *</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                          rows={6}
                          className="bg-white border-gray-300 resize-none"
                          placeholder="Please provide details about your project requirements, challenges, and any specific needs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-[#F46A1F] hover:bg-[#d85a15] text-white py-6 text-lg font-semibold transition-all hover:scale-[1.02]"
                    >
                      Submit Quote Request
                    </Button>
                    <p className="text-center text-sm text-gray-600 mt-4">
                      We will review your request and get back to you within 24 hours
                    </p>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-[#F46A1F] mb-2">Free</div>
                <div className="text-lg">Site Inspection</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#F46A1F] mb-2">24 Hours</div>
                <div className="text-lg">Response Time</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#F46A1F] mb-2">Detailed</div>
                <div className="text-lg">Cost Breakdown</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default RequestQuote;