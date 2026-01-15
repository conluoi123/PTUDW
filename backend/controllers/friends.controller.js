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

export const getListFriends = async (req, res) => {
  try {
    const currentUserId = req.query.userId || req.body.currentUserId
    if (!currentUserId) return res.status(400).json({ message: 'Missing userId' })

    const list = await friendService.getListFriends(currentUserId)
    res.status(200).json({ data: list })
  } 
  catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const searchFriendStatus = async (req, res) => {
  try {
    const targetId = req.params.id
    const currentUserId = req.query.userId

    const status = await friendService.checkStatus(currentUserId, targetId)
    res.status(200).json({ data: status })
  } 
  catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getPendingRequests = async (req, res) => {
  try {
    const currentUserId = req.query.userId || req.body.currentUserId
    const list = await friendService.getPendingRequests(currentUserId)
    res.status(200).json({ data: list })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getSuggestions = async (req, res) => {
  try {
    const currentUserId = req.query.userId || req.body.currentUserId
    const list = await friendService.getSuggestions(currentUserId)
    res.status(200).json({ data: list })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const findUserByEmail = async (req, res) => {
  try {
    const { email } = req.query
    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    const user = await userService.findUserByEmail(email)
    res.status(200).json({ data: user })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
