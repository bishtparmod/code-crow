const RoleMapping = require('../models/roleMapping.model')
const stripe = require('stripe')(process.env.STRIPE_SK)

const isStaging = (email) => {
  const { NODE_ENV, ALLOWED_EMAILS } = process.env
  if (NODE_ENV == 'staging') {
    email = email.toLowerCase()
    const emails = ALLOWED_EMAILS.split(',')
    const isEmailAllowed = emails.includes(email)
    return isEmailAllowed ? true : false
  } else {
    return true
  }
}

const isLoggedIn = (req, res, next) => req.user && req.user.id ? next() : res.sendStatus(403)

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id
    const roleMapping = await RoleMapping.find({ userId }).populate(['User', 'Role']).exec()
    console.log(roleMapping)
    next()
  } catch (e) {
    res.status(500).json(e)
  }
}

const isPayedUser = async (req, res, next) => {
  try {
    const { email } = req.user
    const customer = await stripe.customers.list({ email })
    const { data } = customer.data[0].subscriptions
    data.length >= 1 ? next() : res.status(403).json({ message: "Authorization error." })
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports = {
  isLoggedIn, isAdmin, isPayedUser, isStaging
}