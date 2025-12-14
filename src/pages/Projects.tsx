import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Filter } from 'lucide-react';

const categories = ['All', 'Waterproofing', 'Retrofitting', 'Flooring', 'Cladding', 'Glazing'];

const projects = [
  { id: 1, title: 'Commercial Building Waterproofing', category: 'Waterproofing', location: 'Kathmandu' },
  { id: 2, title: 'Hospital Structural Retrofitting', category: 'Retrofitting', location: 'Pokhara' },
  { id: 3, title: 'Industrial Epoxy Flooring', category: 'Flooring', location: 'Biratnagar' },
  { id: 4, title: 'Office Building ACP Cladding', category: 'Cladding', location: 'Kathmandu' },
  { id: 5, title: 'Shopping Mall Glazing', category: 'Glazing', location: 'Lalitpur' },
  { id: 6, title: 'Basement Waterproofing Project', category: 'Waterproofing', location: 'Bhaktapur' },
  { id: 7, title: 'Heritage Building Retrofit', category: 'Retrofitting', location: 'Kathmandu' },
  { id: 8, title: 'Warehouse Floor Coating', category: 'Flooring', location: 'Hetauda' },
  { id: 9, title: 'Corporate HQ Facade', category: 'Cladding', location: 'Kathmandu' },
];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <>
      <SEO 
        title="Our Projects"
        description="Explore RASS Engineering's portfolio of successful construction projects including waterproofing, retrofitting, flooring, and cladding works across Nepal."
      />
      <Layout>
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-construction-dark overflow-hidden">
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[100px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          
          <div className="section-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Our Projects
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
                Proven Track Record of
                <span className="text-primary block">Excellence</span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed">
                Explore our portfolio of successful projects delivered across Nepal.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="section-container">
            {/* Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap items-center gap-3 mb-12"
            >
              <Filter className="text-muted-foreground" size={20} />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>

            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group glass-card overflow-hidden hover:-translate-y-2 hover:shadow-elevated transition-all duration-300"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-construction-dark to-construction-gray flex items-center justify-center">
                    <span className="text-4xl font-heading font-bold text-primary/30">
                      {project.id.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="p-6">
                    <span className="text-primary text-sm font-medium">{project.category}</span>
                    <h3 className="font-heading text-lg font-semibold text-foreground mt-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-2">{project.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Coming Soon Note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mt-16"
            >
              <p className="text-muted-foreground mb-6">
                More project details and images coming soon...
              </p>
              <Button variant="default" asChild>
                <Link to="/contact">
                  Discuss Your Project
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Projects;
