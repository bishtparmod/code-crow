const express = require('express')
const router = express.Router()
const PageCTRL = require('../controllers/pages.controller')

module.exports = router

router.post('/', PageCTRL.addPage)

router.get('/', PageCTRL.getPages)

router.get('/:pageId', PageCTRL.getPage)

router.post('/:pageId/sections', PageCTRL.addSection)

router.get('/:pageId/sections', PageCTRL.getPageSections)

router.get('/sections/:sectionId', PageCTRL.getSection)

router.patch('/sections/:sectionId', PageCTRL.editSection)