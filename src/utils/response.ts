import { FastifyReply } from 'fastify';
import { ApiResponse, ApiError, HttpStatus } from '../types/api';

/**
 * Standardized response utilities
 */
export class ResponseUtil {
  /**
   * Send success response
   */
  static success<T>(
    reply: FastifyReply,
    data: T,
    message: string = 'Operation successful',
    statusCode: number = HttpStatus.OK
  ): void {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    reply.status(statusCode).send(response);
  }

  /**
   * Send created response
   */
  static created<T>(
    reply: FastifyReply,
    data: T,
    message: string = 'Resource created successfully'
  ): void {
    this.success(reply, data, message, HttpStatus.CREATED);
  }

  /**
   * Send error response
   */
  static error(
    reply: FastifyReply,
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    details?: string[]
  ): void {
    const response: ApiError = {
      success: false,
      message,
      ...(details && { details }),
    };
    reply.status(statusCode).send(response);
  }

  /**
   * Send bad request error
   */
  static badRequest(
    reply: FastifyReply,
    message: string = 'Bad request',
    details?: string[]
  ): void {
    this.error(reply, message, HttpStatus.BAD_REQUEST, details);
  }

  /**
   * Send unauthorized error
   */
  static unauthorized(
    reply: FastifyReply,
    message: string = 'Unauthorized'
  ): void {
    this.error(reply, message, HttpStatus.UNAUTHORIZED);
  }

  /**
   * Send forbidden error
   */
  static forbidden(reply: FastifyReply, message: string = 'Forbidden'): void {
    this.error(reply, message, HttpStatus.FORBIDDEN);
  }

  /**
   * Send not found error
   */
  static notFound(
    reply: FastifyReply,
    message: string = 'Resource not found'
  ): void {
    this.error(reply, message, HttpStatus.NOT_FOUND);
  }

  /**
   * Send conflict error
   */
  static conflict(
    reply: FastifyReply,
    message: string = 'Resource already exists'
  ): void {
    this.error(reply, message, HttpStatus.CONFLICT);
  }

  /**
   * Send validation error
   */
  static validationError(
    reply: FastifyReply,
    message: string = 'Validation failed',
    details?: string[]
  ): void {
    this.error(reply, message, HttpStatus.UNPROCESSABLE_ENTITY, details);
  }

  /**
   * Send internal server error
   */
  static internalError(
    reply: FastifyReply,
    message: string = 'Internal server error'
  ): void {
    this.error(reply, message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
