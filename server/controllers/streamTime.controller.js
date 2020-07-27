const StreamTime = require('../models/streamingTime.model')

const getUserStreamTime = async(req, res) => {
    const { id } = req.user
    try {
        const streamTime = await StreamTime.find({ userId: id }).exec()
        const statistics = {
            totalTimePurchased: streamTime.map(time => time.purchasedMinutes).reduce((acc, cur) => acc + cur),
            totalTimeUsed: streamTime.map(time => time.usedMinutes).reduce((acc, cur) => acc + cur)
        }
        res.status(200).json({ streamTime, statistics })
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
}

const createStreamTime = async(req, res) => {
    const { purchasedMinutes, productId, chargeId, userId } = req.body

    try {
        const streamTime = await StreamTime.create({ userId: userId, purchasedMinutes, productId, chargeId, remainingMinutes: purchasedMinutes })
        res.status(200).json(streamTime)
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
}

module.exports = {
    getUserStreamTime,
    createStreamTime
}