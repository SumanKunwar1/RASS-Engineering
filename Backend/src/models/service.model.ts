import mongoose, { Document, Schema } from 'mongoose';

export interface ISubService {
  title: string;
  blogId: string; // Reference to blog _id (not blog number)
}

export interface IService extends Document {
  title: string;
  description: string;
  subServices: ISubService[];
  applications: string[];
  gradient: string;
  image: string;
  imagePublicId: string;
  slug: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subServiceSchema = new Schema<ISubService>({
  title: {
    type: String,
    required: [true, 'Sub-service title is required'],
    trim: true
  },
  blogId: {
    type: String,
    required: [true, 'Blog ID is required'],
    trim: true
  }
}, { _id: false });

const serviceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    subServices: [subServiceSchema],
    applications: [{
      type: String,
      trim: true
    }],
    gradient: {
      type: String,
      default: 'from-blue-500 to-blue-700',
      trim: true
    },
    image: {
      type: String,
      required: [true, 'Service image is required']
    },
    imagePublicId: {
      type: String,
      required: [true, 'Image public ID is required']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Generate slug from title before saving
serviceSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }
  next();
});

// Index for faster queries
serviceSchema.index({ slug: 1 });
serviceSchema.index({ order: 1, isActive: 1 });
serviceSchema.index({ createdAt: -1 });

const Service = mongoose.model<IService>('Service', serviceSchema);

export default Service;