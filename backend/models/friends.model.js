import db from '../configs/db.js'

export const findRelationship = async (userId1, userId2) => {
  return await db('friendships')
    .where({ requester_id: userId1, addressee_id: userId2 })
    .orWhere({ requester_id: userId2, addressee_id: userId1 })
    .first()
}