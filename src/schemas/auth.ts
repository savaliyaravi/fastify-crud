/**
 * Authentication-specific schemas
 */
import {
  authResponseSchema,
  badRequestSchema,
  unauthorizedSchema,
  conflictSchema,
} from './common';

// Request body schemas
export const registerBodySchema = {
  type: 'object',
  required: ['name', 'email', 'password'],
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
    password: {
      type: 'string',
      minLength: 6,
      description: 'User password (minimum 6 characters)',
    },
  },
};

export const loginBodySchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
      description: 'User email address',
    },
    password: {
      type: 'string',
      description: 'User password',
    },
  },
};

// Complete route schemas
export const registerRouteSchema = {
  description: 'Register a new user',
  tags: ['Authentication'],
  body: registerBodySchema,
  response: {
    201: {
      ...authResponseSchema,
      description: 'User registered successfully',
    },
    ...badRequestSchema,
    ...conflictSchema,
  },
};

export const loginRouteSchema = {
  description: 'Authenticate user and return JWT token',
  tags: ['Authentication'],
  body: loginBodySchema,
  response: {
    200: {
      ...authResponseSchema,
      description: 'Login successful',
    },
    ...badRequestSchema,
    ...unauthorizedSchema,
  },
};
