import express from 'express'
import * as friendController from '../controllers/friends.controller.js'

const router = express.Router()

router.post('/request', friendController.sendRequest)
router.post('/accept/:id', friendController.acceptRequest)
router.delete('/remove/:id', friendController.removeFriend)
router.get('/search/:id', friendController.searchFriendStatus)
