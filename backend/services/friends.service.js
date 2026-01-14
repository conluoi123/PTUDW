import * as friendModel from '../models/friends.models.js'

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

