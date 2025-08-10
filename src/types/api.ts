// Standard API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  details?: string[];
}

export interface ApiError {
  success: false;
  message: string;
  details?: string[];
  code?: string;
  statusCode?: number;
}

// Common response data types
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}

// HTTP Status codes enum
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}
