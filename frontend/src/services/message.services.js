const BASE_URL = 'http://localhost:3000/api/messages';

export const MessageService = {
    getConversations: async (userId) => {
        try {
            const response = await fetch(`${BASE_URL}/conversation/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch conversations');
            }

            const data = await response.json();
            console.log("Dữ liệu nhận được:", data);
            return data;
        } catch (err) {
            console.error(err);
            return [];
        }
    },

    getHistory: async (userId, partnerId, limit = 50) => {
        try {
            const response = await fetch(`${BASE_URL}/history?user_id=${userId}&partner_id=${partnerId}&limit=${limit}`);
            if (!response.ok) {
                throw new Error('Failed to fetch history');
            }
            const data = await response.json();
            console.log("Dữ liệu nhận được:", data);
            // vì một mảng tin nhắn nên data.data
            return data.data;
        } catch (err) {
            console.error(err);
            return [];
        }
    },

    sendMessage: async (senderId, receiverId, content) => {
        try {
            const response = await fetch(`${BASE_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sender_id: senderId,
                    receiver_id: receiverId,
                    content
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            const data = await response.json();
            console.log("Dữ liệu nhận được:", data);
            return data;
        } catch (err) {
            console.error(err);
            return null;
        }
    },

    markAsRead: async (userId, partnerId) => {
        try {
            const response = await fetch(`${BASE_URL}/read?user_id=${userId}&partner_id=${partnerId}`, {
                method: 'PUT'
            });
            if (!response.ok) {
                throw new Error('Failed to mark as read');
            }
            return await response.json();
        } catch (err) {
            console.error(err);
            return null;
        }
    }
};
