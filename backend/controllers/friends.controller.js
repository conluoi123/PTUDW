import * as friendService from '../services/friends.service.js'

export const sendRequest = async (req, res) => {
  try {
    const { currentUserId, targetUserId } = req.body
    const result = await friendService.sendRequest(currentUserId, targetUserId)

    res.status(201).json({ message: 'Friend request sent', data: result })
  } 
  catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const acceptRequest = async (req, res) => {
  try {
    const requesterId = req.params.id
    const { currentUserId } = req.body
    const result = await friendService.acceptRequest(requesterId, currentUserId)

    res.status(200).json({ message: 'Friend request accepted', data: result })
  } 
  catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const removeFriend = async (req, res) => {
  try {
    const targetId = req.params.id
    const { currentUserId } = req.body
    
    await friendService.removeFriend(currentUserId, targetId)
    res.status(200).json({ message: 'Friend removed' })
  } 
  catch (error) {
    res.status(500).json({ error: error.message })
  }
}

