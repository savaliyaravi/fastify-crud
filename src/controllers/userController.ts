import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/userService';
import { UpdateUserInput, UserIdParam } from '../utils/validation';
import { ResponseUtil } from '../utils/response';
import { UserResponse } from '../types/api';

@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  async getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as any;
      const page = query.page ? parseInt(query.page) : undefined;
      const limit = query.limit ? parseInt(query.limit) : undefined;

      // If pagination parameters are provided, use pagination
      if (page && limit) {
        const result = await this.userService.getUsersWithPagination(page, limit);
        const formattedUsers: UserResponse[] = result.users.map((user) => ({
          id: user._id?.toString() || '',
          name: user.name,
          email: user.email,
          createdAt: user.createdAt?.toISOString() || '',
          updatedAt: user.updatedAt?.toISOString(),
        }));

        ResponseUtil.success(
          reply,
          {
            users: formattedUsers,
            pagination: {
              page,
              limit,
              total: result.total,
              totalPages: result.totalPages,
            },
          },
          'Users retrieved successfully'
        );
      } else {
        // Default behavior: get all users
        const users = await this.userService.getAllUsers();
        const formattedUsers: UserResponse[] = users.map((user) => ({
          id: user._id?.toString() || '',
          name: user.name,
          email: user.email,
          createdAt: user.createdAt?.toISOString() || '',
          updatedAt: user.updatedAt?.toISOString(),
        }));

        ResponseUtil.success(
          reply,
          formattedUsers,
          'Users retrieved successfully'
        );
      }
    } catch (error) {
      ResponseUtil.internalError(reply);
    }
  }

  async getUserById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as UserIdParam;
      const user = await this.userService.findUserById(id);

      if (!user) {
        return ResponseUtil.notFound(reply, 'User not found');
      }

      const formattedUser: UserResponse = {
        id: user._id?.toString() || '',
        name: user.name,
        email: user.email,
        createdAt: user.createdAt?.toISOString() || '',
        updatedAt: user.updatedAt?.toISOString(),
      };

      ResponseUtil.success(reply, formattedUser, 'User retrieved successfully');
    } catch (error) {
      ResponseUtil.internalError(reply);
    }
  }

  async updateUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as UserIdParam;
      const updateData = request.body as UpdateUserInput;

      const user = await this.userService.updateUser(id, updateData);
      if (!user) {
        return ResponseUtil.notFound(reply, 'User not found');
      }

      const formattedUser: UserResponse = {
        id: user._id?.toString() || '',
        name: user.name,
        email: user.email,
        createdAt: user.createdAt?.toISOString() || '',
        updatedAt: user.updatedAt?.toISOString(),
      };

      ResponseUtil.success(reply, formattedUser, 'User updated successfully');
    } catch (error) {
      if (error instanceof Error) {
        ResponseUtil.badRequest(reply, error.message);
      } else {
        ResponseUtil.internalError(reply);
      }
    }
  }

  async deleteUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as UserIdParam;
      const user = await this.userService.deleteUser(id);

      if (!user) {
        return ResponseUtil.notFound(reply, 'User not found');
      }

      ResponseUtil.success(
        reply,
        { id: user._id?.toString() || '' },
        'User deleted successfully'
      );
    } catch (error) {
      ResponseUtil.internalError(reply);
    }
  }
}
