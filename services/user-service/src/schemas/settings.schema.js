const Joi = require('joi');
const { languageSchema, timezoneSchema } = require('./base.schema');

/**
 * Settings Validation Schemas
 * Uses base schemas to avoid duplication
 */

// Privacy settings schema
const privacySettingsSchema = Joi.object({
  profile_visibility: Joi.string()
    .valid('public', 'friends', 'private')
    .default('friends')
    .messages({
      'any.only': 'Profile visibility must be public, friends, or private'
    }),

  search_visibility: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Search visibility must be true or false'
    }),

  show_online_status: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'Show online status must be true or false'
    }),

  allow_friend_requests: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Allow friend requests must be true or false'
    }),

  message_permissions: Joi.string()
    .valid('everyone', 'friends', 'none')
    .default('friends')
    .messages({
      'any.only': 'Message permissions must be everyone, friends, or none'
    }),

  show_phone_number: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'Show phone number must be true or false'
    }),

  show_email: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'Show email must be true or false'
    }),

  allow_tagging: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Allow tagging must be true or false'
    }),

  content_indexing: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Content indexing must be true or false'
    }),

  data_download_allowed: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Data download allowed must be true or false'
    })
});

// Notification settings schema
const notificationSettingsSchema = Joi.object({
  push_notifications: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Push notifications must be true or false'
    }),

  friend_requests: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Friend request notifications must be true or false'
    }),

  messages: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Message notifications must be true or false'
    }),

  likes: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'Like notifications must be true or false'
    }),

  comments: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Comment notifications must be true or false'
    }),

  shares: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'Share notifications must be true or false'
    }),

  mentions: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Mention notifications must be true or false'
    }),

  group_activities: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Group activity notifications must be true or false'
    }),

  event_reminders: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Event reminder notifications must be true or false'
    }),

  security_alerts: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Security alert notifications must be true or false'
    }),

  quiet_hours: Joi.object({
    enabled: Joi.boolean().default(false),
    start_time: Joi.string()
      .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .default('22:00')
      .messages({
        'string.pattern.base': 'Start time must be in HH:MM format'
      }),
    end_time: Joi.string()
      .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .default('08:00')
      .messages({
        'string.pattern.base': 'End time must be in HH:MM format'
      })
  }).default({
    enabled: false,
    start_time: '22:00',
    end_time: '08:00'
  })
});

// Display settings schema - using base language and timezone schemas
const displaySettingsSchema = Joi.object({
  theme: Joi.string()
    .valid('light', 'dark', 'auto')
    .default('light')
    .messages({
      'any.only': 'Theme must be light, dark, or auto'
    }),

  language: languageSchema.default('zh-CN'),

  timezone: timezoneSchema.default('Asia/Shanghai'),

  font_size: Joi.string()
    .valid('small', 'medium', 'large', 'extra-large')
    .default('medium')
    .messages({
      'any.only': 'Font size must be small, medium, large, or extra-large'
    }),

  date_format: Joi.string()
    .valid('YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY', 'DD-MM-YYYY')
    .default('YYYY-MM-DD')
    .messages({
      'any.only': 'Invalid date format'
    }),

  time_format: Joi.string()
    .valid('24h', '12h')
    .default('24h')
    .messages({
      'any.only': 'Time format must be 24h or 12h'
    }),

  posts_per_page: Joi.number()
    .integer()
    .min(10)
    .max(50)
    .default(20)
    .messages({
      'number.min': 'Posts per page must be at least 10',
      'number.max': 'Posts per page must not exceed 50'
    }),
});

// Security settings schema
const securitySettingsSchema = Joi.object({
  login_alerts: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Login alerts must be true or false'
    }),

  session_timeout: Joi.number()
    .integer()
    .min(300)
    .max(86400)
    .default(1800)
    .messages({
      'number.min': 'Session timeout must be at least 5 minutes (300 seconds)',
      'number.max': 'Session timeout must not exceed 24 hours (86400 seconds)'
    }),

  password_change_alerts: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Password change alerts must be true or false'
    }),

  suspicious_activity_alerts: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Suspicious activity alerts must be true or false'
    }),

  device_management_alerts: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Device management alerts must be true or false'
    }),

  data_export_alerts: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Data export alerts must be true or false'
    }),

  account_deletion_protection: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Account deletion protection must be true or false'
    }),
});

// Content settings schema
const contentSettingsSchema = Joi.object({
  content_language: Joi.string()
    .allow('all')
    .default('zh-CN')
    .messages({
      'string.base': 'Content language must be a string'
    }),

  mature_content_filter: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Mature content filter must be true or false'
    }),

  spam_filter: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Spam filter must be true or false'
    }),

  blocked_keywords: Joi.array()
    .items(Joi.string().max(50))
    .max(100)
    .default([])
    .messages({
      'array.max': 'Cannot have more than 100 blocked keywords',
      'string.max': 'Each keyword must not exceed 50 characters'
    }),

  content_recommendations: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Content recommendations must be true or false'
    }),

  trending_content: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Trending content must be true or false'
    }),

  personalized_ads: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'Personalized ads must be true or false'
    })
});

// Complete user settings schema
const userSettingsSchema = Joi.object({
  privacy: privacySettingsSchema.optional(),
  notifications: notificationSettingsSchema.optional(),
  display: displaySettingsSchema.optional(),
  security: securitySettingsSchema.optional(),
  content: contentSettingsSchema.optional()
});

// Settings update schema (partial updates allowed)
const settingsUpdateSchema = Joi.object({
  privacy: privacySettingsSchema.optional(),
  notifications: notificationSettingsSchema.optional(),
  display: displaySettingsSchema.optional(),
  security: securitySettingsSchema.optional(),
  content: contentSettingsSchema.optional()
}).min(1).messages({
  'object.min': 'At least one settings category must be provided'
});

// Individual setting category schemas for granular updates
const privacyUpdateSchema = privacySettingsSchema;
const notificationUpdateSchema = notificationSettingsSchema;
const displayUpdateSchema = displaySettingsSchema;
const securityUpdateSchema = securitySettingsSchema;
const contentUpdateSchema = contentSettingsSchema;

// Settings export schema
const settingsExportSchema = Joi.object({
  format: Joi.string()
    .valid('json', 'csv')
    .default('json')
    .messages({
      'any.only': 'Export format must be json or csv'
    }),

  categories: Joi.array()
    .items(Joi.string().valid('privacy', 'notifications', 'display', 'security', 'content'))
    .min(1)
    .default(['privacy', 'notifications', 'display', 'security', 'content'])
    .messages({
      'array.min': 'At least one category must be selected',
      'any.only': 'Invalid settings category'
    }),

  include_metadata: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'Include metadata must be true or false'
    })
});

// Settings import schema
const settingsImportSchema = Joi.object({
  settings: userSettingsSchema.required(),

  overwrite_existing: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'Overwrite existing must be true or false'
    }),

  validate_only: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'Validate only must be true or false'
    })
});

// Settings backup schema
const settingsBackupSchema = Joi.object({
  backup_name: Joi.string()
    .max(100)
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .messages({
      'string.max': 'Backup name must not exceed 100 characters',
      'string.pattern.base': 'Backup name can only contain letters, numbers, underscores, and hyphens'
    }),

  description: Joi.string()
    .max(500)
    .messages({
      'string.max': 'Description must not exceed 500 characters'
    }),

  categories: Joi.array()
    .items(Joi.string().valid('privacy', 'notifications', 'display', 'security', 'content'))
    .min(1)
    .default(['privacy', 'notifications', 'display', 'security', 'content'])
    .messages({
      'array.min': 'At least one category must be selected'
    })
});

module.exports = {
  // Base schemas (re-exported for convenience)
  languageSchema,
  timezoneSchema,

  // Settings schemas
  privacySettingsSchema,
  notificationSettingsSchema,
  displaySettingsSchema,
  securitySettingsSchema,
  contentSettingsSchema,
  userSettingsSchema,
  settingsUpdateSchema,
  privacyUpdateSchema,
  notificationUpdateSchema,
  displayUpdateSchema,
  securityUpdateSchema,
  contentUpdateSchema,
  settingsExportSchema,
  settingsImportSchema,
  settingsBackupSchema
};