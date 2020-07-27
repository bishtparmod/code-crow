const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const StreamTime = require('../models/streamingTime.model')
const BitbucketStrategy = require('passport-bitbucket-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;  //OAuth Passport library Uladzimir
const BitbucketTokenStrategy = require('passport-bitbucket-token');
const GitLabStrategy = require('passport-gitlab2').Strategy;

const http = require('http');
const https = require('https');
const authMiddleware = require('../middlewares/auth.middleware')

const User = require('../models/user.model');
const config = require('./config');

const Stripe = require('../helpers/stripe.helper')

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  User.findOne({ email: user.email }).then((_user) => {
    done(null, _user);
  })
});

// Use the GitHubStrategy within Passport.
passport.use(new GitHubStrategy(
  {
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL,
  },
  (token, tokenSecret, profile, done) => {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      let user = new User({
        firstName: profile.username,
        lastName: profile.displayName,
        email: profile._json.email,
        providerType: "Github",
        channelId: "",
        state: "",
        avatar: profile._json.avatar_url,
        token: token
      });
      User.findOne({ email: profile._json.email })
        .then((currentUser) => {
          if (authMiddleware.isStaging(profile._json.email)) {
            if (currentUser) {
              return done(null, currentUser);
            } else {
              user.save()
                .then(async (newUser) => {
                  const customer = await Stripe.createCustomer(profile._json.email)
                  await StreamTime.create({
                    userId: newUser.id,
                    purchasedMinutes: 60,
                    remainingMinutes: 30,
                    productId: 'on-registration'
                  })
                  await newUser.update({ customerId: customer.id }).exec()
                  return done(null, newUser);
                })
            }
          } else {
            return done({ message: "Unauthorized" })
          }
        })
    });
  }
));

passport.use(new BitbucketStrategy(
  {
    clientID: config.bitbucket.clientID,
    clientSecret: config.bitbucket.clientSecret,
    callbackURL: config.bitbucket.callbackURL,
    profileWithEmail: true,
  },
  function (token, tokenSecret, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      var _useremail = "";
      if (profile.emails) {
        for (var i = 0; i < profile.emails.length; i++) {
          if (profile.emails[i].primary) {
            _useremail = profile.emails[i].value;
          }
        }
      }
      let user = new User({
        firstName: profile.username,
        lastName: profile.username,
        email: _useremail,
        providerType: profile.provider,
        channelId: "",
        state: "",
        avatar: profile._json.links.avatar.href,
        token: token
      });
      console.log(user);
      User.findOne({ email: _useremail })
        .then((currentUser) => {
          if (authMiddleware.isStaging(_useremail)) {
            if (currentUser) {                          //already have a user
              console.log("current user: ",currentUser);
              return done(null, currentUser);
            } else {                                  //if now, create new user in our db
              user.save()
                .then(async (newUser) => {
                  const customer = await Stripe.createCustomer(_useremail)
                  await StreamTime.create({
                    userId: newUser.id,
                    purchasedMinutes: 60,
                    remainingMinutes: 30,
                    productId: 'on-registration'
                  })
                  console.log("current customer: ", JSON.stringify(customer));
                  await newUser.update({ customerId: customer.id }).exec()
                  return done(null, newUser);
                })
            }
          } else {
            return done({ message: "Unauthorized" })
          }
        })
    });
  }
));

passport.use(new GitLabStrategy(
  {
    clientID: config.gitlab.clientID,
    clientSecret: config.gitlab.clientSecret,
    callbackURL: config.gitlab.callbackURL,
  },
  function (accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // console.log(profile);
      let user = new User({
        firstName: profile.displayName,
        lastName: profile.displayName,
        email: profile.emails[0].value,
        providerType: "Gitlab",
        channelId: "",
        state: "",
        avatar: profile.avatarUrl,
        token: accessToken
      });
      // console.log(user);
      User.findOne({ email: profile.emails[0].value })
        .then((currentUser) => {
          if (authMiddleware.isStaging(profile._json.email)) {
            if (currentUser) {                          //already have a user
              return done(null, currentUser);
            } else {                                  //if now, create new user in our db
              user.save()
                .then(async (newUser) => {
                  const customer = await Stripe.createCustomer(profile._json.email)
                  await StreamTime.create({
                    userId: newUser.id,
                    purchasedMinutes: 60,
                    remainingMinutes: 30,
                    productId: 'on-registration'
                  })
                  await newUser.update({ customerId: customer.id }).exec()
                  return done(null, newUser);
                })
            }
          } else {
            return done({ message: "Unauthorized" })
          }
        })
    });
  }
));

// passport.use(jwtLogin);
