export class ApiResponse<T = any> {
  status: string;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };

  constructor(
    status: string = 'success',
    message?: string,
    data?: T,
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    }
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  static success<T>(data?: T, message?: string, meta?: any): ApiResponse<T> {
    return new ApiResponse('success', message, data, meta);
  }

  static error(message: string): ApiResponse {
    return new ApiResponse('error', message);
  }

  static paginate<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ): ApiResponse<T[]> {
    const totalPages = Math.ceil(total / limit);
    
    return new ApiResponse('success', message, data, {
      page,
      limit,
      total,
      totalPages,
    });
  }
}

// Send response helper
export const sendResponse = <T>(
  res: any,
  statusCode: number,
  data?: T,
  message?: string,
  meta?: any
) => {
  const response = new ApiResponse(
    statusCode >= 200 && statusCode < 300 ? 'success' : 'error',
    message,
    data,
    meta
  );
  
  return res.status(statusCode).json(response);
};