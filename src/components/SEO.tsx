import { Helmet, HelmetProvider } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
}

const defaultMeta = {
  title: 'RASS Engineering & Construction | Waterproofing & Structural Experts',
  description: 'RASS Engineering & Construction Pvt. Ltd. offers professional waterproofing, structural retrofitting, epoxy flooring and specialized construction solutions with 31+ years of expertise in Nepal.',
  ogImage: 'https://res.cloudinary.com/dihev9qxc/image/upload/f_auto,q_auto/v1765519977/WhatsApp_Image_2025-12-09_at_15.04.23_99b99d02_havp7x.jpg',
  keywords: 'waterproofing nepal, structural retrofitting, epoxy flooring, construction company nepal, RASS engineering, building repair, cement grouting, ACP cladding',
};

export function SEO({
  title,
  description = defaultMeta.description,
  canonical,
  ogImage = defaultMeta.ogImage,
  ogType = 'website',
  keywords = defaultMeta.keywords,
}: SEOProps) {
  const pageTitle = title
    ? `${title} | RASS Engineering & Construction`
    : defaultMeta.title;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="RASS Engineering & Construction Pvt. Ltd." />
      
      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="RASS Engineering & Construction" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="geo.region" content="NP" />
      <meta name="geo.placename" content="Kathmandu" />
    </Helmet>
  );
}

export { HelmetProvider };
