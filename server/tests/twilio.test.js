const chai = require('chai')
const chaiHttp = require('chai-http')
const testvars = require('./testvars.json')
const app = require('../index')

// Configure chai
chai.use(require('chai-json-schema'))
chai.use(chaiHttp);
chai.should();

it("Should generate twilio token", (done) => {
  const identity = "userName"

  chai.request(app)
    .post('/api/twilio/chat-token')
    .send({ identity })
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('token')
      done()
    })
})

it('Should enter a new channel', (done) => {
  const sid = "CH6a725c4479d94493abe77ae993c78302"
  const email = testvars.user.email

  chai.request(app)
    .get(`/api/twilio/enterChannel/${sid}/${email}`)
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('email', email)
      res.body.should.have.property('channelSID', sid)
      done()
    })
})

it('Should get the user\'s channel', (done) => {
  const email = testvars.user.email
  
  chai.request(app)
    .get(`/api/twilio/userChannel/${email}`)
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('sid')
      done()
    })
})
