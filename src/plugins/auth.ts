import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '../utils/jwt';

declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload;
  }
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

async function authPlugin(fastify: FastifyInstance) {
  // Decorate request with user property
  fastify.decorateRequest('user', null);

  // Decorate fastify with authenticate method
  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
          return reply.status(401).send({
            success: false,
            message: 'Authorization header is required',
          });
        }

        const token = extractTokenFromHeader(authHeader);
        const decoded = verifyToken(token);

        request.user = decoded;
      } catch (error) {
        return reply.status(401).send({
          success: false,
          message: 'Unauthorized - Invalid or missing token',
        });
      }
    }
  );

  // JWT verification hook for automatic protection
  fastify.addHook(
    'preValidation',
    async (request: FastifyRequest, reply: FastifyReply) => {
      // Skip authentication for public routes
      if (
        request.url.startsWith('/api/auth') ||
        request.url.startsWith('/docs') ||
        request.url.startsWith('/health')
      ) {
        return;
      }

      // Use the authenticate decorator
      await fastify.authenticate(request, reply);
    }
  );
}

export default fp(authPlugin, {
  name: 'auth',
});
