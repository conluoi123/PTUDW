import api from '@/services/service';

const BASE_URL = '/api/messages';

export const MessageService = {
    getConversations: async (userId) => {
        try {
            const response = await api.get(`${BASE_URL}/conversation/${userId}`);
            console.log("Dữ liệu nhận được:", response.data);
            return response.data;
        } catch (err) {
            console.error(err);
            return [];
        }
    },

    getHistory: async (userId, partnerId, limit = 50) => {
        try {
            const response = await api.get(`${BASE_URL}/history`, {
                params: { user_id: userId, partner_id: partnerId, limit }
            });
            console.log("Dữ liệu nhận được:", response.data);
            return response.data.data;
        } catch (err) {
            console.error(err);
            return [];
        }
    },

    sendMessage: async (senderId, receiverId, content) => {
        try {
            const response = await api.post(`${BASE_URL}`, {
                sender_id: senderId,
                receiver_id: receiverId,
                content
            });
            console.log("Dữ liệu nhận được:", response.data);
            return response.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    },

    markAsRead: async (userId, partnerId) => {
        try {
            const response = await api.put(`${BASE_URL}/read`, null, {
                params: { user_id: userId, partner_id: partnerId }
            });
            return response.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    }
};
