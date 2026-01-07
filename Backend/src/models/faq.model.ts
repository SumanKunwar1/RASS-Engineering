import mongoose, { Document, Schema } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const faqSchema = new Schema<IFAQ>(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
      maxlength: [500, 'Question cannot exceed 500 characters']
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true,
      maxlength: [3000, 'Answer cannot exceed 3000 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['general', 'services', 'pricing', 'technical', 'projects'],
      default: 'general',
      lowercase: true
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

// Indexes for faster queries
faqSchema.index({ category: 1, order: 1 });
faqSchema.index({ active: 1 });

const FAQ = mongoose.model<IFAQ>('FAQ', faqSchema);

export default FAQ;