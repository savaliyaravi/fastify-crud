/**
 * Common reusable Swagger/JSON schemas
 */

// Standard response schemas
export const successResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
  },
  required: ['success', 'message'],
};

export const errorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    details: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['success', 'message'],
};

// User schemas
export const userObjectSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

export const authResponseSchema = {
  type: 'object',
  properties: {
    ...successResponseSchema.properties,
    data: {
      type: 'object',
      properties: {
        user: userObjectSchema,
        token: { type: 'string' },
      },
    },
  },
};

export const userListResponseSchema = {
  type: 'object',
  properties: {
    ...successResponseSchema.properties,
    data: {
      type: 'array',
      items: userObjectSchema,
    },
  },
};

export const userResponseSchema = {
  type: 'object',
  properties: {
    ...successResponseSchema.properties,
    data: userObjectSchema,
  },
};

// Common error responses
export const badRequestSchema = {
  400: {
    ...errorResponseSchema,
    description: 'Bad Request - Invalid input data',
  },
};

export const unauthorizedSchema = {
  401: {
    ...errorResponseSchema,
    description: 'Unauthorized - Missing or invalid token',
  },
};

export const forbiddenSchema = {
  403: {
    ...errorResponseSchema,
    description: 'Forbidden - Insufficient permissions',
  },
};

export const notFoundSchema = {
  404: {
    ...errorResponseSchema,
    description: 'Not Found - Resource does not exist',
  },
};

export const conflictSchema = {
  409: {
    ...errorResponseSchema,
    description: 'Conflict - Resource already exists',
  },
};

export const validationErrorSchema = {
  422: {
    ...errorResponseSchema,
    description: 'Validation Error - Input validation failed',
  },
};

export const internalErrorSchema = {
  500: {
    ...errorResponseSchema,
    description: 'Internal Server Error',
  },
};

// Common parameter schemas
export const idParamSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      type: 'string',
      pattern: '^[0-9a-fA-F]{24}$',
      description: 'MongoDB ObjectId',
    },
  },
};

// Security schemas
export const bearerAuthSchema = [{ bearerAuth: [] }];
