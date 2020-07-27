const chai = require('chai')
const chaiHttp = require('chai-http')
const testvars = require('./testvars.json')
const app = require('../index')

chai.use(require('chai-json-schema'))
chai.use(chaiHttp);
chai.should();

it("Should create a live stream", (done) => {
  chai.request(app)
    .post(`/api/liveStreaming`)
    .send({
      channel: "CH5c66d03db791455083e449ed3634b405"
    })
    .end((err, res) => {
      res.should.have.status(200)
      testvars.liveStreaming = res.body
      done()
    })
})

it("Should add a live streaming participant", (done) => {
  const oldDateObj = new Date()
  const liveStreamingId = testvars.liveStreaming._id

  chai.request(app)
    .post(`/api/liveStreaming/${liveStreamingId}/participant`)
    .send({
      startDate: new Date(), endDate: new Date(oldDateObj.getTime() + 10 * 60000), username: 'TEST'
    })
    .end((err, res) => {
      res.should.have.status(200)
      done()
    })
})