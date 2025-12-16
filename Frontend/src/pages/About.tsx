import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Eye, Award, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { companyInfo } from '../data/mockData';

interface ValueItem {
  icon: React.ComponentType<{ className?: string; size?: string | number }>;
  title: string;
  description: string;
}

const About: React.FC = () => {
  const values: ValueItem[] = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to delivering the highest quality in every project we undertake'
    },
    {
      icon: Users,
      title: 'Client Focus',
      description: 'Building lasting relationships through exceptional service and trust'
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Embracing advanced technologies and modern construction techniques'
    },
    {
      icon: Eye,
      title: 'Integrity',
      description: 'Operating with transparency, honesty, and professional ethics'
    }
  ];

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
                About <span className="text-[#F46A1F]">RASS Engineering</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Building Nepal's infrastructure with precision, dedication, and engineering excellence since 2050 B.S.
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
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
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
                <h2 className="text-4xl font-bold text-black mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Founded in <strong>2050 B.S.</strong>, RASS Engineering & Construction Pvt. Ltd. has been
                    a pioneer in specialized construction solutions across Nepal. What started as a vision
                    to provide world-class engineering services has grown into a trusted name in the industry.
                  </p>
                  <p>
                    Under the exceptional leadership of <strong>{companyInfo.managingDirector.name}</strong>,
                    who served as Director from 2050 B.S. to 2073 B.S. and has been our Managing Director
                    since 2073 B.S., we have successfully completed over 500 projects across various sectors.
                  </p>
                  <p>
                    Our commitment to quality, innovation, and client satisfaction has made us the preferred
                    choice for specialized construction services in Nepal.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div className="bg-[#F4F4F4] p-6 rounded-xl">
                    <div className="text-3xl font-bold text-[#F46A1F] mb-2">31+</div>
                    <div className="text-gray-600">Years of Experience</div>
                  </div>
                  <div className="bg-[#F4F4F4] p-6 rounded-xl">
                    <div className="text-3xl font-bold text-[#F46A1F] mb-2">500+</div>
                    <div className="text-gray-600">Completed Projects</div>
                  </div>
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
                    <p className="text-gray-600 leading-relaxed">
                      To deliver world-class engineering and construction solutions that exceed client
                      expectations while maintaining the highest standards of safety, quality, and
                      environmental responsibility. We strive to be the most trusted partner for specialized
                      construction services in Nepal.
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
                    <p className="text-gray-600 leading-relaxed">
                      To be recognized as Nepal's leading engineering and construction company, known for
                      innovation, reliability, and sustainable practices. We envision a future where every
                      structure we work on stands as a testament to engineering excellence and durability.
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
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full bg-[#F4F4F4] border-0 rounded-2xl hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 bg-[#F46A1F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <value.icon className="text-[#F46A1F]" size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-black mb-3">{value.title}</h3>
                      <p className="text-gray-600 text-sm">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
                    {companyInfo.managingDirector.name}
                  </h3>
                  <div className="text-[#F46A1F] text-lg font-semibold">
                    {companyInfo.managingDirector.position}
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {companyInfo.managingDirector.experience}
                </p>
                <p className="text-gray-300 leading-relaxed mt-4">
                  With decades of hands-on experience in construction engineering, Rabi Kumar Paudel
                  has been instrumental in shaping RASS Engineering into the industry leader it is today.
                  His vision, technical expertise, and commitment to quality continue to drive our success.
                </p>
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