const chai = require('chai')
const chaiHttp = require('chai-http')
const testvars = require('./testvars.json')
const app = require('../index')

// Configure chai
chai.use(require('chai-json-schema'))
chai.use(chaiHttp);
chai.should();

it("Should create a new Github user", (done) => {
  const data = {
    firstName: "iMustafa",
    lastName: "Mustafa Ahmed",
    email: "iMustafa97@outlook.com",
    providerType: "Github",
    avatar: "https://avatars1.githubusercontent.com/u/23561973?v=4"
  }

  chai.request(app)
    .post('/api/auth/user')
    .send(data)
    .end((err, res) => {
      res.should.have.status(201)
      res.body.should.be.a('object')
      const expectedSchema = {
        type: 'object',
        uniqueItems: true,
        required: ['status', 'success', 'message', 'User']
      }
      const expectedUserSchema = {
        type: 'object',
        uniqueItems: true,
        required: ['firstName', 'lastName', 'email', 'providerType']
      }
      res.body.should.be.jsonSchema(expectedSchema)
      res.body.User.should.be.jsonSchema(expectedUserSchema)
      testvars.user = res.body.User
      done()
    })
})

