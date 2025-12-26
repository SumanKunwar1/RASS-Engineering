import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: Date;
  category: string;
  image: string;
  imagePublicId: string;
  readTime: string;
  published: boolean;
  slug: string;
  views: number;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
      maxlength: [500, 'Excerpt cannot exceed 500 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      default: 'RASS Engineering Team'
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Waterproofing',
        'Structural Engineering',
        'Flooring Solutions',
        'Construction Tips',
        'Technology',
        'Safety',
        'Case Studies',
        'Industry News'
      ]
    },
    image: {
      type: String,
      required: [true, 'Featured image is required']
    },
    imagePublicId: {
      type: String,
      required: [true, 'Image public ID is required']
    },
    readTime: {
      type: String,
      default: '5 min',
      trim: true
    },
    published: {
      type: Boolean,
      default: false
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    views: {
      type: Number,
      default: 0
    },
    tags: [{
      type: String,
      trim: true
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

// Generate slug from title before saving
blogSchema.pre('save', function(next) {
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
blogSchema.index({ category: 1, published: 1, isActive: 1 });
blogSchema.index({ slug: 1 });
blogSchema.index({ date: -1 });
blogSchema.index({ createdAt: -1 });

const Blog = mongoose.model<IBlog>('Blog', blogSchema);

export default Blog;