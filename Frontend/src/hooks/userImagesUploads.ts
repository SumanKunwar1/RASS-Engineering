import { useState } from 'react';
import axios, { AxiosInstance, AxiosProgressEvent } from 'axios';

interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    publicId: string;
    [key: string]: any;
  }[];
}

interface UploadError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with token
const getAuthToken = () => {
  return localStorage.getItem('rass_admin_token');
};

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  // Add interceptor to update token on each request
  instance.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload multiple hero images
   */
  const uploadHeroImages = async (files: File[]) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      if (!files || files.length === 0) {
        throw new Error('No files provided');
      }

      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.post<UploadResponse>(
        '/api/upload/hero-images',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
            }
          },
        }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to upload hero images';
      setError(errorMsg);
      console.error('Hero images upload failed:', err);
      throw err;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  /**
   * Upload single about image
   */
  const uploadAboutImage = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      if (!file) {
        throw new Error('No file provided');
      }

      const formData = new FormData();
      formData.append('file', file);

      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.post<UploadResponse>(
        '/api/upload/about-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
            }
          },
        }
      );

      if (response.data.success && response.data.data) {
        return response.data.data[0]; // Return single item, not array
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to upload about image';
      setError(errorMsg);
      console.error('About image upload failed:', err);
      throw err;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  /**
   * Delete image from Cloudinary
   */
  const deleteImage = async (imageUrl: string) => {
    try {
      if (!imageUrl) {
        throw new Error('Image URL is required');
      }

      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.delete('/api/upload/image', {
        data: { imageUrl },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Delete failed');
      }

      return response.data;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to delete image';
      setError(errorMsg);
      console.error('Image delete failed:', err);
      throw err;
    }
  };

  /**
   * Upload single image
   */
  const uploadSingleImage = async (file: File, folder?: string) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      if (!file) {
        throw new Error('No file provided');
      }

      const formData = new FormData();
      formData.append('file', file);
      if (folder) {
        formData.append('folder', folder);
      }

      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.post<UploadResponse>(
        '/api/upload/image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
            }
          },
        }
      );

      if (response.data.success && response.data.data) {
        return response.data.data[0];
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to upload image';
      setError(errorMsg);
      console.error('Image upload failed:', err);
      throw err;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  /**
   * Upload multiple images
   */
  const uploadMultipleImages = async (files: File[], folder?: string) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      if (!files || files.length === 0) {
        throw new Error('No files provided');
      }

      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      if (folder) {
        formData.append('folder', folder);
      }

      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.post<UploadResponse>(
        '/api/upload/images',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
            }
          },
        }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to upload images';
      setError(errorMsg);
      console.error('Images upload failed:', err);
      throw err;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return {
    isUploading,
    progress,
    error,
    uploadHeroImages,
    uploadAboutImage,
    deleteImage,
    uploadSingleImage,
    uploadMultipleImages,
  };
};