import api from "./service";

export const friendService = {
    findUserById: async (storedId) => {
        const res = await api.get(`/api/friends/find?id=${storedId}`);
        return res.data;
    },

    getFriendsList: async (userId, page = 1) => {
        const res = await api.post(`/api/friends/list`, { currentUserId: userId, page });
        return res.data;
    },

    getFriendRequests: async (userId) => {
        const res = await api.get(`/api/friends/requests?userId=${userId}`);
        return res.data;
    },

    getSuggestions: async (userId, page = 1, search = '') => {
        const res = await api.post(`/api/friends/suggestions`, { currentUserId: userId, page, search });
        return res.data;
    },

    acceptRequest: async (requesterId, currentUserId) => {
        const res = await api.post(`/api/friends/accept/${requesterId}`, { currentUserId });
        return res.data;
    },

    removeOrReject: async (targetId, currentUserId) => {
        const res = await api.delete(`/api/friends/remove/${targetId}`, {
            data: { currentUserId } // axios delete body
        });
        return res.data;
    },

    sendRequest: async (currentUserId, targetUserId) => {
        const res = await api.post(`/api/friends/request`, {
            currentUserId,
            targetUserId
        });
        return res.data;
    }
};