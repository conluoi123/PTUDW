import db from '../configs/db.js'

export const findRelationship = async (userId1, userId2) => {
  return await db('friendships')
    .where({ requester_id: userId1, addressee_id: userId2 })
    .orWhere({ requester_id: userId2, addressee_id: userId1 })
    .first()
}

export const createFriendship = async (requesterId, addresseeId) => {
  return await db('friendships')
    .insert({
      requester_id: requesterId,
      addressee_id: addresseeId,
      status: 'pending'
    })
    .returning('*')
}

export const updateStatus = async (requesterId, addresseeId, status) => {
  return await db('friendships')
    .where({ requester_id: requesterId, addressee_id: addresseeId })
    .update({ status: status })
    .returning('*')
}

