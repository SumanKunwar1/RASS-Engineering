import { HelmetProvider } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Hero } from '@/components/home/Hero';
import { AboutPreview } from '@/components/home/AboutPreview';
import { ServicesGrid } from '@/components/home/ServicesGrid';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <>
      <SEO />
      <Layout>
        <Hero />
        <AboutPreview />
        <ServicesGrid />
        <WhyChooseUs />
        <CTASection />
      </Layout>
    </>
  );
};

export default Index;
