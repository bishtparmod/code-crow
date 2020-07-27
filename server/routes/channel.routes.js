const express = require('express');
const channelCtrl = require('../controllers/channel.controller');

const router = express.Router();

module.exports = router;

router.post('/', channelCtrl.createChannel)

router.get('/', channelCtrl.getChannels)

router.get('/me/active', channelCtrl.getMyChannels)

router.get('/:id/liveStreams', channelCtrl.getChannelLiveStreams)

router.get('/:id/liveStream/recent', channelCtrl.getChannelRecentLiveStream)

router.get('/:id', channelCtrl.getChannel)

router.get('/:id/blocks', channelCtrl.getBlockList)

router.post('/blocks', channelCtrl.blockUser)

router.delete('/blocks/:id', channelCtrl.unblockUser)

router.get('/blocks/:user/:channel', channelCtrl.isUserBlocked)

router.patch('/joinOrLeave', channelCtrl.joinOrLeave)
