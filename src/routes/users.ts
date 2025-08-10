import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/userController';
import { updateUserSchema, userIdParamSchema } from '../utils/validation';
import {
  getUsersRouteSchema,
  getUserByIdRouteSchema,
  updateUserRouteSchema,
  deleteUserRouteSchema,
} from '../schemas/users';
import { resolve } from '../container/setup';

export async function userRoutes(fastify: FastifyInstance) {
  const userController = resolve<UserController>(UserController);
  const getAllUsers = userController.getAllUsers.bind(userController);
  const getUserById = userController.getUserById.bind(userController);
  const updateUser = userController.updateUser.bind(userController);
  const deleteUser = userController.deleteUser.bind(userController);

  // Authentication is already enforced globally in the auth plugin

  // Get all users
  fastify.get(
    '/',
    {
      schema: getUsersRouteSchema,
    },
    getAllUsers
  );

  // Get user by ID
  fastify.get(
    '/:id',
    {
      schema: getUserByIdRouteSchema,
      preValidation: fastify.validateId(userIdParamSchema),
    },
    getUserById
  );

  // Update user
  fastify.put(
    '/:id',
    {
      schema: updateUserRouteSchema,
      preValidation: [
        fastify.validateId(userIdParamSchema),
        fastify.validateBody(updateUserSchema),
      ],
    },
    updateUser
  );

  // Delete user
  fastify.delete(
    '/:id',
    {
      schema: deleteUserRouteSchema,
      preValidation: fastify.validateId(userIdParamSchema),
    },
    deleteUser
  );
}
