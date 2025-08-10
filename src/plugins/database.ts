import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import mongoose from 'mongoose';
import { config } from '../config';

async function databasePlugin(fastify: FastifyInstance) {
  try {
    await mongoose.connect(config.database.uri);
    fastify.log.info('Connected to MongoDB');

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      fastify.log.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      fastify.log.warn('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      fastify.log.info('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    fastify.log.error(
      `Failed to connect to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    process.exit(1);
  }
}

export default fp(databasePlugin, {
  name: 'database',
});
