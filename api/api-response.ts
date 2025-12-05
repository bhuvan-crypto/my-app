export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode?: number;
  errors?:Record<string, string>
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
