const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

module.exports = {
  // Server configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Service information
  serviceName: 'user-service',
  serviceVersion: process.env.npm_package_version || '1.0.0',
  
  // API configuration
  apiPrefix: '/api/v1',
  allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'],
  
  // Security settings
  corsEnabled: process.env.CORS_ENABLED === 'true',
  helmetEnabled: process.env.HELMET_ENABLED !== 'false',
  
  // Rate limiting
  rateLimitEnabled: process.env.RATE_LIMIT_ENABLED !== 'false',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 3600000, // 1 hour
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
  
  // File upload settings
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  
  // Pagination defaults
  defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE) || 20,
  maxPageSize: parseInt(process.env.MAX_PAGE_SIZE) || 100,
  
  // Session settings
  maxActiveSessionsPerUser: parseInt(process.env.MAX_ACTIVE_SESSIONS_PER_USER) || 5,
  sessionCleanupInterval: parseInt(process.env.SESSION_CLEANUP_INTERVAL) || 3600000, // 1 hour
  
  // OTP settings
  otpExpiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES) || 5,
  otpLength: parseInt(process.env.OTP_LENGTH) || 6,
  otpMaxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS) || 3,
  
  // Account settings
  accountLockoutMinutes: parseInt(process.env.ACCOUNT_LOCKOUT_MINUTES) || 30,
  maxFailedLoginAttempts: parseInt(process.env.MAX_FAILED_LOGIN_ATTEMPTS) || 5,
  accountDeletionGracePeriodDays: parseInt(process.env.ACCOUNT_DELETION_GRACE_PERIOD_DAYS) || 15,
  
  // China compliance settings
  enableRealNameVerification: process.env.ENABLE_REAL_NAME_VERIFICATION === 'true',
  enableContentModeration: process.env.ENABLE_CONTENT_MODERATION !== 'false',
  dataResidencyRegion: process.env.DATA_RESIDENCY_REGION || 'cn-hangzhou',
  
  // Logging configuration
  logLevel: process.env.LOG_LEVEL || 'info',
  logFormat: process.env.LOG_FORMAT || 'json',
  enableAuditLogging: process.env.ENABLE_AUDIT_LOGGING !== 'false',
  
  // Health check settings
  healthCheckEnabled: process.env.HEALTH_CHECK_ENABLED !== 'false',
  healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000, // 30 seconds
  
  // Feature flags
  features: {
    biometricAuth: process.env.FEATURE_BIOMETRIC_AUTH === 'true',
    socialLogin: process.env.FEATURE_SOCIAL_LOGIN === 'true',
    advancedAnalytics: process.env.FEATURE_ADVANCED_ANALYTICS === 'true',
    profileVerification: process.env.FEATURE_PROFILE_VERIFICATION === 'true'
  },
  
  // External service endpoints
  mediaServiceUrl: process.env.MEDIA_SERVICE_URL || 'http://localhost:3007',
  notificationServiceUrl: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006',
  
  // Timezone and localization
  defaultTimezone: process.env.DEFAULT_TIMEZONE || 'Asia/Shanghai',
  supportedLanguages: process.env.SUPPORTED_LANGUAGES ? process.env.SUPPORTED_LANGUAGES.split(',') : ['zh-CN', 'en-US'],
  
  // Performance settings
  compressionEnabled: process.env.COMPRESSION_ENABLED !== 'false',
  compressionThreshold: parseInt(process.env.COMPRESSION_THRESHOLD) || 1024,
  
  // Development settings
  enableSwagger: process.env.ENABLE_SWAGGER === 'true',
  enableDebugMode: process.env.ENABLE_DEBUG_MODE === 'true',
  
  // Monitoring settings
  enableMetrics: process.env.ENABLE_METRICS !== 'false',
  metricsPort: parseInt(process.env.METRICS_PORT) || 9090,
  
  // Database settings
  enableDatabaseLogging: process.env.ENABLE_DATABASE_LOGGING === 'true',
  databaseConnectionPoolSize: parseInt(process.env.DATABASE_CONNECTION_POOL_SIZE) || 10,
  
  // Cache settings
  enableCaching: process.env.ENABLE_CACHING !== 'false',
  cacheDefaultTtl: parseInt(process.env.CACHE_DEFAULT_TTL) || 3600, // 1 hour
  
  // Security headers
  securityHeaders: {
    enableHsts: process.env.ENABLE_HSTS !== 'false',
    enableXssProtection: process.env.ENABLE_XSS_PROTECTION !== 'false',
    enableNoSniff: process.env.ENABLE_NO_SNIFF !== 'false',
    enableFrameGuard: process.env.ENABLE_FRAME_GUARD !== 'false'
  }
};