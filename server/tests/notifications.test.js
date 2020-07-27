const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../index')

// Configure chai
chai.use(chaiHttp);
chai.should();

it('Should send notifications to channel\'s users', (done) => {
  const userNames = ["urob0ros"]
  const body = "Notification from unit tests"
  const title = "Adding unit tests"

  chai.request(app)
    .post('/api/notifications/push')
    .send({ userNames, body, title })
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      done()
    })
})
