const LegalDoc = require('../models/legalDoc.model')

const getLegalDocs = async (req, res) => {
  try {
    const legalDocs = await LegalDoc.find({}, { body: 0 }).exec()
    res.status(200).json(legalDocs)
  } catch (e) {
    res.status(500).json(e)
  }
}

const createLegalDoc = async (req, res) => {
  try {
    const { title, createdAt, pdf } = req.body
    const legalDoc = await LegalDoc.create({ title, createdAt, pdf })
    res.status(200).json(legalDoc)
  } catch (e) {
    console.log(">> " + e)
    res.status(500).json(e)
  }
}

module.exports = {
  getLegalDocs,
  createLegalDoc
}