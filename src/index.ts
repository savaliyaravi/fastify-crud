import 'reflect-metadata';
import Fastify from 'fastify';

import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { config } from './config';
import { databasePlugin, authPlugin, validationPlugin, securityPlugin } from './plugins';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { formatZodError } from './utils/validation';
import { setupContainer } from './container/setup';

const fastify = Fastify({
  logger: config.server.nodeEnv === 'development' ? {
    level: 'info',
    transport: {
      target: 'pino-pretty',
    },
  } : {
    level: 'warn',
  },
});

// Register plugins
async function registerPlugins() {
  // Security plugin (includes rate limiting, compression, CORS, helmet)
  await fastify.register(securityPlugin);

  // Database plugin
  await fastify.register(databasePlugin);

  // Validation plugin - must be registered before routes
  await fastify.register(validationPlugin);

  // Authentication plugin
  await fastify.register(authPlugin);

  // Swagger documentation (OpenAPI 3 with Bearer auth)
  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: config.swagger.title,
        description: config.swagger.description,
        version: config.swagger.version,
      },
      servers: [
        { url: `http://localhost:${config.server.port}` },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
      tags: [
        { name: 'Authentication', description: 'Authentication endpoints' },
        { name: 'Users', description: 'User management endpoints' },
        { name: 'Health', description: 'Health check endpoints' },
      ],
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });
}

// Register routes
async function registerRoutes() {
  // Auth routes (public)
  await fastify.register(authRoutes, { prefix: `${config.api.prefix}/auth` });

  // User routes (protected)
  await fastify.register(userRoutes, { prefix: `${config.api.prefix}/users` });

  // Health check route
  fastify.get('/health', {
    schema: {
      description: 'Health check endpoint',
      tags: ['Health'],
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  }, async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  });
}

// Error handler
fastify.setErrorHandler((error, _request, reply) => {
  fastify.log.error(error);

  if (error.validation) {
    // Handle Zod validation errors
    if (error.validation && Array.isArray(error.validation)) {
      const formattedError = formatZodError(error as any);
      return reply.status(400).send({
        success: false,
        message: formattedError.message,
        ...(formattedError.details && { details: formattedError.details }),
      });
    }
    
    // Handle other validation errors
    return reply.status(400).send({
      success: false,
      message: 'Validation error',
    });
  }

  return reply.status(500).send({
    success: false,
    message: 'Internal server error',
  });
});

// Start server
async function start() {
  try {
    // Setup dependency injection container
    setupContainer();
    
    await registerPlugins();
    await registerRoutes();

    await fastify.listen({ port: config.server.port, host: '0.0.0.0' });
    
    fastify.log.info(`Server is running on http://localhost:${config.server.port}`);
    fastify.log.info(`Swagger documentation available at http://localhost:${config.server.port}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
