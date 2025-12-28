import mongoose, { Document, Schema } from 'mongoose';

export interface IStat {
  label: string;
  value: string;
}

export interface ICompanyValue {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ITeamMember {
  id: string;
  name: string;
  position: string;
  email?: string;
  bio?: string;
  image?: string;
}

export interface IAbout extends Document {
  heroTitle: string;
  heroSubtitle: string;
  mission: string;
  vision: string;
  history: string;
  storyTitle?: string;
  storyImage?: string;
  foundedYear?: string;
  experience?: string;
  completedProjects?: string;
  directorName?: string;
  directorPosition?: string;
  directorExperience?: string;
  directorBio?: string;
  values: ICompanyValue[];
  team: ITeamMember[];
  stats: IStat[];
  createdAt: Date;
  updatedAt: Date;
}

const statSchema = new Schema({
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
}, { _id: false });

const companyValueSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true,
    default: 'Award'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { _id: false });

const teamMemberSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  bio: {
    type: String
  },
  image: {
    type: String
  }
}, { _id: false });

const aboutSchema = new Schema<IAbout>(
  {
    heroTitle: {
      type: String,
      required: true,
      default: 'About RASS Engineering'
    },
    heroSubtitle: {
      type: String,
      required: true,
      default: "Building Nepal's infrastructure with precision"
    },
    mission: {
      type: String,
      required: true,
      default: 'To deliver world-class engineering and construction solutions'
    },
    vision: {
      type: String,
      required: true,
      default: "To be recognized as Nepal's leading engineering company"
    },
    history: {
      type: String,
      default: ''
    },
    storyTitle: {
      type: String,
      default: 'Our Story'
    },
    storyImage: {
      type: String,
      default: ''
    },
    foundedYear: {
      type: String,
      default: '2050 B.S.'
    },
    experience: {
      type: String,
      default: '31+'
    },
    completedProjects: {
      type: String,
      default: '500+'
    },
    directorName: {
      type: String,
      default: 'Rabi Kumar Paudel'
    },
    directorPosition: {
      type: String,
      default: 'Managing Director'
    },
    directorExperience: {
      type: String,
      default: ''
    },
    directorBio: {
      type: String,
      default: ''
    },
    values: {
      type: [companyValueSchema],
      default: []
    },
    team: {
      type: [teamMemberSchema],
      default: []
    },
    stats: {
      type: [statSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Ensure only one about document exists
aboutSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.models.About.countDocuments();
    if (count > 0) {
      throw new Error('Only one About document is allowed');
    }
  }
  next();
});

const About = mongoose.model<IAbout>('About', aboutSchema);

export default About;