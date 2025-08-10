/**
 * TSyringe container setup
 */
import 'reflect-metadata';
import { container } from 'tsyringe';
import { UserService } from '../services/userService';
import { AuthController } from '../controllers/authController';
import { UserController } from '../controllers/userController';
import { UserRepository } from '../repositories/UserRepository';

/**
 * Register all services and controllers with the DI container
 */
export function setupContainer(): void {
  // Register repositories
  container.registerSingleton(UserRepository);
  
  // Register services
  container.registerSingleton(UserService);
  
  // Register controllers
  container.registerSingleton(AuthController);
  container.registerSingleton(UserController);
}

/**
 * Get container instance
 */
export function getContainer() {
  return container;
}

/**
 * Resolve a service from the container
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolve<T>(token: any): T {
  return container.resolve<T>(token);
}
