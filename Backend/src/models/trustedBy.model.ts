import mongoose, { Document, Schema } from 'mongoose';

export interface ITrustedBy extends Document {
  name: string;
  logo: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const trustedBySchema = new Schema<ITrustedBy>(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters']
    },
    logo: {
      type: String,
      required: [true, 'Logo URL is required'],
      trim: true
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
trustedBySchema.index({ order: 1 });
trustedBySchema.index({ active: 1 });

const TrustedBy = mongoose.model<ITrustedBy>('TrustedBy', trustedBySchema);

export default TrustedBy;