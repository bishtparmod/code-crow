const User = require('../models/user.model')
const News = require('../models/news.model')
const UserNews = require('../models/userNews.model')

const createNews = async (req, res) => {
  try {
    const { title, body, detail, createdAt, thumbnail, image, totalViews } = req.body
    const news = await News.create({ title, body, detail, createdAt, thumbnail, image, totalViews })
    const users = await User.find({}, { _id: 1 })
    await Promise.all(users.map(user => createUserNews(news.id, user.id)))
    res.status(200).json(news)
  } catch (e) {
    res.status(500).json(e)
  }
}

const getNews = async (req, res) => {
  try {
    const { limit, skip } = req.query
    const news = await News
      .find({}, { body: 0 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .exec()
    res.status(200).json(news)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

const createUserNews = async (newsId, userId) => {
  try {
    const userNews = await UserNews.create({ user: userId, news: newsId })
    return userNews
  } catch (e) {
    return new Error(e)
  }
}

const getUserNewsById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const news = await News.findById(id).exec()
    await News.findByIdAndUpdate(id, { totalViews: news.totalViews + 1 })
    await UserNews.findOneAndUpdate({ news: id, user: userId }, { isSeen: true })
    res.status(200).json(news)
  } catch (e) {
    res.status(500).json(e)
  }
}

const getUserNews = async (req, res) => {
  try {
    const userId = req.user.id
    const { skip, limit } = req.query
    const userNews = await UserNews
      .find({ user: userId })
      .populate('news')
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .exec()
    res.status(200).json(userNews)
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports = {
  createNews,
  getNews,
  getUserNewsById,
  getUserNews
}