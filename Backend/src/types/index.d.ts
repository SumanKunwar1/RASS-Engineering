// Extend Express Request type globally
declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
      _id: any;
    };
    file?: Express.Multer.File;
    files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
  }
}

// JWT Payload type
declare module 'jsonwebtoken' {
  export interface JwtPayload {
    id: string;
  }
}

// Environment variables type
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      SERVER_URL: string;
      CLIENT_URL: string;
      
      // MongoDB
      MONGODB_URI: string;
      
      // JWT
      JWT_SECRET: string;
      JWT_EXPIRY: string;
      ADMIN_JWT_EXPIRY: string;
      
      // Cloudinary
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      CLOUDINARY_URL?: string;
      
      // Email
      EMAIL_HOST?: string;
      EMAIL_PORT?: string;
      EMAIL_USER?: string;
      EMAIL_PASS?: string;
      EMAIL_FROM?: string;
      EMAIL_FROM_NAME?: string;
      
      // Admin
      ADMIN_EMAIL?: string;
      ADMIN_INITIAL_PASSWORD?: string;
      ADMIN_NAME?: string;
      
      // Rate Limiting
      RATE_LIMIT_WINDOW_MS: string;
      RATE_LIMIT_MAX: string;
      
      // CORS
      CORS_ORIGIN?: string;
      
      // Application
      APP_NAME?: string;
      COMPANY_NAME?: string;
      COMPANY_PHONE?: string;
      COMPANY_EMAIL?: string;
      COMPANY_ADDRESS?: string;
    }
  }
}

export {};