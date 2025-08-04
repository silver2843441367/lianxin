const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserSettings = sequelize.define('UserSettings', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    privacy_settings: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        profile_visibility: 'friends',
        search_visibility: true,
        show_online_status: false,
        allow_friend_requests: true,
        message_permissions: 'friends'
      }
    },
    notification_settings: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        push_notifications: true,
        sms_notifications: false,
        friend_requests: true,
        messages: true,
        likes: false,
        comments: true,
        shares: false
      }
    },
    display_settings: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        theme: 'light',
        language: 'zh-CN',
        timezone: 'Asia/Shanghai',
        font_size: 'medium'
      }
    },
    security_settings: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        login_alerts: true,
        session_timeout: 1800
      }
    },
    content_settings: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        auto_play_videos: false,
        show_sensitive_content: false,
        content_language: 'zh-CN'
      }
    }
  }, {
    tableName: 'user_settings',
    timestamps: true,
    createdAt: false,
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['user_id']
      }
    ]
  });

  // Instance methods
  UserSettings.prototype.updatePrivacySettings = async function(newSettings) {
    this.privacy_settings = { ...this.privacy_settings, ...newSettings };
    return await this.save();
  };

  UserSettings.prototype.updateNotificationSettings = async function(newSettings) {
    this.notification_settings = { ...this.notification_settings, ...newSettings };
    return await this.save();
  };

  UserSettings.prototype.updateDisplaySettings = async function(newSettings) {
    this.display_settings = { ...this.display_settings, ...newSettings };
    return await this.save();
  };

  UserSettings.prototype.updateSecuritySettings = async function(newSettings) {
    this.security_settings = { ...this.security_settings, ...newSettings };
    return await this.save();
  };

  UserSettings.prototype.updateContentSettings = async function(newSettings) {
    this.content_settings = { ...this.content_settings, ...newSettings };
    return await this.save();
  };

  UserSettings.prototype.getAllSettings = function() {
    return {
      privacy: this.privacy_settings,
      notifications: this.notification_settings,
      display: this.display_settings,
      security: this.security_settings,
      content: this.content_settings
    };
  };

  // Class methods
  UserSettings.findByUserId = async function(userId) {
    return await this.findOne({ where: { user_id: userId } });
  };

  UserSettings.createDefault = async function(userId) {
    return await this.create({ user_id: userId });
  };

  return UserSettings;
};