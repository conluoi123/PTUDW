const API_BASE = 'http://localhost:3000/api'

const headers = {
    'Content-Type': 'application/json'
}

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || 'API Error')
    }
    return response.json()
}

export const friendService = {
    findUserById: async (storedId) => {
        const res = await fetch(`${API_BASE}/friends/find?id=${storedId}`)
        return handleResponse(res)
    },

    getFriendsList: async (userId) => {
        const res = await fetch(`${API_BASE}/friends/list?userId=${userId}`)
        return handleResponse(res)
    },

    getFriendRequests: async (userId) => {
        const res = await fetch(`${API_BASE}/friends/requests?userId=${userId}`)
        return handleResponse(res)
    },

    getSuggestions: async (userId) => {
        const res = await fetch(`${API_BASE}/friends/suggestions?userId=${userId}`)
        return handleResponse(res)
    },

    acceptRequest: async (requesterId, currentUserId) => {
        const res = await fetch(`${API_BASE}/friends/accept/${requesterId}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ currentUserId })
        })
        return handleResponse(res)
    },

    removeOrReject: async (targetId, currentUserId) => {
        const res = await fetch(`${API_BASE}/friends/remove/${targetId}`, {
            method: 'DELETE',
            headers,
            body: JSON.stringify({ currentUserId })
        })
        return handleResponse(res)
    },

    sendRequest: async (currentUserId, targetUserId) => {
        const res = await fetch(`${API_BASE}/friends/request`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                currentUserId,
                targetUserId
            })
        })
        return handleResponse(res)
    }
}