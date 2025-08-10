/**
 * User management schemas
 */
import {
  userListResponseSchema,
  userResponseSchema,
  badRequestSchema,
  unauthorizedSchema,
  notFoundSchema,
  bearerAuthSchema,
  idParamSchema,
} from './common';

// Request body schemas
export const updateUserBodySchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 50,
      description: 'User full name',
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'User email address',
    },
  },
};

// Complete route schemas
export const getUsersRouteSchema = {
  description: 'Get all users (requires authentication)',
  tags: ['Users'],
  security: bearerAuthSchema,
  response: {
    200: {
      ...userListResponseSchema,
      description: 'Users retrieved successfully',
    },
    ...unauthorizedSchema,
  },
};

export const getUserByIdRouteSchema = {
  description: 'Get user by ID (requires authentication)',
  tags: ['Users'],
  security: bearerAuthSchema,
  params: idParamSchema,
  response: {
    200: {
      ...userResponseSchema,
      description: 'User retrieved successfully',
    },
    ...badRequestSchema,
    ...unauthorizedSchema,
    ...notFoundSchema,
  },
};

export const updateUserRouteSchema = {
  description: 'Update user by ID (requires authentication)',
  tags: ['Users'],
  security: bearerAuthSchema,
  params: idParamSchema,
  body: updateUserBodySchema,
  response: {
    200: {
      ...userResponseSchema,
      description: 'User updated successfully',
    },
    ...badRequestSchema,
    ...unauthorizedSchema,
    ...notFoundSchema,
  },
};

export const deleteUserRouteSchema = {
  description: 'Delete user by ID (requires authentication)',
  tags: ['Users'],
  security: bearerAuthSchema,
  params: idParamSchema,
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
      },
      description: 'User deleted successfully',
    },
    ...badRequestSchema,
    ...unauthorizedSchema,
    ...notFoundSchema,
  },
};
