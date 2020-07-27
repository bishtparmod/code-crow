const mongoose = require('mongoose');
const User = require('../models/user.model');
const Friends = require('../models/friends.model');
const api = require('../api/api.github');
const config = require('../config/config');
const uuid = require('uuid');
const Video = require('../models/video.model')

module.exports = {
    getGithubUser,
    newGithubUser,
    authGithub,
    updateUserNotification,
    getUsersByIds,
    getAllUsers,
    searchUsers,
    getUserById,
    getUserByEmail,
    getUserVideos,
    setUserBanById
}

////////////////////////////////////////
//         USER CONTROLLER            //
////////////////////////////////////////

async function getUserVideos(req, res) {
    try {
        const { id } = req.params
        const videos = await Video
            .find({ user: id })
            .populate([
                { path: 'stream', select: { title: 1, id: 1, duration: 1 } },
                { path: 'channel', select: { title: 1, id: 1 } },
                { path: 'views', populate: { path: 'user', select: { firstName: 1, lastName: 1, id: 1, providerType: 1, avatar: 1, email: 1 } } },
                { path: 'likes' }
            ])
            .exec()

        res.status(200).json(videos)
    } catch (e) {
        res.status(500).json(e)
    }
}

function searchUsers(req, res) {
    const { param } = req.query
    const userId = req.user.id
    const query = {
        $or: [
            { firstName: new RegExp("^" + param, "i") },
            { lastName: new RegExp("^" + param, "i") },
            { email: new RegExp("^" + param, "i") }
        ]
    }

    User
        .find(query)
        .populate({
            path: 'friends',
            populate: [
                { path: 'requester', match: { id: userId } },
                { path: 'recipient', match: { id: userId } }
            ]
        })
        .exec()
        .then(users => {
            res.status(200).json(users.map(user => user.friends.length ? { status: user.friends[0].requester === null && user.friends[0].recipient === null ? 0 : user.friends[0].status, user } : { status: 0, user }))
                // { status: user.friends[0].status, user }
                // :
                // { status: 0, user }))
        })

    .catch(err => {
        res.status(500).json(err)
    })
}

function updateUserNotification(req, res) {
    const username = req.params.userName
    const usernameRegex = new RegExp("^" + username, "i");
    User
        .findOneAndUpdate({ firstName: usernameRegex }, { notificationObject: req.body }, { new: true })
        .exec()
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => {
            res.status(500).json(err)
        })
}

function getUsersByIds(req, res) {
    const { userNames } = req.body
    const query = userNames.length ? {
        firstName: {
            $in: userNames.map(username => new RegExp("^" + username, "i"))
        }
    } : {
            firstName: ""
        }
    User
        .find(query)
        .exec()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json(err))
}

function getAllUsers(req, res) {
    User
        .find({})
        .exec()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json(err))
}

async function getUserById(req, res) {
    const { id } = req.params
    try {
        const user = await User.findById(id).exec()
        res.status(200).json(user)
    } catch (e) {
        res.status(500).json(e)
    }
}

async function getUserByEmail(req, res) {
    const email = new RegExp('^' + req.body.email, "i")
    try {
        const user = await User.findOne({ email }).exec()
        res.status(200).json(user)
    } catch (e) {
        res.status(500).json(e)
    }
}

async function getGithubUser(req, res) {
    User.find({}, (err, data) => {
        res.status(201).json({ status: 201, "msg": "Get user info", "data": data })
    })
}

async function newGithubUser(req, res) {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let providerType = req.body.providerType;
    let state = req.body.state;
    let channelId = req.body.channelId;

    var regExEmail = new RegExp("^" + email, "i");
    var qry = { email: regExEmail }

    User.findOne(qry, function (err, dbUser) {
        if (err) {
            res.status(500).json({ status: 500, "msg": err.errmsg });
        } else if (dbUser) {
            res.status(201).json({ status: 201, "msg": "Authorized user!", "first name": dbUser.firstName, "last name": dbUser.lastName, "email": dbUser.email });
        } else {

            const user = new User({
                _id: mongoose.Types.ObjectId(),
                firstName: firstName,
                lastName: lastName,
                email: email,
                providerType: providerType,
                channelId: channelId,
                state: state,
            })

            return user
                .save()
                .then((newUser) => {
                    return res.status(201).json({
                        status: 201,
                        success: true,
                        message: 'New authorized user!',
                        User: newUser,
                    })
                })
                .catch((error) => {
                    res.status(500).json({
                        success: false,
                        message: 'Server error. Please try again.',
                        error: error.message,
                    })
                })
        }
    });
}

async function authGithub(req, res) {
    console.log(req.body);
    let code = req.body.code;
    if (!code) {
        return res.send({
            success: false,
            message: 'Error: no code'
        })
    }
    let access_token = await api.getAccessToken(code);
    let userInfo = await api.getUserInfo(access_token);
    let state = api.getState();

    if (userInfo) {
        if (!userInfo.login) {
            res.status(500).json({ status: 500, "msg": "User Email and Password are required to register a user" });
        } else {
            var regExEmail = new RegExp("^" + userInfo.email, "i");
            var regExUserName = new RegExp("^" + userInfo.name, "i");
            var qry = { $or: [{ email: regExEmail }, { name: regExUserName }] }

            User.findOne(qry, function (err, dbUser) {
                if (err) {
                    res.status(500).json({ status: 500, "msg": err.errmsg });
                } else if (dbUser) {
                    res.status(201).json({ status: 201, "msg": "Authorized user!", "name": dbUser.name, "email": dbUser.email });
                } else {

                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        name: userInfo.login,
                        email: userInfo.email,
                        providerType: 'github',
                        channelId: uuid(),
                        state: state,
                    })

                    return user
                        .save()
                        .then((newUser) => {
                            return res.status(201).json({
                                status: 201,
                                success: true,
                                message: 'New authorized user!',
                                User: newUser,
                            })
                        })
                        .catch((error) => {
                            res.status(500).json({
                                success: false,
                                message: 'Server error. Please try again.',
                                error: error.message,
                            })
                        })
                }
            });
        }
    }
}

async function setUserBanById(req, res) {
    const { id } = req.params
    const { isBanned } = req.body
    User
        .findOneAndUpdate({ _id: id }, { $set: { isBanned: isBanned } })
        .exec()
        .then(user => {
            console.log(">>setUserBanById: " + JSON.stringify(user))
            res.status(200).json(user)
        })
        .catch(err => {
            console.log(">>setUserBanById: " + err)
            res.status(500).json(err)
        })
}