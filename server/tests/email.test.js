const chai = require('chai')
const chaiHttp = require('chai-http')
const testvars = require('./testvars.json')
const app = require('../index')

chai.use(require('chai-json-schema'))
chai.use(chaiHttp);
chai.should();


it("Should send an email", (done) => {
  chai.request(app)
    .post(`/api/email/send`)
    .send({
      name: "Test", email: "imustafa97@outlook.com", subject: "Email Test", message: "Test Test Test Test"
    })
    .end((err, res) => {
      res.should.have.status(200)
      done()
    })
})