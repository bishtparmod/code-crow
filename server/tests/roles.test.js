const chai = require('chai')
const chaiHttp = require('chai-http')
const testvars = require('./testvars.json')
const app = require('../index')

// Configure chai
chai.use(chaiHttp);
chai.should();

it('Should add new role', (done) => {
  chai
    .request(app)
    .post('/api/roles')
    .send({ name: 'admin' })
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.name.should.be.equal("admin")
      testvars.role = res.body
      done()
    })
})

it('Should get all roles', (done) => {
  chai
    .request(app)
    .get('/api/roles')
    .end((err, res) => {
      res.should.have.status(200)
      const expectedSchema = {
        type: 'object',
        uniqueItems: true,
        required: ['name', '_id'],
      }
      res.body[0].should.be.jsonSchema(expectedSchema);
      done()
    })
})

it('Should create new role mapping', (done) => {
  const roleId = testvars.role._id
  const userId = testvars.user._id
  
  chai
    .request(app)
    .post('/api/roles/roleMapping')
    .send({ roleId, userId })
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      const expectedSchema = {
        type: 'object',
        uniqueItems: true,
        required: ['roleId', 'userId'],
      }
      res.body.should.be.jsonSchema(expectedSchema);
      done()
    })
})

it('Should get role users', (done) => {
  const roleId = testvars.role._id

  chai
    .request(app)
    .get(`/api/roles/${roleId}/users`)
    .end((err, res) => {
      res.should.have.status(200)
      done()
    })
})

it('Should delete role mapping', (done) => {
  const roleId = testvars.role._id
  const userId = testvars.user._id
  chai
    .request(app)
    .delete('/api/roles/roleMapping')
    .send({ roleId, userId })
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      const expectedSchema = {
        type: 'object',
        uniqueItems: true,
        required: ['roleId', 'userId'],
      }
      res.body.should.be.jsonSchema(expectedSchema);
      done()
    })
})