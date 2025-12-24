// data/servicesData.ts

export interface SubService {
  id: string;
  title: string;
  blogId: number;
}

export interface ServiceData {
  id: string;
  title: string;
  icon: string;
  image?: string;
  description: string;
  subServices: SubService[];
  applications: string[];
  gradient: string;
}

export const servicesData: ServiceData[] = [
  {
    id: 'waterproofing',
    title: 'Waterproofing Protection Treatment',
    icon: '💧',
    description: 'We provide advanced waterproofing protection treatments designed to prevent water seepage, leakage, and long-term structural damage. Our solutions are tailored to the specific condition of your property, ensuring durability, safety, and peace of mind.',
    subServices: [
      { 
        id: 'coating-systems', 
        title: 'Different Types of Waterproofing Coating Systems', 
        blogId: 1 
      },
      { 
        id: 'membrane-system', 
        title: 'HY-115 Series / PP Membrane Waterproofing System', 
        blogId: 2 
      },
      { 
        id: 'cement-grouting', 
        title: 'Cement Pressure Injection Grouting Work', 
        blogId: 3 
      },
      { 
        id: 'epoxy-grouting', 
        title: 'Epoxy Injection Grouting', 
        blogId: 4 
      }
    ],
    applications: [
      'Rooftop', 
      'Terraces', 
      'Toilet and bathrooms', 
      'Balconies', 
      'Water tanks', 
      'External walls', 
      'Basement', 
      'Lift pits'
    ],
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'expansion-joint',
    title: 'Expansion Joint Treatment',
    icon: '🔧',
    description: 'Expansion joints are critical points in any structure that allow movement due to temperature changes, settlement, and load variations. If not treated properly, they become major sources of water leakage and structural deterioration. We offer specialized expansion joint treatment solutions designed to ensure flexibility, durability, and complete waterproofing.',
    subServices: [
      { 
        id: 'pu-sealant', 
        title: 'PU Sealant-Based Expansion Joint Treatment', 
        blogId: 5 
      },
      { 
        id: 'bituminous', 
        title: 'Bituminous Expansion Joint Treatment', 
        blogId: 6 
      },
      { 
        id: 'elastomeric', 
        title: 'HY-115 / Elastomeric Expansion Joint System', 
        blogId: 7 
      },
      { 
        id: 'backer-rod', 
        title: 'Expansion Joint Treatment with Backer Rod & Sealant', 
        blogId: 8 
      },
      { 
        id: 'cover-system', 
        title: 'Metal / PVC Expansion Joint Cover System', 
        blogId: 9 
      }
    ],
    applications: [
      'Commercial buildings', 
      'Parking structures', 
      'Industrial floors', 
      'Terraces', 
      'Podium slabs', 
      'External RCC joints', 
      'Bridges Slab'
    ],
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'structural-retrofitting',
    title: 'Structural Retrofitting Works',
    icon: '🏗️',
    description: 'Structural retrofitting strengthens and restores existing buildings to improve safety, load-carrying capacity, and durability. Our structural retrofitting solutions are designed to extend the life of structures, address structural deficiencies, and meet updated safety requirements without major demolition.',
    subServices: [
      { 
        id: 'rcc-jacketing', 
        title: 'RCC Jacketing (Column, Beam & Slab)', 
        blogId: 10 
      },
      { 
        id: 'epoxy-crack', 
        title: 'Epoxy Crack Injection & Structural Repair', 
        blogId: 11 
      },
      { 
        id: 'micro-concrete', 
        title: 'Micro-Concrete & Section Repair Works', 
        blogId: 12 
      },
      { 
        id: 'cfrp', 
        title: 'Carbon Fiber Reinforced Polymer (CFRP) Strengthening', 
        blogId: 13 
      },
      { 
        id: 'corrosion', 
        title: 'Corrosion Protection & Rebar Treatment', 
        blogId: 14 
      },
      { 
        id: 'seismic', 
        title: 'Seismic Retrofitting Solutions', 
        blogId: 15 
      }
    ],
    applications: [
      'Commercial buildings', 
      'Old buildings', 
      'Earthquake-prone structures', 
      'Spalled concrete', 
      'Corroded reinforcement'
    ],
    gradient: 'from-orange-500 to-red-500'
  },
  {
    id: 'epoxy-flooring',
    title: 'Epoxy & PU Flooring Works',
    icon: '🎨',
    description: 'We provide seamless, durable Epoxy and PU flooring solutions designed for strength, safety, and long-term performance in industrial, commercial, and residential spaces.',
    subServices: [
      { 
        id: 'self-leveling', 
        title: 'Epoxy Self-Leveling Flooring', 
        blogId: 16 
      },
      { 
        id: 'screed', 
        title: 'Epoxy Screed Flooring', 
        blogId: 17 
      },
      { 
        id: 'anti-skid', 
        title: 'Anti-Skid Epoxy Flooring', 
        blogId: 18 
      },
      { 
        id: 'pu-systems', 
        title: 'PU Flooring Systems', 
        blogId: 19 
      },
      { 
        id: 'decorative', 
        title: 'Decorative Epoxy Flooring', 
        blogId: 20 
      },
      { 
        id: 'repair', 
        title: 'Floor Repair & Surface Preparation Works', 
        blogId: 21 
      }
    ],
    applications: [
      'Factories', 
      'Warehouses', 
      'Laboratories', 
      'Hospitals', 
      'Staircases', 
      'Showrooms'
    ],
    gradient: 'from-green-500 to-teal-500'
  },
  {
    id: 'interior-exterior',
    title: 'Interior & Exterior Designing Works',
    icon: '🏠',
    description: 'We offer end-to-end interior and exterior designing solutions that combine creativity, engineering precision, and high-quality materials. Our services are focused on enhancing aesthetics, functionality, durability, and overall property value through modern design and expert execution.',
    subServices: [
      { 
        id: 'space-planning', 
        title: 'Space Planning & Concept Design', 
        blogId: 22 
      },
      { 
        id: 'aluminum-partition', 
        title: 'Aluminum Partition Works', 
        blogId: 23 
      },
      { 
        id: 'pvc-ceiling', 
        title: 'PVC Ceiling Works', 
        blogId: 24 
      },
      { 
        id: 'wpc-panel', 
        title: 'WPC Panel Works', 
        blogId: 25 
      },
      { 
        id: 'acp-cladding', 
        title: 'ACP & HPL Cladding Works', 
        blogId: 26 
      },
      { 
        id: 'structural-glazing', 
        title: 'Structural Glazing Works', 
        blogId: 27 
      },
      { 
        id: 'elevation', 
        title: 'Elevation & Façade Design', 
        blogId: 28 
      }
    ],
    applications: [
      'Commercial buildings', 
      'Office façades', 
      'Residential Building'
    ],
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'metal-truss',
    title: 'Metal Truss Fabrication Works',
    icon: '⚙️',
    description: 'We provide precision-engineered metal truss fabrication solutions designed for strength, stability, and long-term performance. Our truss systems are fabricated using high-quality materials and installed by skilled professionals to meet structural, architectural, and safety requirements.',
    subServices: [
      { 
        id: 'ms-gi', 
        title: 'MS & GI Metal Truss Fabrication', 
        blogId: 29 
      },
      { 
        id: 'roofing', 
        title: 'Roofing Truss Systems', 
        blogId: 30 
      },
      { 
        id: 'canopy', 
        title: 'Canopy & Pergola Truss Works', 
        blogId: 31 
      },
      { 
        id: 'staircase', 
        title: 'Staircase & Mezzanine Truss Structures', 
        blogId: 32 
      },
      { 
        id: 'anti-corrosion', 
        title: 'Anti-Corrosion Treatment & Painting', 
        blogId: 33 
      }
    ],
    applications: [
      'Industrial sheds', 
      'Warehouses', 
      'Factories', 
      'Commercial buildings', 
      'Residential buildings'
    ],
    gradient: 'from-gray-600 to-gray-800'
  }
];