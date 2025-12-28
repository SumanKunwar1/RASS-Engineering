import mongoose, { Document, Schema } from 'mongoose';

export interface IQuote extends Document {
  name: string;
  company?: string;
  phone: string;
  email: string;
  serviceType: string;
  projectType?: string;
  projectSize?: string;
  timeline?: string;
  budget?: string;
  description: string;
  address: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const quoteSchema = new Schema<IQuote>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    company: {
      type: String,
      trim: true,
      maxlength: [150, 'Company name cannot exceed 150 characters']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
      enum: ['construction', 'engineering', 'consultation', 'multiple'],
      lowercase: true
    },
    projectType: {
      type: String,
      enum: ['residential', 'commercial', 'industrial', 'institutional', 'infrastructure', ''],
      lowercase: true
    },
    projectSize: {
      type: String,
      trim: true
    },
    timeline: {
      type: String,
      enum: ['immediate', '1-month', '2-3-months', '3-6-months', '6-months-plus', ''],
      lowercase: true
    },
    budget: {
      type: String,
      enum: ['under-500k', '500k-1m', '1m-2m', '2m-5m', '5m-plus', ''],
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: [3000, 'Description cannot exceed 3000 characters']
    },
    address: {
      type: String,
      required: [true, 'Project location is required'],
      trim: true,
      maxlength: [300, 'Address cannot exceed 300 characters']
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'closed'],
      default: 'new'
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster queries
quoteSchema.index({ status: 1, createdAt: -1 });
quoteSchema.index({ email: 1 });
quoteSchema.index({ serviceType: 1 });

const Quote = mongoose.model<IQuote>('Quote', quoteSchema);

export default Quote;