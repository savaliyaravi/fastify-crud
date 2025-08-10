import 'reflect-metadata';
import { injectable } from 'tsyringe';
import { User, IUser } from '../models/User';
import { CreateUserInput, UpdateUserInput } from '../utils/validation';
import { IUserRepository } from './interfaces/IUserRepository';

/**
 * MongoDB implementation of User Repository
 * Handles all user-related database operations
 */
@injectable()
export class UserRepository implements IUserRepository {
  /**
   * Find user by ID
   */
  async findById(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id);
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all users (excluding passwords)
   */
  async findAll(): Promise<IUser[]> {
    try {
      return await User.find({}).select('-password');
    } catch (error) {
      throw new Error(`Failed to find users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create new user
   */
  async create(userData: CreateUserInput): Promise<IUser> {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      if (error instanceof Error && error.message.includes('E11000')) {
        throw new Error('User with this email already exists');
      }
      throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update user by ID
   */
  async update(id: string, updateData: UpdateUserInput): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('E11000')) {
        throw new Error('User with this email already exists');
      }
      throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete user by ID
   */
  async delete(id: string): Promise<IUser | null> {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if user exists by email
   */
  async exists(email: string): Promise<boolean> {
    try {
      const user = await User.findOne({ email }).select('_id');
      return user !== null;
    } catch (error) {
      throw new Error(`Failed to check user existence: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if user exists by ID
   */
  async existsById(id: string): Promise<boolean> {
    try {
      const user = await User.findById(id).select('_id');
      return user !== null;
    } catch (error) {
      throw new Error(`Failed to check user existence by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Find users with pagination
   */
  async findWithPagination(page: number, limit: number): Promise<{
    users: IUser[];
    total: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      
      const [users, total] = await Promise.all([
        User.find({}).select('-password').skip(skip).limit(limit),
        User.countDocuments({}),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        users,
        total,
        totalPages,
      };
    } catch (error) {
      throw new Error(`Failed to find users with pagination: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
