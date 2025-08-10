import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { config } from '../config';

/**
 * Security Plugin
 * Configures rate limiting and other security measures
 */
async function securityPlugin(fastify: FastifyInstance) {
  // Register rate limiting (configurable)
  if (config.security.enableRateLimit) {
    await fastify.register(import('@fastify/rate-limit'), {
      global: true,
      max: config.security.rateLimitMax,
      timeWindow: `${config.security.rateLimitWindowMinutes} minutes`,
      errorResponseBuilder: function (_request, context) {
        return {
          success: false,
          message: `Rate limit exceeded, retry in ${Math.round(context.ttl / 1000)} seconds`,
          statusCode: 429,
          retryAfter: Math.round(context.ttl / 1000),
        };
      },
      addHeaders: {
        'x-ratelimit-limit': true,
        'x-ratelimit-remaining': true,
        'x-ratelimit-reset': true,
      },
    });
  }

  // Register compression (configurable)
  if (config.security.enableCompress) {
    await fastify.register(import('@fastify/compress'), {
      global: true,
      encodings: ['gzip', 'deflate'],
    });
  }

  // Enhanced CORS configuration (configurable)
  if (config.security.enableCors) {
    await fastify.register(import('@fastify/cors'), {
    origin: (origin, callback) => {
      const isProduction = config.server.nodeEnv === 'production';
      
      if (isProduction) {
        // In production, specify exact origins
        const allowedOrigins = config.security.allowedOrigins;
        
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'), false);
        }
      } else {
        // In development, allow localhost
        const developmentOrigins = config.security.allowedOrigins;
        
        if (!origin || developmentOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'), false);
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-CSRF-Token',
    ],
    maxAge: 86400, // 24 hours
    });
  }

  // Enhanced Helmet configuration (configurable)
  if (config.security.enableHelmet) {
    await fastify.register(import('@fastify/helmet'), {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Disable for API usage
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    });
  }

  // Request size limits
  fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (_req, body, done) {
    const maxSize = config.security.maxRequestSize; // bytes
    const bodyString = typeof body === 'string' ? body : body.toString();
    
    if (Buffer.byteLength(bodyString) > maxSize) {
      done(new Error('Request payload too large'), undefined);
    } else {
      try {
        const json = JSON.parse(bodyString);
        done(null, json);
      } catch (err) {
        done(err as Error, undefined);
      }
    }
  });

  // Security headers middleware
  fastify.addHook('onSend', async (_request, reply, payload) => {
    // Remove server header
    reply.header('Server', 'Fastify');
    
    // Add custom security headers
    reply.header('X-Content-Type-Options', 'nosniff');
    reply.header('X-Download-Options', 'noopen');
    reply.header('X-Permitted-Cross-Domain-Policies', 'none');
    reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    reply.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    return payload;
  });

  fastify.log.info('Security plugin loaded with rate limiting, compression, and enhanced headers');
}

export default fp(securityPlugin, {
  name: 'security',
});
