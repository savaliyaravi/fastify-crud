import { IUser } from '../../models/User';
import { CreateUserInput, UpdateUserInput } from '../../utils/validation';

/**
 * User Repository Interface
 * Defines the contract for user data operations
 */
export interface IUserRepository {
  // Find operations
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findAll(): Promise<IUser[]>;
  
  // Mutation operations
  create(userData: CreateUserInput): Promise<IUser>;
  update(id: string, updateData: UpdateUserInput): Promise<IUser | null>;
  delete(id: string): Promise<IUser | null>;
  
  // Validation operations
  exists(email: string): Promise<boolean>;
  existsById(id: string): Promise<boolean>;
  
  // Query operations with filters
  findWithPagination(page: number, limit: number): Promise<{
    users: IUser[];
    total: number;
    totalPages: number;
  }>;
}
