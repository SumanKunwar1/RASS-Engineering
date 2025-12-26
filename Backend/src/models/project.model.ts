import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
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
  imagePublicId: string;
  gallery: {
    url: string;
    publicId: string;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Waterproofing',
        'Structural Retrofitting',
        'Epoxy Flooring',
        'ACP Cladding',
        'Metal Fabrication',
        'Expansion Joint'
      ]
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    year: {
      type: String,
      required: [true, 'Year is required'],
      trim: true
    },
    client: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    scope: [{
      type: String,
      trim: true
    }],
    challenges: {
      type: String,
      trim: true,
      maxlength: [1000, 'Challenges cannot exceed 1000 characters']
    },
    solution: {
      type: String,
      trim: true,
      maxlength: [1000, 'Solution cannot exceed 1000 characters']
    },
    results: [{
      type: String,
      trim: true
    }],
    image: {
      type: String,
      required: [true, 'Main project image is required']
    },
    imagePublicId: {
      type: String,
      required: [true, 'Image public ID is required']
    },
    gallery: [{
      url: {
        type: String,
        required: true
      },
      publicId: {
        type: String,
        required: true
      }
    }],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
projectSchema.index({ category: 1, isActive: 1 });
projectSchema.index({ createdAt: -1 });

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;