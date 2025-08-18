import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Environment variables schema
const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRY: z.string().default('1h'),
  API_PREFIX: z.string().default('/api'),
  SWAGGER_TITLE: z.string().default('Fastify REST API'),
  SWAGGER_DESCRIPTION: z
    .string()
    .default(
      'Fastify REST API with TypeScript, JWT Authentication, and MongoDB'
    ),
  SWAGGER_VERSION: z.string().default('1.0.0'),
  // Security Configuration
  SECURITY_ENABLE_RATE_LIMIT: z.string().default('true'),
  SECURITY_RATE_LIMIT_MAX: z.string().default('100'),
  SECURITY_RATE_LIMIT_WINDOW_MINUTES: z.string().default('15'),
  SECURITY_ENABLE_COMPRESS: z.string().default('false'),
  SECURITY_ENABLE_HELMET: z.string().default('true'),
  SECURITY_ENABLE_CORS: z.string().default('true'),
  SECURITY_ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
  SECURITY_MAX_REQUEST_SIZE: z.string().default('1048576'),
  // HTTPS Configuration (optional)
  SSL_KEY_PATH: z.string().optional(),
  SSL_CERT_PATH: z.string().optional(),
});

// Validate environment variables
const env = envSchema.parse(process.env);

export const config = {
  server: {
    port: parseInt(env.PORT, 10),
    nodeEnv: env.NODE_ENV,
  },
  database: {
    uri: env.MONGO_URI,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiry: env.JWT_EXPIRY,
  },
  api: {
    prefix: env.API_PREFIX,
  },
  swagger: {
    title: env.SWAGGER_TITLE,
    description: env.SWAGGER_DESCRIPTION,
    version: env.SWAGGER_VERSION,
  },
  security: {
    enableRateLimit: env.SECURITY_ENABLE_RATE_LIMIT === 'true',
    rateLimitMax: parseInt(env.SECURITY_RATE_LIMIT_MAX, 10),
    rateLimitWindowMinutes: parseInt(env.SECURITY_RATE_LIMIT_WINDOW_MINUTES, 10),
    enableCompress: env.SECURITY_ENABLE_COMPRESS === 'true',
    enableHelmet: env.SECURITY_ENABLE_HELMET === 'true',
    enableCors: env.SECURITY_ENABLE_CORS === 'true',
    allowedOrigins: env.SECURITY_ALLOWED_ORIGINS.split(',').map((o) => o.trim()),
    maxRequestSize: parseInt(env.SECURITY_MAX_REQUEST_SIZE, 10),
    sslKeyPath: env.SSL_KEY_PATH,
    sslCertPath: env.SSL_CERT_PATH,
  },
} as const;

export type Config = typeof config;
