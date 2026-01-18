import * as friendModel from '../models/friends.model.js'

export const sendRequest = async (currentUserId, targetUserId) => {
  if (currentUserId === targetUserId) {
    throw new Error('Cannot add yourself as a friend')
  }

  const existing = await friendModel.findRelationship(currentUserId, targetUserId)
  if (existing) {
    throw new Error('Friend request or friendship already exists')
  }

  return await friendModel.createFriendship(currentUserId, targetUserId)
}

export const acceptRequest = async (requesterId, currentUserId) => {
  const relation = await friendModel.findRelationship(requesterId, currentUserId)

  if (!relation || relation.status !== 'pending') {
    throw new Error('No pending request found')
  }

  return await friendModel.updateStatus(requesterId, currentUserId, 'accepted')
}

export const removeFriend = async (currentUserId, targetId) => {
  return await friendModel.deleteFriendship(currentUserId, targetId)
}

export const getListFriends = async (userId) => {
  return await friendModel.getFriendsList(userId)
}

export const checkStatus = async (currentUserId, targetId) => {
  const relation = await friendModel.findRelationship(currentUserId, targetId)
  return relation || { status: 'none' }
}

export const getPendingRequests = async (userId) => {
  return await friendModel.getPendingRequests(userId)
}

export const getSuggestions = async (userId) => {
  return await friendModel.getSuggestions(userId)
}

export const findUserById = async (id) => {
  const user = await friendModel.getUserById(id)
  if (!user) {
    throw new Error('User not found')
  }
  return user
}
