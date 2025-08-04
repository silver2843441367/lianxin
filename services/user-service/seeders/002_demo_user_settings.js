'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Fetch user IDs by phone number
        const [users] = await queryInterface.sequelize.query(
            `SELECT id, phone FROM users WHERE phone IN ('+8613800000001', '+8613800000002', '+8613800000003');`
        );

        const now = new Date();

        const defaultSettings = {
            privacy_settings: {
                profile_visibility: 'friends',
                search_visibility: true,
                show_online_status: false,
                allow_friend_requests: true,
                message_permissions: 'friends'
            },
            notification_settings: {
                push_notifications: true,
                sms_notifications: false,
                friend_requests: true,
                messages: true,
                likes: false,
                comments: true,
                shares: false
            },
            display_settings: {
                theme: 'light',
                language: 'zh-CN',
                timezone: 'Asia/Shanghai',
                font_size: 'medium'
            },
            security_settings: {
                login_alerts: true,
                session_timeout: 1800
            },
            content_settings: {
                auto_play_videos: false,
                show_sensitive_content: false,
                content_language: 'zh-CN'
            }
        };

        const settingsData = users.map(user => ({
            user_id: user.id,
            privacy_settings: JSON.stringify(defaultSettings.privacy_settings),
            notification_settings: JSON.stringify(defaultSettings.notification_settings),
            display_settings: JSON.stringify(defaultSettings.display_settings),
            security_settings: JSON.stringify(defaultSettings.security_settings),
            content_settings: JSON.stringify(defaultSettings.content_settings),
            updated_at: now
        }));

        await queryInterface.bulkInsert('user_settings', settingsData, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('user_settings', null, {});
    }
};
