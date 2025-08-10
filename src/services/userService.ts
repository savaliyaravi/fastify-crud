import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { IUser } from '../models/User';
import { CreateUserInput, UpdateUserInput } from '../utils/validation';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { UserRepository } from '../repositories/UserRepository';

/**
 * User Service - Business Logic Layer
 * Uses repository pattern for data access
 */
@injectable()
export class UserService {
  constructor(
    @inject(UserRepository) private userRepository: IUserRepository
  ) {}

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserInput): Promise<IUser> {
    // Business logic: Check if user already exists
    const existingUser = await this.userRepository.exists(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    return await this.userRepository.create(userData);
  }

  /**
   * Find user by ID
   */
  async findUserById(id: string): Promise<IUser | null> {
    return await this.userRepository.findById(id);
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<IUser | null> {
    return await this.userRepository.findByEmail(email);
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<IUser[]> {
    return await this.userRepository.findAll();
  }

  /**
   * Get users with pagination
   */
  async getUsersWithPagination(page: number = 1, limit: number = 10) {
    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 10; // Prevent excessive loads

    return await this.userRepository.findWithPagination(page, limit);
  }

  /**
   * Update user
   */
  async updateUser(
    id: string,
    updateData: UpdateUserInput
  ): Promise<IUser | null> {
    // Business logic: Check if email is being updated and if it's already taken
    if (updateData.email) {
      const existingUser = await this.userRepository.findByEmail(updateData.email);
      if (existingUser && existingUser._id?.toString() !== id) {
        throw new Error('User with this email already exists');
      }
    }

    return await this.userRepository.update(id, updateData);
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<IUser | null> {
    return await this.userRepository.delete(id);
  }

  /**
   * Validate user credentials for login
   */
  async validateUserCredentials(
    email: string,
    password: string
  ): Promise<IUser | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  /**
   * Check if user exists by email
   */
  async userExists(email: string): Promise<boolean> {
    return await this.userRepository.exists(email);
  }

  /**
   * Check if user exists by ID
   */
  async userExistsById(id: string): Promise<boolean> {
    return await this.userRepository.existsById(id);
  }
}
