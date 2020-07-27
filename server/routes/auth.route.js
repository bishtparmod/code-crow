const express = require('express');
const userCtrl = require('../controllers/user.controller');
const passport = require('passport');
const User = require('../models/user.model');
const router = express.Router();
const AuthMiddlewares = require('../middlewares/auth.middleware')

module.exports = router;

router.get('/me', AuthMiddlewares.isLoggedIn, (req, res) => res.json(req.user));

router.patch('/user/:userName/notification', userCtrl.updateUserNotification)

router.post('/user', userCtrl.newGithubUser)

router.get('/logout', function(req, res) {
    req.logOut();
    res.status(200).clearCookie('connect.sid', {
        path: '/'
    });
    res.send(true);
});

// router.get('/logout', (req, res) => {
//   req.logOut()
//   req.session.destroy(err => {
//     res.status(200).clearCookie('connect.sid', { path: '/' }).json({ status: "Success" })
//   })
// })

/**
 * OAuth with Github Api End-Point by Uladzimir 2019.5.3
 */
router.get('/github', passport.authenticate('github', { scope: ['profile'] }));

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/login' }),
    (req, res) => {
        res.redirect('/api/github');
    }
);

/**
 * OAuth with Bitbucket Api End-Point by Uladzimir 2019.5.6
 */
router.get('/bitbucket', passport.authenticate('bitbucket'));

router.get('/bitbucket_token', passport.authenticate('bitbucket-token'), function(req, res, next) {
    if (!req.user) {
        return res.send(401, 'User Not Authenticated');
    }

    res.send(200);
});

// GET /auth/github/callback
router.get('/bitbucket/callback',
    passport.authenticate('bitbucket', { failureRedirect: '/auth/login' }),
    (req, res) => {
        res.redirect('/api/bitbucket');
    }
);

/**
 * OAuth with Bitbucket Api End-Point by Uladzimir 2019.5.6
 */
router.get('/gitlab', passport.authenticate('gitlab'));

// GET /auth/github/callback
router.get('/gitlab/callback',
    passport.authenticate('gitlab', { failureRedirect: '/auth/login' }),
    (req, res) => {
        // // res.send(req);
        res.redirect('/api/gitlab');
    }
);

//Get Avatar url 
router.post('/getAvatar', (req, res) => {
    User.findOne({ email: req.body.email })
        .then((currentUser) => {
            if (currentUser) {
                res.json({ currentUser });
            } else {
                res.json({ result: "error" });
            }
        })
})