const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/user.controller')

module.exports = router

router.get('/search', userCtrl.searchUsers)
router.post('/usersByIds', userCtrl.getUsersByIds)
router.get('/allUsers', userCtrl.getAllUsers)
router.get('/:id', userCtrl.getUserById)
router.patch('/:id/ban', userCtrl.setUserBanById)
router.post('/get-user-by-email', userCtrl.getUserByEmail)
router.get('/:id/videos', userCtrl.getUserVideos)