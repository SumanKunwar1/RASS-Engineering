import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Eye, Award, Users, Heart, Star, Shield, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useAdmin } from '../contexts/AdminContext';
import * as LucideIcons from 'lucide-react';

// Helper to get icon component by name
const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: any } = {
    Award,
    Users,
    Target,
    Eye,
    Heart,
    Star,
    Shield,
    Zap,
  };
  return icons[iconName] || Award;
};

const About: React.FC = () => {
  const { state } = useAdmin();
  const aboutData = state.aboutContent || state.about;

  // Default values if admin data is not set
  const heroTitle = aboutData?.heroTitle || 'About RASS Engineering';
  const heroSubtitle = aboutData?.heroSubtitle || "Building Nepal's infrastructure with precision, dedication, and engineering excellence since 2050 B.S.";
  const mission = aboutData?.mission || 'To deliver world-class engineering and construction solutions that exceed client expectations while maintaining the highest standards of safety, quality, and environmental responsibility.';
  const vision = aboutData?.vision || "To be recognized as Nepal's leading engineering and construction company, known for innovation, reliability, and sustainable practices.";
  const storyTitle = aboutData?.storyTitle || 'Our Story';
  const history = aboutData?.history || 'Founded in 2050 B.S., RASS Engineering & Construction Pvt. Ltd. has been a pioneer in specialized construction solutions across Nepal.';
  const storyImage = aboutData?.storyImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80';
  const foundedYear = aboutData?.foundedYear || '2050 B.S.';
  const experience = aboutData?.experience || '31+';
  const completedProjects = aboutData?.completedProjects || '500+';
  const directorName = aboutData?.directorName || 'Rabi Kumar Paudel';
  const directorPosition = aboutData?.directorPosition || 'Managing Director';
  const directorExperience = aboutData?.directorExperience || 'Director from 2050 B.S. to 2073 B.S., Managing Director since 2073 B.S.';
  const directorBio = aboutData?.directorBio || 'With decades of hands-on experience in construction engineering, Rabi Kumar Paudel has been instrumental in shaping RASS Engineering into the industry leader it is today.';

  const values = aboutData?.values || [
    {
      id: '1',
      icon: 'Award',
      title: 'Excellence',
      description: 'Committed to delivering the highest quality in every project we undertake'
    },
    {
      id: '2',
      icon: 'Users',
      title: 'Client Focus',
      description: 'Building lasting relationships through exceptional service and trust'
    },
    {
      id: '3',
      icon: 'Target',
      title: 'Innovation',
      description: 'Embracing advanced technologies and modern construction techniques'
    },
    {
      id: '4',
      icon: 'Eye',
      title: 'Integrity',
      description: 'Operating with transparency, honesty, and professional ethics'
    }
  ];

  const stats = aboutData?.stats || [
    { id: '1', value: experience, label: 'Years of Experience' },
    { id: '2', value: completedProjects, label: 'Completed Projects' }
  ];

  const team = aboutData?.team || [];

  return (
    <>
      <Helmet>
        <title>About Us | RASS Engineering & Construction</title>
        <meta
          name="description"
          content="Learn about RASS Engineering & Construction Pvt. Ltd. - 31+ years of engineering excellence led by Managing Director Rabi Kumar Paudel."
        />
        <link rel="canonical" href="/about" />
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
                <span className="text-[#F46A1F] font-semibold text-sm">WHO WE ARE</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
                {heroTitle.split(' ').map((word, idx) => 
                  word === 'RASS' || word === 'Engineering' ? (
                    <span key={idx} className="text-[#F46A1F]">{word} </span>
                  ) : (
                    <span key={idx}>{word} </span>
                  )
                )}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {heroSubtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <img
                  src={storyImage}
                  alt="RASS Engineering"
                  className="w-full h-[500px] object-cover rounded-2xl shadow-xl"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-4xl font-bold text-black mb-6">{storyTitle}</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p className="whitespace-pre-wrap">{history}</p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-6">
                  {stats.map((stat, idx) => (
                    <div key={stat.id || idx} className="bg-[#F4F4F4] p-6 rounded-xl">
                      <div className="text-3xl font-bold text-[#F46A1F] mb-2">{stat.value}</div>
                      <div className="text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-[#F4F4F4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <Card className="h-full bg-white border-0 rounded-2xl">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-[#F46A1F]/10 rounded-xl flex items-center justify-center mb-6">
                      <Target className="text-[#F46A1F]" size={32} />
                    </div>
                    <h3 className="text-3xl font-bold text-black mb-4">Our Mission</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {mission}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <Card className="h-full bg-white border-0 rounded-2xl">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-[#F46A1F]/10 rounded-xl flex items-center justify-center mb-6">
                      <Eye className="text-[#F46A1F]" size={32} />
                    </div>
                    <h3 className="text-3xl font-bold text-black mb-4">Our Vision</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {vision}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                Our Core Values
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                The principles that guide our every decision and action
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const IconComponent = getIconComponent(value.icon);
                return (
                  <motion.div
                    key={value.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full bg-[#F4F4F4] border-0 rounded-2xl hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className="w-14 h-14 bg-[#F46A1F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <IconComponent className="text-[#F46A1F]" size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-black mb-3">{value.title}</h3>
                        <p className="text-gray-600 text-sm">{value.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Members (if any) */}
        {team.length > 0 && (
          <section className="py-20 bg-[#F4F4F4]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                  Our Team
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Meet the talented professionals behind our success
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {team.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="bg-white border-0 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                          {member.image ? (
                            <img 
                              src={member.image} 
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#F46A1F]/10">
                              <span className="text-6xl font-bold text-[#F46A1F]">
                                {member.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-black mb-1">{member.name}</h3>
                          <p className="text-[#F46A1F] font-semibold mb-3">{member.position}</p>
                          {member.bio && (
                            <p className="text-sm text-gray-600">{member.bio}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Leadership */}
        <section className="py-20 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Leadership</h2>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12">
                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    {directorName}
                  </h3>
                  <div className="text-[#F46A1F] text-lg font-semibold">
                    {directorPosition}
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {directorExperience}
                </p>
                {directorBio && (
                  <p className="text-gray-300 leading-relaxed mt-4 whitespace-pre-wrap">
                    {directorBio}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#F4F4F4]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Partner With Us
              </h2>
              <p className="text-xl text-gray-600 mb-10">
                Experience the difference that three decades of engineering excellence can make
              </p>
              <Link to="/contact">
                <Button className="bg-[#F46A1F] hover:bg-[#d85a15] text-white px-10 py-6 text-lg">
                  Get In Touch
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;