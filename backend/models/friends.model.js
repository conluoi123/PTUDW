import db from '../models/db.js'

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

export const deleteFriendship = async (userId1, userId2) => {
  return await db('friendships')
    .where((builder) => {
      builder
        .where({ requester_id: userId1, addressee_id: userId2 })
        .orWhere({ requester_id: userId2, addressee_id: userId1 })
    })
    .del()
}

export const getFriendsList = async (userId, page = 1, limit = 3) => {
  const offset = (page - 1) * limit;
  return await db('friendships')
    .join('users', function () {
      this.on('users.id', '=', 'friendships.requester_id').orOn(
        'users.id',
        '=',
        'friendships.addressee_id'
      )
    })
    .where(function () {
      this.where('friendships.requester_id', userId).orWhere(
        'friendships.addressee_id',
        userId
      )
    })
    .andWhere('friendships.status', 'accepted')
    .andWhere('users.id', '!=', userId)
    .select('users.id', 'users.username', 'users.name', 'users.email', 'users.avatar')
    .limit(limit)
    .offset(offset)
}

export const getPendingRequests = async (userId) => {
  return await db('friendships')
    .join('users', 'users.id', '=', 'friendships.requester_id')
    .where('friendships.addressee_id', userId)
    .andWhere('friendships.status', 'pending')
    .select('users.id', 'users.username', 'users.name', 'users.email', 'friendships.create_at as requestedAt')
}

export const getSuggestions = async (userId, page = 1, limit = 3) => {
  const offset = (page - 1) * limit;

  // Use whereNotExists to filter out existing relationships (both pending and accepted)
  // Check both directions: requester_id=userId OR addressee_id=userId
  return await db('users')
    .whereNot('id', userId)
    .whereNotExists(function() {
      this.select('*')
        .from('friendships')
        .where(function() {
          this.whereRaw('friendships.requester_id = users.id AND friendships.addressee_id = ?', [userId])
              .orWhereRaw('friendships.requester_id = ? AND friendships.addressee_id = users.id', [userId])
        })
    })
    .select('id', 'username', 'name', 'avatar')
    .limit(limit)
    .offset(offset);
}

export const getUserById = async (id) => {
  return await db('users').where('id', id).first();
}

export const getSuggestionsCount = async (userId) => {
    const result = await db('users')
      .whereNot('id', userId)
      .whereNotExists(function() {
        this.select('*')
          .from('friendships')
          .where(function() {
            this.whereRaw('friendships.requester_id = users.id AND friendships.addressee_id = ?', [userId])
                .orWhereRaw('friendships.requester_id = ? AND friendships.addressee_id = users.id', [userId])
          })
      })
      .count('id as total')
      .first();
    return result.total;
  }
