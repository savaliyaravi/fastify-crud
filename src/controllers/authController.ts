import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/userService';
import { signToken } from '../utils/jwt';
import { CreateUserInput, LoginUserInput } from '../utils/validation';
import { ResponseUtil } from '../utils/response';
import { AuthResponse } from '../types/api';
import { IUser } from '../models/User';

@injectable()
export class AuthController {
  constructor(@inject(UserService) private userService: UserService) {}

  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userData = request.body as CreateUserInput;
      const user = await this.userService.createUser(userData);

      const token = signToken({
        userId: (user as IUser)._id?.toString() || '',
        email: user.email,
      });

      const responseData: AuthResponse = {
        user: {
          id: (user as IUser)._id?.toString() || '',
          name: user.name,
          email: user.email,
          createdAt: user.createdAt?.toISOString() || '',
        },
        token,
      };

      ResponseUtil.created(reply, responseData, 'User registered successfully');
    } catch (error) {
      if (error instanceof Error) {
        ResponseUtil.badRequest(reply, error.message);
      } else {
        ResponseUtil.internalError(reply);
      }
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password } = request.body as LoginUserInput;

      const user = await this.userService.validateUserCredentials(
        email,
        password
      );
      if (!user) {
        return ResponseUtil.unauthorized(reply, 'Invalid email or password');
      }

      const token = signToken({
        userId: (user as IUser)._id?.toString() || '',
        email: user.email,
      });

      const responseData: AuthResponse = {
        user: {
          id: (user as IUser)._id?.toString() || '',
          name: user.name,
          email: user.email,
          createdAt: user.createdAt?.toISOString() || '',
        },
        token,
      };

      ResponseUtil.success(reply, responseData, 'Login successful');
    } catch (error) {
      ResponseUtil.internalError(reply);
    }
  }
}
