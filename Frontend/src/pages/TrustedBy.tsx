import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface TrustedCompany {
  _id: string;
  name: string;
  logo: string;
  order: number;
  active: boolean;
}

const TrustedBy: React.FC = () => {
  const [companies, setCompanies] = useState<TrustedCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_URL}/trusted-by`);
      
      if (response.data.success) {
        setCompanies(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch trusted companies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || companies.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-block px-4 py-2 bg-[#F46A1F]/10 rounded-full mb-4">
            <span className="text-[#F46A1F] font-semibold text-sm">OUR CLIENTS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Trusted By Leading <span className="text-[#F46A1F]">Organizations</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Proud to serve Nepal's most prestigious companies and institutions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          {/* Logo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {companies.map((company, index) => (
              <motion.div
                key={company._id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white p-6 rounded-xl border-2 border-gray-100 hover:border-[#F46A1F] transition-all duration-300 hover:shadow-xl flex flex-col items-center justify-center h-full min-h-[140px]">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="max-h-16 w-auto object-contain mb-3 grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden text-center">
                    <div className="w-16 h-16 bg-[#F46A1F]/10 rounded-full flex items-center justify-center mb-2 mx-auto">
                      <span className="text-2xl font-bold text-[#F46A1F]">
                        {company.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 text-center group-hover:text-[#F46A1F] transition-colors">
                    {company.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#F46A1F]/5 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#F46A1F]/5 rounded-full blur-3xl -z-10" />
        </motion.div>

        {/* Stats or Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#F46A1F]/10 rounded-full">
            <div className="flex -space-x-2">
              {companies.slice(0, 3).map((company, index) => (
                <div
                  key={company._id}
                  className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden"
                  style={{ zIndex: 3 - index }}
                >
                  {company.logo ? (
                    <img src={company.logo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold">{company.name.charAt(0)}</span>
                  )}
                </div>
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">
              Trusted by {companies.length}+ organizations across Nepal
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedBy;