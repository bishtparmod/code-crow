const chai = require('chai')
const chaiHttp = require('chai-http')
const testvars = require('./testvars.json')
const app = require('../index')

// Configure chai
chai.use(require('chai-json-schema'))
chai.use(chaiHttp);
chai.should();

it("Should create a channel", (done) => {
  const data = {
    title: "TEST",
    description: "TEST",
    channelSID: "CH30a344a95c374ca9bbb6b15411fe59fe",
    isPrivate: false,
    user: testvars.user._id
  }

  chai.request(app)
    .post('/api/channel/')
    .send(data)
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      const expectedSchema = {
        type: 'object',
        uniqueItems: true,
        required: ['title', 'description', 'channelSID', 'isPrivate', 'user'],
      };
      res.body.should.be.jsonSchema(expectedSchema)
      testvars.channel = res.body
      done()
    })
})

it("Should get a channel", (done) => {
  const id = testvars.channel._id

  chai.request(app)
    .get(`/api/channel/${id}`)
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      const expectedSchema = {
        type: 'object',
        uniqueItems: true,
        required: ['title', 'description', 'channelSID', 'isPrivate', 'user'],
      };
      res.body.should.be.jsonSchema(expectedSchema);
      done()
    })
})

it("Should block user from entering the channel", (done) => {
  const user = testvars.user._id
  const channel = testvars.channel._id

  chai.request(app)
    .post(`/api/channel/blocks`)
    .send({user, channel})
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      const expectedSchema = {
        type: 'object',
        uniqueItems: true,
        required: ['user', 'channel'],
      };
      res.body.should.be.jsonSchema(expectedSchema)
      testvars.block = res.body
      done()
    })
})

it("Should get channel's block list", (done) => {
  const id = testvars.channel._id

  chai.request(app)
    .get(`/api/channel/${id}/blocks`)
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.an('array')
      const expectedSchema = {
        type: 'object',
        uniqueItems: true,
        required: ['user', 'channel'],
      }
      const expectedUserSchema = {
        type: 'object',
        uniqueItems: true,
        required: ['firstName', 'lastName', 'email', 'providerType'],
      }
      const expectedChannelSchema = {
        type: 'object',
        uniqueItems: true,
        required: ['title', 'description', 'channelSID', 'isPrivate', 'user'],
      }
      const item = res.body[0]
      item.should.be.jsonSchema(expectedSchema)
      item.user.should.be.jsonSchema(expectedUserSchema)
      item.channel.should.be.jsonSchema(expectedChannelSchema)
      done()
    })
})

it("Should check if user is blocked", (done) => {
  const user = testvars.user._id
  const channel = testvars.channel._id

  chai.request(app)
    .get(`/api/channel/blocks/${user}/${channel}`)
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      const expectedSchema = {
        type: 'object',
        uniqueItems: true,
        required: ['user', 'channel'],
      };
      res.body.should.be.jsonSchema(expectedSchema);
      done()
    })
})

it("Should unblock user from entering the channel", (done) => {
  const id = testvars.block._id

  chai.request(app)
    .delete(`/api/channel/blocks/${id}`)
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      const expectedSchema = {
        type: 'object',
        uniqueItems: true,
        required: ['user', 'channel'],
      };
      res.body.should.be.jsonSchema(expectedSchema);
      done()
    })
})