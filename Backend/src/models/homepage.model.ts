import mongoose, { Document, Schema } from 'mongoose';

// Hero Section Interface
export interface IHeroButton {
  id: string;
  label: string;
  route: string;
  variant?: 'primary' | 'outline';
}

export interface IHeroSection {
  title: string;
  titleHighlight: string;
  subtitle: string;
  images: string[];
  buttons: IHeroButton[];
}

// About Section Interface
export interface IAboutSection {
  subtitle: string;
  title: string;
  description1: string;
  description2: string;
  image: string;
  managingDirector: string;
}

// Service Interface
export interface IService {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// Contact CTA Interface
export interface IContactCTA {
  heading: string;
  subheading: string;
  phone: string;
  email: string;
}

// Homepage Document Interface
export interface IHomepage extends Document {
  hero: IHeroSection;
  about: IAboutSection;
  services: IService[];
  contactCTA: IContactCTA;
  updatedAt: Date;
  createdAt: Date;
}

const HomepageSchema: Schema = new Schema(
  {
    hero: {
      title: {
        type: String,
        required: true,
        default: '32+ Years of'
      },
      titleHighlight: {
        type: String,
        required: true,
        default: 'Engineering Excellence'
      },
      subtitle: {
        type: String,
        required: true,
        default: 'Specialized Construction Solutions & Engineering Services'
      },
      images: {
        type: [String],
        default: []
      },
      buttons: [{
        id: String,
        label: String,
        route: String,
        variant: {
          type: String,
          enum: ['primary', 'outline'],
          default: 'primary'
        }
      }]
    },
    about: {
      subtitle: {
        type: String,
        default: 'ABOUT US'
      },
      title: {
        type: String,
        default: 'Building Trust Since 2050 B.S.'
      },
      description1: {
        type: String,
        default: ''
      },
      description2: {
        type: String,
        default: ''
      },
      image: {
        type: String,
        default: ''
      },
      managingDirector: {
        type: String,
        default: 'Ram Kumar Shrestha'
      }
    },
    services: [{
      id: String,
      title: String,
      description: String,
      icon: String
    }],
    contactCTA: {
      heading: {
        type: String,
        default: 'Ready to Start Your Project?'
      },
      subheading: {
        type: String,
        default: 'Get a free site inspection and consultation from our expert engineers'
      },
      phone: {
        type: String,
        default: '+977-01-4782881'
      },
      email: {
        type: String,
        default: 'info@rassengineering.com'
      }
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IHomepage>('Homepage', HomepageSchema);