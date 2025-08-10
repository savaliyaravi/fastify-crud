import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginUserSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .optional(),
  email: z.string().email('Please enter a valid email').optional(),
});

export const userIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
});

// Utility function to format Zod errors into user-friendly messages
export const formatZodError = (
  error: z.ZodError
): { message: string; details?: string[] } => {
  const issues = error.issues;
  const errorMessages: string[] = [];

  issues.forEach((issue) => {
    const field = issue.path.join('.');

    switch (issue.code) {
      case 'invalid_type':
        if (issue.received === 'undefined' || issue.received === 'null') {
          errorMessages.push(`${field} is required`);
        } else {
          errorMessages.push(`${field} must be a ${issue.expected}`);
        }
        break;
      case 'invalid_string':
        if (issue.validation === 'email') {
          errorMessages.push(`${field} must be a valid email address`);
        } else {
          errorMessages.push(`${field} is invalid`);
        }
        break;
      case 'too_small':
        if (issue.type === 'string') {
          errorMessages.push(
            `${field} must be at least ${issue.minimum} characters`
          );
        } else {
          errorMessages.push(`${field} must be at least ${issue.minimum}`);
        }
        break;
      case 'too_big':
        if (issue.type === 'string') {
          errorMessages.push(
            `${field} cannot exceed ${issue.maximum} characters`
          );
        } else {
          errorMessages.push(`${field} cannot exceed ${issue.maximum}`);
        }
        break;
      default:
        errorMessages.push(`${field}: ${issue.message || 'Invalid value'}`);
    }
  });

  let message: string;
  if (errorMessages.length === 1) {
    message = errorMessages[0] || 'Validation error';
  } else if (errorMessages.length > 1) {
    message = `Validation failed: ${errorMessages.join(', ')}`;
  } else {
    message = 'Validation error';
  }

  const result: { message: string; details?: string[] } = {
    message,
  };

  if (errorMessages.length > 1) {
    result.details = errorMessages;
  }

  return result;
};

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
