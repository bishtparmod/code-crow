const express = require('express');
const bitbucketCtrl = require('../controllers/bitbucket.controller');

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
    // console.log(req.user);
    var redirect_uri = "/auth/authenticate/" 
                        + req.user.firstName + "/" 
                        + req.user.email + "/" 
                        + req.user.token;
    res.redirect(redirect_uri);
});

// Gets currently authenticated user
// http://localhost:4040/api/bitbucket/user

router.get('/user', bitbucketCtrl.getUser);


//////////////////////////
// Read and Write Teams //
//////////////////////////

// Returns all the teams that the authenticated user is associated with.
// http://localhost:4040/api/bitbucket/teams?role=admin

router.get('/teams', bitbucketCtrl.getTeams);

////////////////////////////////
// Read and Write Repository  //
////////////////////////////////


// Returns a paginated list of all public repositories.
// http://localhost:4040/api/bitbucket/repos

router.get('/repos', bitbucketCtrl.getRepos);


/////////////////////////////////
// Read and Write Pull Request //
/////////////////////////////////

// Returns all pull requests authored by the specified user.
// http://localhost:4040/api/bitbucket/pullrequests?user=strakic

router.get('/pullrequests', bitbucketCtrl.getPullRequests);
