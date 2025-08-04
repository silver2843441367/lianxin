const jwt = require('jsonwebtoken');
const logger = require('../logging/logger');

/**
 * JWT Strategy for Authentication
 * Handles JWT token validation and user authentication
 */
class JWTStrategy {
  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
    this.refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
    this.algorithm = process.env.JWT_ALGORITHM || 'HS256';
    this.issuer = process.env.JWT_ISSUER || 'lianxin-platform';
    this.audience = process.env.JWT_AUDIENCE || 'lianxin-app';
  }

  /**
   * Verify access token
   */
  async verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        algorithm: this.algorithm,
        issuer: this.issuer,
        audience: this.audience
      });

      logger.debug('Access token verified', {
        userId: decoded.userId,
        sessionId: decoded.sessionId
      });

      return decoded;
    } catch (error) {
      logger.warn('Access token verification failed', {
        error: error.message,
        name: error.name
      });
      throw error;
    }
  }

  /**
   * Verify refresh token
   */
  async verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        algorithm: this.algorithm,
        issuer: this.issuer,
        audience: this.audience
      });

      logger.debug('Refresh token verified', {
        userId: decoded.userId,
        sessionId: decoded.sessionId
      });

      return decoded;
    } catch (error) {
      logger.warn('Refresh token verification failed', {
        error: error.message,
        name: error.name
      });
      throw error;
    }
  }

  /**
   * Extract token from Authorization header
   */
  extractToken(authHeader) {
    if (!authHeader) {
      throw new Error('Authorization header is missing');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new Error('Invalid authorization header format');
    }

    return token;
  }

  /**
   * Validate token format
   */
  validateTokenFormat(token) {
    const tokenRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    return tokenRegex.test(token);
  }
}

module.exports = new JWTStrategy();