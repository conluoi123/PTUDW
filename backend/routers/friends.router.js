import express from 'express'
import * as friendController from '../controllers/friends.controller.js'
import * as userController from '../controllers/user.controllers.js'
const router = express.Router()

router.post('/request', friendController.sendRequest)
router.post('/accept/:id', friendController.acceptRequest)
router.delete('/remove/:id', friendController.removeFriend)
router.get('/search/:id', friendController.searchFriendStatus)
router.get('/list', friendController.getListFriends)
router.get('/requests', friendController.getPendingRequests)
router.get('/suggestions', friendController.getSuggestions)
router.get('/find', userController.findUserByEmail)

export default router;
