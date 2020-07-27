const express = require('express');
const gitlabCtrl = require('../controllers/gitlab.controller');

const router = express.Router();

module.exports = router


///////////////////////////
// Read and Write Users  //
///////////////////////////
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


// Gets currently authenticated user

router.get('/user', gitlabCtrl.getUser);

// Creates a new user

router.post('/users', gitlabCtrl.createUser);

// Modifies an existing user

router.put('/users', gitlabCtrl.editUser);



///////////////////////////
// Read and Write Groups //
///////////////////////////



// List groups
// http://localhost:4040/api/gitlab/groups

router.get('/groups', gitlabCtrl.getGroup);

// New group
// {
// 	"name": "new group011023",
// 	"path": "newgroup011023"
// }

router.post('/groups', gitlabCtrl.newGroup);

// Update group
// http://localhost:4040/api/gitlab/groups?id=5011597
router.put('/groups', gitlabCtrl.updateGroup);

// Remove group

router.delete('/groups', gitlabCtrl.deleteGroup);


//////////////////////////////////
// Read and Write Pull Requests //
//////////////////////////////////


// GET /merge_requests
// http://localhost/merge_requests

router.get('/merge_requests', gitlabCtrl.getMergeRequests);

// Creates a new merge request.
// http://localhost/merge_requests?id=id=11830995
// {
//     "source_branch": "test_branch",
//     "target_branch": "master",
//     "title": "New Merge Request",
// }

router.post('/merge_requests', gitlabCtrl.createMergeRequest);

// PUT http://localhost/merge_requests?id=id=11830995&merge_request_iid=1

router.put('/merge_requests', gitlabCtrl.updateMergeRequest);

// DELETE http://localhost/merge_requests?id=id=11830995&merge_request_iid=1

router.delete('/merge_requests', gitlabCtrl.deleteMergeRequest);



///////////////////////////
// Read and Write Issues //
///////////////////////////

// Get issues
// get http://localhost:4040/api/gitlab/issues

router.get('/issues', gitlabCtrl.getIssues);

// New issue
// post http://localhost:4040/api/gitlab/issues?id=11830995 (project id)

router.post('/issues', gitlabCtrl.newIssue);

// Update issue
// put http://localhost:4040/api/gitlab/issues?id=11830995&iid=2

router.put('/issues', gitlabCtrl.updateIssue);

// Delete an issue
// delete http://localhost:4040/api/gitlab/issues?id=11830995&iid=2

router.delete('/issues', gitlabCtrl.deleteIssue);

/////////////////////////////////
// Read and Write Repositories //
/////////////////////////////////



// List repository tree
// http://localhost:4040/api/gitlab/repos?id=11830995

router.get('/repos', gitlabCtrl.getRepos);



//////////////////////////
// Read and Write Wikis //
//////////////////////////



// Get all wiki pages for a given project.
// https://gitlab.com/api/v4/projects/11830995/wikis
// :id comes from https://gitlab.com/api/v4/user (get authenticated user "current user")
// 11830995 comes from https://gitlab.com/api/v4/users/3838883/projects (get current projects for authenticated user)
// http://localhost:4040/api/gitlab/wikis?id=11830995

router.get('/wikis', gitlabCtrl.getWikiPages);

// Create a new wiki page
// http://localhost:4040/api/gitlab/wikis?id=11830995
// {
// 	"title": "test request update",
// 	"content": "test request"
// }

router.post('/wikis', gitlabCtrl.createWikiPage);

// Edit an existing wiki page
// put /projects/:id/wikis/:slug
// http://localhost:4040/api/gitlab/wikis?id=11830995&slug=test-request

router.put('/wikis', gitlabCtrl.editWikiPage);

// Delete a wiki page
// http://localhost:4040/api/gitlab/wikis?id=11830995&slug=test-request

router.delete('/wikis', gitlabCtrl.deleteWikiPage);
