const express = require('express');
const githubCtrl = require('../controllers/github.controller');
var expose = require('express-expose');

const router = express.Router();

module.exports = router


//////////////////////////
// Read and Write Users //
//////////////////////////

/**
 * 2019.Uladzimir - OAuth with Passport
 */
const authCheck = (req, res, next) => {
    if(!req.user) {
        res.redirect('/auth/login');
    } else {
        next();
    }
}

router.get('/',authCheck, (req, res) => {
    var redirect_uri = "/auth/authenticate/" 
                        + req.user.firstName + "/" 
                        + req.user.email + "/" 
                        + req.user.token;
    res.redirect(redirect_uri);
});

// Get a single user
// GET /users/:username
router.get('/user/single', githubCtrl.getSingleUser);

// Get the authenticated user
router.get('/user/authenticated', githubCtrl.getAuthenticatedUser);

// Update the authenticated user
// request:
// {
//     "name": "monalisa octocat",
//     "email": "octocat@github.com",
//     "blog": "https://github.com/blog",
//     "company": "GitHub",
//     "location": "San Francisco",
//     "hireable": true,
//     "bio": "There once..."
//   }

router.patch('/user', githubCtrl.updateUser);

// Get contextual information about a user
// GET /users/:username/hovercard
router.get('/user/hovercard', githubCtrl.getUserInformation);

// Get all users
router.get('/users', githubCtrl.getAllUsers);



////////////////////////////////////
// Read and Write Team Membership //
////////////////////////////////////



// GET team
// http://localhost:4040/api/github/teams?org=testorg0103

router.get('/teams', githubCtrl.getTeam);

// Create team
// {
// 	"name": "new team by owner",
// 	"description": "team description"
// }

router.post('/teams' ,githubCtrl.createTeam);

// Edit team
// http://localhost:4040/api/github/teams?team_id=3209223

router.patch('/teams', githubCtrl.editTeam);

// Delete team

router.delete('/teams', githubCtrl.deleteTeam);



/////////////////////////////////
// Read and Write Pull Request //
/////////////////////////////////




// Get pull requests or one request by number
router.get('/pullrequest', githubCtrl.getPullRequest);

// Create pull request or create from existing issue
router.post('/pullrequest', githubCtrl.createPullRequest);

// Update a pull request
router.patch('/pullrequest', githubCtrl.updatePullRequest);

// List commits on a pull request
router.get('/pullrequest/commits', githubCtrl.getCommitsOnPullRequest);

// List pull requests files
router.get('/pullrequest/files', githubCtrl.getPullRequestFiles);

// Get if a pull request has been merged
router.get('/pullrequest/merge', githubCtrl.getMergedPullRequest);

// Merge a pull request (Merge Button)
router.put('/pullrequest/merge', githubCtrl.mergePullRequest);




///////////////////////////
// Read and Write Issues //
///////////////////////////




// List issues
// http://localhost:4040/api/github/issues?owner=webdevrepo&repo=POWERTRAINWAY

router.get('/issues', githubCtrl.getIssues);

// List issues for a repository

router.get('/userissues', githubCtrl.getUserIssues);

// Get a single issue

router.get('/orgs/issues', githubCtrl.orgIssues);

// Create an issue
// http://localhost:4040/api/github/issues?owner=webdevrepo&repo=POWERTRAINWAY
// {
// 	"title": "Test issue"
// }

router.post('/issues', githubCtrl.createIssue);

// Edit an issue
// http://localhost:4040/api/github/issues?owner=webdevrepo&repo=POWERTRAINWAY?issue_number=1

router.patch('/issues', githubCtrl.editIssue);

// Lock an issue

router.put('/repos/issues/lock', githubCtrl.lockIssue);

// Unlock an issue

router.delete('/repos/issues/lock', githubCtrl.unlockIssue);




////////////////////////////////
// Read and Write Repository  //
////////////////////////////////




// List your repositories

// List user repositories
router.get('/userrepos', githubCtrl.userRepo);

// List organization repositories
router.get('/orgs/repos', githubCtrl.getOrgRepo);

// List all public repositories
router.get('/repositories', githubCtrl.getPublicRepo);

// Create
router.post('/userrepos', githubCtrl.createRepo);

// Get
router.get('/repos', githubCtrl.getRepo);

// Edit
router.patch('/repos', githubCtrl.editRepo);

// List all topics for a repository
router.get('/repos/topics', githubCtrl.getTopicsRepo);

// Replace all topics for a repository
router.put('/repos/topics', githubCtrl.replaceTopicsRepo);

// List contributors
router.get('/repos/contributors', githubCtrl.getContributors);

// List languages
router.get('/repos/languages', githubCtrl.getLanguages);

// List teams
router.get('/repos/teams', githubCtrl.getTeams);

// List tags
router.get('/repos/tags', githubCtrl.getTags);

// Delete a repository
router.delete('/repos', githubCtrl.deleteRepo);

// Transfer a repository
router.post('/repos/transfer', githubCtrl.transferRepo);




////////////////////////////
//  Read and Write Wikis  //
////////////////////////////