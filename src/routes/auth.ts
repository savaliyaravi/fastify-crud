import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/authController';
import { createUserSchema, loginUserSchema } from '../utils/validation';
import { registerRouteSchema, loginRouteSchema } from '../schemas/auth';
import { resolve } from '../container/setup';

export async function authRoutes(fastify: FastifyInstance) {
  const authController = resolve<AuthController>(AuthController);
  const register = authController.register.bind(authController);
  const login = authController.login.bind(authController);

  // Register user
  fastify.post(
    '/register',
    {
      schema: registerRouteSchema,
      preValidation: fastify.validateBody(createUserSchema),
    },
    register
  );

  // Login user
  fastify.post(
    '/login',
    {
      schema: loginRouteSchema,
      preValidation: fastify.validateBody(loginUserSchema),
    },
    login
  );
}
