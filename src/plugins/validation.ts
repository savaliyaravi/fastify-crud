import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z, ZodSchema } from 'zod';
import { formatZodError } from '../utils/validation';

declare module 'fastify' {
  interface FastifyInstance {
    validateId: (
      schema: ZodSchema
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    validateBody: (
      schema: ZodSchema
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    validateQuery: (
      schema: ZodSchema
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

async function validationPlugin(fastify: FastifyInstance) {
  // Decorate fastify with validation methods - these must be attached synchronously
  fastify.decorate(
    'validateId',
    (schema: ZodSchema) =>
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          schema.parse(request.params);
        } catch (error) {
          if (error instanceof z.ZodError) {
            const formattedError = formatZodError(error);
            return reply.status(400).send({
              success: false,
              message: formattedError.message,
              ...(formattedError.details && {
                details: formattedError.details,
              }),
            });
          }
          return reply.status(400).send({
            success: false,
            message: 'Invalid request parameters',
          });
        }
      }
  );

  fastify.decorate(
    'validateBody',
    (schema: ZodSchema) =>
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          schema.parse(request.body);
        } catch (error) {
          if (error instanceof z.ZodError) {
            const formattedError = formatZodError(error);
            return reply.status(400).send({
              success: false,
              message: formattedError.message,
              ...(formattedError.details && {
                details: formattedError.details,
              }),
            });
          }
          return reply.status(400).send({
            success: false,
            message: 'Invalid request body',
          });
        }
      }
  );

  fastify.decorate(
    'validateQuery',
    (schema: ZodSchema) =>
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          schema.parse(request.query);
        } catch (error) {
          if (error instanceof z.ZodError) {
            const formattedError = formatZodError(error);
            return reply.status(400).send({
              success: false,
              message: formattedError.message,
              ...(formattedError.details && {
                details: formattedError.details,
              }),
            });
          }
          return reply.status(400).send({
            success: false,
            message: 'Invalid query parameters',
          });
        }
      }
  );
}

// Export with fastify-plugin to ensure decorators are available across the app
export default fp(validationPlugin, {
  name: 'validation',
});
