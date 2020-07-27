const chai = require('chai')
const chaiHttp = require('chai-http')
const testvars = require('./testvars.json')
const app = require('../index')

// Configure chai
chai.use(chaiHttp);
chai.should();

it('Should add new page', (done) => {
  const title = 'Page Test'

  chai
    .request(app)
    .post('/api/pages')
    .send({ title })
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.title.should.be.equal(title)
      testvars.page = res.body
      done()
    })
})

it('Should get page by Id', (done) => {
  const id = testvars.page._id

  chai
    .request(app)
    .get(`/api/pages/${id}`)
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.title.should.be.equal(testvars.page.title)
      done()
    })
})

it('Should add new section', (done) => {
  const id = testvars.page._id
  const section = {
    title: "Terms of service",
    content: ["Test", "Test 2"],
    order: 2,
    side: 'left'
  }

  chai
    .request(app)
    .post(`/api/pages/${id}/sections`)
    .send(section)
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      const expectedSchema = {
        type: 'object',
        uniqueItems: true,
        required: ['page', 'section']
      }
      const expectedPageSchema = {
        type: 'object',
        uniqueItems: true,
        required: ['title', 'sections']
      }
      const expectedSectionSchema = {
        type: 'object',
        uniqueItems: true,
        required: ['title', 'content', 'order', 'side']
      }
      res.body.should.be.jsonSchema(expectedSchema)
      res.body.page.should.be.jsonSchema(expectedPageSchema)
      res.body.section.should.be.jsonSchema(expectedSectionSchema)
      testvars.section = res.body.section
      done()
    })
})

it('Should get page sections', (done) => {
  const id = testvars.page._id

  chai
    .request(app)
    .get(`/api/pages/${id}/sections`)
    .end((err, res) => {
      res.should.have.status(200)
      const expectedSchema = {
        type: 'object',
        uniqueItems: true,
        required: ['title', 'content', 'order', 'side']
      }
      res.body.sections[0].should.be.jsonSchema(expectedSchema)
      done()
    })
})

it('Should get section by Id', (done) => {
  const id = testvars.section._id

  chai
    .request(app)
    .get(`/api/pages/sections/${id}`)
    .end((err, res) => {
      res.should.have.status(200)
      const expectedSchema = {
        type: 'object',
        uniqueItems: true,
        required: ['title', 'content', 'order', 'side']
      }
      res.body.should.be.jsonSchema(expectedSchema)
      done()
    })
})

it('Should edit section by Id', (done) => {
  const id = testvars.section._id
  const section = {
    order: 3
  }

  chai
    .request(app)
    .patch(`/api/pages/sections/${id}`)
    .send(section)
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      const expectedSchema = {
        type: 'object',
        uniqueItems: true,
        required: ['title', 'content', 'order', 'side']
      }
      res.body.should.be.jsonSchema(expectedSchema)
      testvars.section = res.body.section
      done()
    })

})

