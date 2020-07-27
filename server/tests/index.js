const chai = require('chai')
const MongoClient = require('mongodb').MongoClient;
const testvars = require('./testvars.json')
const fs = require('fs')

async function clearDatabase() {
  await new Promise((resolve, reject) => {
    MongoClient.connect(
      process.env.MONGO_URI,
      { keepAlive: 1, useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        if (err) {
          console.log(err)
          throw err
        }
        const db = client.db('codetest')
        db.dropDatabase(function (err, result) {
          if (err) {
            console.log("Error : " + err)
            reject()
            throw err
          } else {
            console.log("Mongodb cleared", result)
            const testvars = {}
            fs.writeFile('./testvars.json', JSON.stringify(testvars), (err) => {
              if (err) throw err
              client.close()
              resolve()
            })
          }
        })
      })
  })
}

const importTest = (name, path) => {
  describe(name, function () {
    require(path)
  })
}

describe('API Tests', () => {
  process.env.NODE_ENV = 'test'
  process.env.MONGO_TEST_URI = process.env.MONGO_URI

  before(clearDatabase)

  importTest('Auth Test', './auth.test')
  importTest('Roles Tests', './roles.test.js')
  importTest('Twilio Test', './twilio.test')
  importTest('Notifications Test', './notifications.test')
  importTest('Channel Test', './channels.test')
  // importTest('Pages Test', './pages.test')

  afterEach((done) => {
    testvars.filelastupdate = new Date()
    fs.writeFile('./testvars.json', JSON.stringify(testvars), (err) => {
      if (err) throw err
      done()
    })
  })

  after(() => {
    process.exit()
  })
})