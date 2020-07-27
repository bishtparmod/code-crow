const Pages = require('../models/pages.model')
const Sections = require('../models/sections.model')

const addPage = (req, res) => {
  const { title } = req.body

  Pages
    .create({ title })
    .then(page => res.status(200).json(page))
    .catch(err => res.status(500).json(err))
}

const getPage = (req, res) => {
  const { pageId } = req.params

  Pages
    .findById(pageId)
    .exec()
    .then(page => res.status(200).json(page))
    .catch(err => res.status(500).json(err))
}

const getPages = (req, res) => {
  const query = Object.keys(req.query).length ? { [Object.keys(req.query)[0]]: new RegExp("^" + Object.values(req.query)[0], "i") } : {}
  Pages
    .find(query)
    .exec()
    .then(pages => res.status(200).json(pages))
    .catch(err => res.status(500).json(err))
}

const getPageSections = (req, res) => {
  const { pageId } = req.params

  Pages
    .findById(pageId)
    .populate('sections')
    .exec()
    .then(page => res.status(200).json(page))
    .catch(err => res.status(500).json(err))
}

const getSection = async (req, res) => {
  const { sectionId } = req.params

  Sections
    .findById(sectionId)
    .exec()
    .then(section => res.status(200).json(section))
    .catch(err => res.status(500).json(err))
}

const addSection = async (req, res) => {
  const { pageId } = req.params
  const { title, content, order, side } = req.body

  Sections
    .create({ title, content, order, side })
    .then(async section => {
      try {
        const page = await Pages.findByIdAndUpdate(pageId, { $push: { sections: section.id } }).exec()
        res.status(200).json({ page, section })
      } catch (e) {
        res.status(500).json(err)
      }
    })
    .catch(err => res.status(500).json(err))
}

const editSection = async (req, res) => {
  const { sectionId } = req.params
  const { title, content, order, side } = req.body

  Sections
    .findByIdAndUpdate(sectionId, { title, content, order, side }, { new: true })
    .exec()
    .then(section => res.status(200).json(section))
    .catch(err => res.status(500).json(err))
}

module.exports = {
  addPage,
  getPages,
  getPage,
  getPageSections,
  getSection,
  addSection,
  editSection
}