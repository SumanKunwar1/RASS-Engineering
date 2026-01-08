import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  position: string;
  company: string;
  testimonial: string;
  image?: string;
  rating: number;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
      maxlength: [100, 'Position cannot exceed 100 characters']
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    testimonial: {
      type: String,
      required: [true, 'Testimonial is required'],
      trim: true,
      maxlength: [1000, 'Testimonial cannot exceed 1000 characters']
    },
    image: {
      type: String,
      trim: true,
      default: ''
    },
    rating: {
      type: Number,
      default: 5,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    order: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
testimonialSchema.index({ order: 1 });
testimonialSchema.index({ active: 1 });

const Testimonial = mongoose.model<ITestimonial>('Testimonial', testimonialSchema);

export default Testimonial;