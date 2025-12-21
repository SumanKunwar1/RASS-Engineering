// Mock data for RASS Engineering website

export interface ServiceData {
  id: string;
  title: string;
  icon: string;
  description: string;
  benefits: string[];
  applications: string[];
  image: string;
}

export interface ProjectData {
  id: number;
  title: string;
  category: string;
  location: string;
  year: string;
  client: string;
  description: string;
  scope: string[];
  challenges: string;
  solution: string;
  results: string[];
  image: string;
  gallery: string[];
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
}

export interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
}

export interface WhyChooseUs {
  icon: string;
  title: string;
  description: string;
}

export interface ManagingDirector {
  name: string;
  position: string;
  experience: string;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  phone: string;
  mobile: string[];
  email: string;
  address: string;
  logo: string;
  foundedYear: string;
  managingDirector: ManagingDirector;
}

export const servicesData: ServiceData[] = [
  {
    id: 'waterproofing',
    title: 'Waterproofing Treatment',
    icon: 'Droplets',
    description: 'Comprehensive waterproofing solutions to protect structures from water damage and seepage.',
    benefits: ['Prevents structural damage', 'Increases building lifespan', 'Cost-effective maintenance'],
    applications: ['Basements', 'Roofs', 'Bathrooms', 'Water tanks', 'Foundations'],
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80'
  },
  
  {
    id: 'expansion-joint',
    title: 'Expansion Joint Treatment',
    icon: 'SeparatorHorizontal',
    description: 'Professional expansion joint installation and treatment for structural flexibility.',
    benefits: ['Prevents cracking', 'Accommodates movement', 'Extends structure life'],
    applications: ['Buildings', 'Bridges', 'Highways', 'Concrete structures'],
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80'
  },
  {
    id: 'structural-retrofitting',
    title: 'Structural Retrofitting',
    icon: 'HardHat',
    description: 'Expert structural strengthening and retrofitting for existing buildings and infrastructure.',
    benefits: ['Enhanced safety', 'Earthquake resistance', 'Extended building life'],
    applications: ['Old buildings', 'Heritage structures', 'Industrial facilities', 'Residential complexes'],
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80'
  },
  {
    id: 'epoxy-flooring',
    title: 'Epoxy & PU Flooring',
    icon: 'Square',
    description: 'High-quality epoxy and polyurethane flooring solutions for industrial and commercial spaces.',
    benefits: ['Durable surface', 'Easy maintenance', 'Chemical resistant'],
    applications: ['Factories', 'Warehouses', 'Hospitals', 'Parking areas'],
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80'
  },
  {
    id: 'acp-cladding',
    title: 'ACP & HPL Cladding',
    icon: 'Layers',
    description: 'Modern facade solutions with ACP and HPL cladding for aesthetic and protective building exteriors.',
    benefits: ['Modern aesthetics', 'Weather protection', 'Low maintenance'],
    applications: ['Building facades', 'Commercial complexes', 'Residential towers'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'
  },
  {
    id: 'structural-glazing',
    title: 'Structural Glazing & Aluminum Works',
    icon: 'Grid3x3',
    description: 'Premium structural glazing and aluminum fabrication for modern architectural designs.',
    benefits: ['Natural lighting', 'Energy efficient', 'Contemporary look'],
    applications: ['Corporate buildings', 'Shopping malls', 'Hotels', 'High-rise buildings'],
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80'
  },
  {
    id: 'metal-truss',
    title: 'Metal Truss & Canopy Fabrication',
    icon: 'Box',
    description: 'Custom metal truss and canopy fabrication for large-span structures.',
    benefits: ['Large span coverage', 'Durable construction', 'Custom designs'],
    applications: ['Industrial sheds', 'Warehouses', 'Stadiums', 'Parking canopies'],
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80'
  },
   {
    id: 'anti-termite',
    title: 'Anti-Termite Treatment',
    icon: 'Bug',
    description: 'Complete anti-termite protection for buildings and structures.',
    benefits: ['Protects wood structures', 'Long-lasting protection', 'Eco-friendly solutions'],
    applications: ['New constructions', 'Existing buildings', 'Wooden structures'],
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80'
  }
];

export const projectsData: ProjectData[] = [
  {
    id: 1,
    title: 'Kathmandu Corporate Tower Waterproofing',
    category: 'Waterproofing',
    location: 'Kathmandu, Nepal',
    year: '2024',
    client: 'Confidential',
    description: 'Complete waterproofing solution for a 15-story corporate tower including basement, terrace, and facade treatment.',
    scope: ['Basement waterproofing', 'Terrace treatment', 'Facade protection', 'Water tank sealing'],
    challenges: 'Working on an occupied building required careful planning and execution without disrupting daily operations.',
    solution: 'Implemented advanced membrane waterproofing system with minimal disruption using weekend and night shifts.',
    results: ['Zero leakage post-treatment', '100% client satisfaction', 'Completed 2 weeks ahead of schedule'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
      'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800&q=80',
      'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=800&q=80'
    ]
  },
  {
    id: 2,
    title: 'Heritage Building Structural Retrofitting',
    category: 'Structural Retrofitting',
    location: 'Patan Durbar Square',
    year: '2023',
    client: 'Department of Archaeology',
    description: 'Earthquake-resistant retrofitting of a 300-year-old heritage building while preserving its architectural integrity.',
    scope: ['Structural assessment', 'Foundation strengthening', 'Column & beam retrofitting', 'Heritage-sensitive restoration'],
    challenges: 'Maintaining original architectural features while enhancing structural stability.',
    solution: 'Used advanced fiber-reinforced polymer (FRP) wrapping and micro-piling techniques.',
    results: ['Enhanced earthquake resistance', 'Preserved heritage value', 'UNESCO recognition'],
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
      'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
    ]
  },
  {
    id: 3,
    title: 'Industrial Factory Epoxy Flooring',
    category: 'Epoxy Flooring',
    location: 'Bhaktapur Industrial Estate',
    year: '2024',
    client: 'ABC Manufacturing Pvt. Ltd.',
    description: 'High-performance epoxy flooring installation for a 50,000 sq.ft. manufacturing facility.',
    scope: ['Surface preparation', 'Anti-static epoxy coating', 'Chemical-resistant finish', 'Line marking'],
    challenges: 'Completing installation during operational hours with chemical exposure concerns.',
    solution: 'Phased execution with fast-curing epoxy system allowing quick turnaround.',
    results: ['Chemical-resistant surface', 'Zero downtime', '10-year warranty'],
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee67f0e06e8e?w=800&q=80'
    ]
  },
  {
    id: 4,
    title: 'Shopping Mall ACP Cladding',
    category: 'ACP Cladding',
    location: 'Pokhara',
    year: '2023',
    client: 'Lakeside Mall Development',
    description: 'Complete facade transformation with premium ACP cladding and structural glazing.',
    scope: ['Facade design', 'ACP panel installation', 'Structural glazing', 'LED integration'],
    challenges: 'Weather-dependent installation in monsoon season.',
    solution: 'Strategic scheduling and weather-proof installation techniques.',
    results: ['Modern aesthetic appeal', 'Energy-efficient facade', 'Increased footfall by 40%'],
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
      'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=800&q=80'
    ]
  },
  {
    id: 5,
    title: 'Warehouse Metal Truss Installation',
    category: 'Metal Fabrication',
    location: 'Bara District',
    year: '2024',
    client: 'Logistics Hub Nepal',
    description: 'Large-span metal truss fabrication and installation for a modern warehouse facility.',
    scope: ['Custom truss design', 'Fabrication', 'On-site installation', 'Roofing integration'],
    challenges: 'Achieving 40-meter clear span without intermediate supports.',
    solution: 'Engineered high-strength steel truss system with precise calculations.',
    results: ['40m clear span achieved', 'Cost-effective solution', 'Completed in record time'],
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80'
    ]
  },
  {
    id: 6,
    title: 'Hospital Expansion Joint Treatment',
    category: 'Expansion Joint',
    location: 'Lalitpur',
    year: '2023',
    client: 'Grande International Hospital',
    description: 'Critical expansion joint installation and treatment for hospital building expansion.',
    scope: ['Joint design', 'Waterproofing integration', 'Movement accommodation', 'Seismic considerations'],
    challenges: 'Hospital operations could not be affected during installation.',
    solution: 'Modular installation approach with dust-free and noise-controlled execution.',
    results: ['Zero operational disruption', 'Seismic-compliant joints', 'Maintenance-free solution'],
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80'
    ]
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Essential Waterproofing Tips for Monsoon Season',
    excerpt: 'Prepare your building for heavy rainfall with these expert waterproofing strategies.',
    content: 'Monsoon season brings heavy rainfall that can cause significant damage to buildings if not properly waterproofed...',
    author: 'RASS Engineering Team',
    date: '2025-07-15',
    category: 'Waterproofing',
    image: 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=1200&q=80',
    readTime: '5 min read'
  },
  {
    id: 2,
    title: 'Structural Retrofitting: When and Why Your Building Needs It',
    excerpt: 'Understanding the importance of structural retrofitting for older buildings in earthquake-prone areas.',
    content: 'Structural retrofitting is essential for enhancing the safety and longevity of existing buildings...',
    author: 'Rabi Kumar Paudel',
    date: '2025-06-20',
    category: 'Structural Engineering',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
    readTime: '7 min read'
  },
  {
    id: 3,
    title: 'Choosing the Right Epoxy Flooring for Your Industrial Facility',
    excerpt: 'A comprehensive guide to selecting epoxy flooring systems based on your specific needs.',
    content: 'Epoxy flooring has become the preferred choice for industrial and commercial spaces due to its durability...',
    author: 'RASS Engineering Team',
    date: '2025-05-10',
    category: 'Flooring Solutions',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80',
    readTime: '6 min read'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Rajesh Shrestha',
    position: 'Project Manager',
    company: 'ABC Construction Ltd.',
    content: 'RASS Engineering delivered exceptional waterproofing solutions for our corporate tower. Their expertise and professionalism are unmatched.',
    rating: 5
  },
  {
    id: 2,
    name: 'Sunita Maharjan',
    position: 'Facility Manager',
    company: 'Grande Hospital',
    content: 'The team handled our expansion joint project with utmost care, ensuring zero disruption to hospital operations. Highly recommended!',
    rating: 5
  },
  {
    id: 3,
    name: 'Anil Kumar',
    position: 'Owner',
    company: 'Manufacturing Enterprise',
    content: 'Outstanding epoxy flooring work! The quality and durability exceeded our expectations. Worth every rupee invested.',
    rating: 5
  }
];

export const whyChooseUsData: WhyChooseUs[] = [
  {
    icon: 'Award',
    title: '32+ Years Experience',
    description: 'Three decades of engineering excellence since 2050 B.S.'
  },
  {
    icon: 'Sparkles',
    title: 'Advanced Technologies',
    description: 'Latest equipment and innovative construction techniques'
  },
  {
    icon: 'Target',
    title: 'Tailored Solutions',
    description: 'Customized approach for every unique project'
  },
  {
    icon: 'ShieldCheck',
    title: 'Quality Commitment',
    description: 'Uncompromising standards and lasting results'
  },
  {
    icon: 'Workflow',
    title: 'End-to-End Services',
    description: 'From consultation to completion and maintenance'
  }
];

export const companyInfo: CompanyInfo = {
  name: 'RASS Engineering & Construction Pvt. Ltd.',
  tagline: '32+ Years of Engineering Excellence',
  phone: '977-01-5907561',
  mobile: ['9851084572', '9849792606'],
  email: 'rass.engineering2016@gmail.com',
  address: 'Basundhara, Kathmandu, Nepal',
  logo: 'https://res.cloudinary.com/dihev9qxc/image/upload/v1765519977/WhatsApp_Image_2025-12-09_at_15.04.23_99b99d02_havp7x.jpg',
  foundedYear: '2050 B.S.',
  managingDirector: {
    name: 'Rabi Kumar Paudel',
    position: 'Managing Director',
    experience: 'Director from 2050 B.S. to 2073 B.S., Managing Director since 2073 B.S.'
  }
};