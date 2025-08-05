const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');
const redisConfig = require('../config/redis.config');
const logger = require('../utils/logger.util');
const { AuthError } = require('../errors/authError');

// Create Redis client for rate limiting
const redisClient = redis.createClient({
  host: redisConfig.host,
  port: redisConfig.port,
  password: redisConfig.password,
  db: redisConfig.db
});

redisClient.on('error', (err) => {
  logger.error('Redis rate limit client error', { error: err.message });
});

/**
 * Rate Limiting Middleware
 * Implements various rate limiting strategies for different endpoints
 */
class RateLimitMiddleware {
  constructor() {
    this.store = new RedisStore({
      client: redisClient,
      prefix: 'rl:',
    });
  }

  /**
   * Create custom rate limiter
   */
  createRateLimit(options) {
    const defaultOptions = {
      store: this.store,
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => {
        // Use IP address and user ID if available
        const userId = req.user?.userId || 'anonymous';
        return `${req.ip}:${userId}`;
      },
      handler: (req, res) => {
        logger.warn('Rate limit exceeded', {
          ip: req.ip,
          userId: req.user?.userId,
          endpoint: req.path,
          method: req.method,
          requestId: req.requestId
        });

        res.status(429).json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later'
          },
          timestamp: new Date().toISOString(),
          request_id: req.requestId
        });
      },
      skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === '/health';
      }
    };

    return rateLimit({ ...defaultOptions, ...options });
  }

  /**
   * Global rate limiting
   */
  get globalRateLimit() {
    return this.createRateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 1000, // 1000 requests per hour
      message: 'Too many requests from this IP'
    });
  }

  /**
   * Authentication rate limiting
   */
  get authRateLimit() {
    return this.createRateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10, // 10 attempts per 15 minutes
      keyGenerator: (req) => `auth:${req.ip}`,
      message: 'Too many authentication attempts'
    });
  }

  /**
   * Registration rate limiting
   */
  get registerRateLimit() {
    return this.createRateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 5, // 5 registrations per hour per IP
      keyGenerator: (req) => `register:${req.ip}`,
      message: 'Too many registration attempts'
    });
  }

  /**
   * Login rate limiting
   */
  get loginRateLimit() {
    return this.createRateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10, // 10 login attempts per 15 minutes
      keyGenerator: (req) => `login:${req.ip}:${req.body.phone || 'unknown'}`,
      message: 'Too many login attempts'
    });
  }

  /**
   * OTP rate limiting
   */
  get otpRateLimit() {
    return this.createRateLimit({
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 5, // 5 OTP requests per 5 minutes
      keyGenerator: (req) => `otp:${req.ip}:${req.body.phone || req.body.new_phone || 'unknown'}`,
      message: 'Too many OTP requests'
    });
  }

  /**
   * Password reset rate limiting
   */
  get passwordResetRateLimit() {
    return this.createRateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3, // 3 password reset attempts per hour
      keyGenerator: (req) => `pwd_reset:${req.ip}:${req.body.phone || 'unknown'}`,
      message: 'Too many password reset attempts'
    });
  }

  /**
   * Profile update rate limiting
   */
  get profileUpdateRateLimit() {
    return this.createRateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 10, // 10 profile updates per minute
      keyGenerator: (req) => `profile:${req.user?.userId || req.ip}`,
      message: 'Too many profile update requests'
    });
  }

  /**
   * File upload rate limiting
   */
  get fileUploadRateLimit() {
    return this.createRateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 5, // 5 file uploads per minute
      keyGenerator: (req) => `upload:${req.user?.userId || req.ip}`,
      message: 'Too many file upload requests'
    });
  }

  /**
   * Search rate limiting
   */
  get searchRateLimit() {
    return this.createRateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 30, // 30 search requests per minute
      keyGenerator: (req) => `search:${req.user?.userId || req.ip}`,
      message: 'Too many search requests'
    });
  }

  /**
   * Admin action rate limiting
   */
  get adminRateLimit() {
    return this.createRateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 50, // 50 admin actions per minute
      keyGenerator: (req) => `admin:${req.user?.userId || req.ip}`,
      message: 'Too many admin requests'
    });
  }

  /**
   * Session management rate limiting
   */
  get sessionRateLimit() {
    return this.createRateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 20, // 20 session operations per minute
      keyGenerator: (req) => `session:${req.user?.userId || req.ip}`,
      message: 'Too many session requests'
    });
  }

  /**
   * Settings update rate limiting
   */
  get settingsRateLimit() {
    return this.createRateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 15, // 15 settings updates per minute
      keyGenerator: (req) => `settings:${req.user?.userId || req.ip}`,
      message: 'Too many settings update requests'
    });
  }

  /**
   * Account action rate limiting (deactivate, delete)
   */
  get accountActionRateLimit() {
    return this.createRateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3, // 3 account actions per hour
      keyGenerator: (req) => `account:${req.user?.userId || req.ip}`,
      message: 'Too many account action requests'
    });
  }

  /**
   * Phone-based rate limiting for sensitive operations
   */
  createPhoneRateLimit(windowMs, max, prefix = 'phone') {
    return this.createRateLimit({
      windowMs,
      max,
      keyGenerator: (req) => {
        const phone = req.body.phone || req.body.new_phone || 'unknown';
        return `${prefix}:${phone}`;
      },
      message: 'Too many requests for this phone number'
    });
  }

  /**
   * User-based rate limiting
   */
  createUserRateLimit(windowMs, max, prefix = 'user') {
    return this.createRateLimit({
      windowMs,
      max,
      keyGenerator: (req) => `${prefix}:${req.user?.userId || req.ip}`,
      message: 'Too many requests from this user'
    });
  }

  /**
   * Sliding window rate limiter
   */
  createSlidingWindowRateLimit(options) {
    const requests = new Map();

    return (req, res, next) => {
      const key = options.keyGenerator ? options.keyGenerator(req) : req.ip;
      const now = Date.now();
      const windowStart = now - options.windowMs;

      // Clean old entries
      if (requests.has(key)) {
        const userRequests = requests.get(key);
        const validRequests = userRequests.filter(timestamp => timestamp > windowStart);
        requests.set(key, validRequests);
      }

      // Check current requests
      const currentRequests = requests.get(key) || [];
      
      if (currentRequests.length >= options.max) {
        logger.warn('Sliding window rate limit exceeded', {
          key,
          requests: currentRequests.length,
          max: options.max,
          requestId: req.requestId
        });

        return res.status(429).json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: options.message || 'Too many requests'
          },
          timestamp: new Date().toISOString(),
          request_id: req.requestId
        });
      }

      // Add current request
      currentRequests.push(now);
      requests.set(key, currentRequests);

      next();
    };
  }

  /**
   * Burst rate limiter (allows short bursts)
   */
  createBurstRateLimit(burstMax, sustainedMax, windowMs) {
    const burstRequests = new Map();
    const sustainedRequests = new Map();

    return (req, res, next) => {
      const key = req.user?.userId || req.ip;
      const now = Date.now();
      const windowStart = now - windowMs;

      // Check burst limit (last 10 seconds)
      const burstWindowStart = now - 10000;
      const currentBurstRequests = burstRequests.get(key) || [];
      const validBurstRequests = currentBurstRequests.filter(timestamp => timestamp > burstWindowStart);
      
      if (validBurstRequests.length >= burstMax) {
        return res.status(429).json({
          success: false,
          error: {
            code: 'BURST_RATE_LIMIT_EXCEEDED',
            message: 'Too many requests in short time'
          },
          timestamp: new Date().toISOString(),
          request_id: req.requestId
        });
      }

      // Check sustained limit
      const currentSustainedRequests = sustainedRequests.get(key) || [];
      const validSustainedRequests = currentSustainedRequests.filter(timestamp => timestamp > windowStart);
      
      if (validSustainedRequests.length >= sustainedMax) {
        return res.status(429).json({
          success: false,
          error: {
            code: 'SUSTAINED_RATE_LIMIT_EXCEEDED',
            message: 'Too many requests over time'
          },
          timestamp: new Date().toISOString(),
          request_id: req.requestId
        });
      }

      // Update counters
      validBurstRequests.push(now);
      validSustainedRequests.push(now);
      burstRequests.set(key, validBurstRequests);
      sustainedRequests.set(key, validSustainedRequests);

      next();
    };
  }
}

module.exports = new RateLimitMiddleware();