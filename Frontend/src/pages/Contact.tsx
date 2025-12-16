import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { companyInfo } from '../data/mockData';

interface FormData {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    serviceType: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success('Thank you! We will contact you soon.');
    setFormData({
      name: '',
      phone: '',
      email: '',
      serviceType: '',
      message: ''
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
        <title>Contact Us | RASS Engineering & Construction</title>
        <meta
          name="description"
          content="Get in touch with RASS Engineering & Construction. Call us at 977-01-5907561 or email rass.engineering2016@gmail.com for construction and engineering services."
        />
        <link rel="canonical" href="/contact" />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <div className="inline-block px-4 py-2 bg-[#F46A1F]/10 rounded-full mb-6">
                <span className="text-[#F46A1F] font-semibold text-sm">GET IN TOUCH</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
                Contact <span className="text-[#F46A1F]">Us</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Have a project in mind? Let's discuss how we can help you achieve your construction goals
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="lg:col-span-2 space-y-8"
              >
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                    Let's Build Together
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Whether you need specialized construction service, our team of experts is ready to assist you.
                  </p>
                </div>

                {/* Contact Cards */}
                <div className="space-y-4">
                  <div className="bg-[#F4F4F4] p-6 rounded-2xl hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#F46A1F]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="text-[#F46A1F]" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-black mb-1">Phone</h3>
                        <a href={`tel:${companyInfo.phone}`} className="text-gray-600 hover:text-[#F46A1F] transition-colors">
                          Tel: {companyInfo.phone}
                        </a>
                        <div className="text-gray-600 mt-1">
                          {companyInfo.mobile.map((mobile, idx) => (
                            <a
                              key={idx}
                              href={`tel:${mobile}`}
                              className="block hover:text-[#F46A1F] transition-colors"
                            >
                              Mob: {mobile}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F4F4F4] p-6 rounded-2xl hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#F46A1F]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="text-[#F46A1F]" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-black mb-1">Email</h3>
                        <a
                          href={`mailto:${companyInfo.email}`}
                          className="text-gray-600 hover:text-[#F46A1F] transition-colors break-all"
                        >
                          {companyInfo.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F4F4F4] p-6 rounded-2xl hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#F46A1F]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="text-[#F46A1F]" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-black mb-1">Address</h3>
                        <p className="text-gray-600">{companyInfo.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="bg-black text-white p-6 rounded-2xl">
                  <h3 className="font-bold mb-4">Business Hours</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sunday - Friday</span>
                      <span>10:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="lg:col-span-3"
              >
                <form onSubmit={handleSubmit} className="bg-[#F4F4F4] p-8 md:p-10 rounded-2xl">
                  <h3 className="text-2xl font-bold text-black mb-6">Send Us a Message</h3>

                  <div className="space-y-6">
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

                    <div className="grid md:grid-cols-2 gap-6">
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

                    <div>
                      <Label htmlFor="serviceType" className="text-black mb-2 block">Service Type</Label>
                      <select
                        id="serviceType"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#F46A1F]"
                      >
                        <option value="">Select a service</option>
                        <option value="specialized">Specialized Construction</option>
                        <option value="engineering">Engineering Services</option>
                        <option value="consultation">Consultation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-black mb-2 block">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="bg-white border-gray-300 resize-none"
                        placeholder="Tell us about your project"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#F46A1F] hover:bg-[#d85a15] text-white py-6 text-lg font-semibold"
                    >
                      Send Message
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-[#F4F4F4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14130.863280046818!2d85.3239605!3d27.7172453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18fcb77fd4bd%3A0x58099a1deffed8d4!2sKathmandu%2C%20Nepal!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RASS Engineering Location"
                />
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;