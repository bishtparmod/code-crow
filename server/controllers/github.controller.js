
////////////////////////////////////////
//         REPO CONTROLLER            //
////////////////////////////////////////

const githubapi = require("../api/api.github")

module.exports = {

  // Users

  getSingleUser,
  getAuthenticatedUser,
  updateUser,
  getUserInformation,
  getAllUsers,

  // Team Membership

  getTeam,
  createTeam,
  editTeam,
  deleteTeam,

  // Pull Request

  getPullRequest,
  createPullRequest,
  updatePullRequest,
  getCommitsOnPullRequest,
  getPullRequestFiles,
  getMergedPullRequest,
  mergePullRequest,

  // Issues

  getIssues,
  getUserIssues,
  orgIssues,
  createIssue,
  editIssue,
  lockIssue,
  unlockIssue,

  // Repositories

  userRepo,
  getOrgRepo,
  getPublicRepo,
  createRepo,
  getRepo,
  editRepo,
  getTopicsRepo,
  replaceTopicsRepo,
  getContributors,
  getLanguages,
  getTeams,
  getTags,
  deleteRepo,
  transferRepo,

}

// Get a single user
async function getSingleUser(req, res){
    var result = await githubapi.getSingleUser(req.query);
    res.status(201).json({ status: 201, "msg": "Get a single user", "users": result });
}

// Get the authenticated user
async function getAuthenticatedUser(req, res){
    var result = await githubapi.getAuthenticatedUser(req.query);
    res.status(201).json({ status: 201, "msg": "Get the authenticated user", "users": result });
}

// Update the authenticated user
async function updateUser(req, res){
    var result = await githubapi.updateUser(req.body);
    res.status(201).json({ status: 201, "msg": "Update the authenticated user", "users": result });
}


// Get contextual information about a user
async function getUserInformation(req, res){
    var result = await githubapi.getUserInformation(req.query);
    res.status(201).json({ status: 201, "msg": "Get contextual information about a user", "users": result });
}

// Get all users
async function getAllUsers(req, res){
    var result = await githubapi.getAllUsers(req.query);
    res.status(201).json({ status: 201, "msg": "Get all users", "users": result });
}

async function getTeam(req, res) {
    var result = await githubapi.getTeam(req);
    res.status(201).json({ status:201, "msg": "Get team by id", "teams": result });
}

async function createTeam(req, res) {
    var result = await githubapi.createTeam(req);
    res.status(201).json({ status: 201, "msg": "Create team", "teams": result });
}

async function editTeam(req, res) {
    var result = await githubapi.editTeam(req);
    res.status(201).json({ status: 201, "msg": "Edit team", "teams": result });
}

async function deleteTeam(req, res) {
    var result = await githubapi.deleteTeam(req);
    res.status(201).json({ status: 201, "msg": "Delete team", "teams": result });
}

// Get a single pull request
// Lists details of a pull request by providing its number.

async function getPullRequest(req, res){
    
    var request = {
        owner:req.query.owner,
        repo : req.query.repo,
        number : req.query.id
    }

    if(request.number){
        var pullRequest = await githubapi.getGithubPullRequestByPullNumber(request);
        res.status(201).json({ status: 201, "msg": "Get pull request from " + request.owner + "'s " + request.repo + " by id", "pull_request": pullRequest });
    } 
    
    var pullRequests = await githubapi.getGithubPullRequest(request);

    res.status(201).json({ status: 201, "msg": "Get pull requests from " + request.owner + "'s " + request.repo + ".", "pull requests": pullRequests });
}

// Create a pull request
// You can also create a Pull Request from an existing Issue by passing an Issue number

async function createPullRequest(req, res){
    
    var request = {
        owner : req.query.owner,
        repo : req.query.repo,
        number : req.query.id
    }

    if(request.number){
        var pullRequests = await githubapi.newPullRequestFromIssue(request);
        res.status(201).json({ status: 201, "msg": "Create pull request from existing issue", "pull requests": pullRequests})
    }
    var pullRequests = await githubapi.newPullRequest(request)

    res.status(201).json({ status: 201, "msg": "Create pull request", "pull requests": pullRequests})
}

// Update a pull request

async function updatePullRequest(req, res) {
    var request = {
        owner : req.query.owner,
        repo : req.query.repo,
        number : req.query.id,
        title : req.query.title,
        body : req.query.body,
        state : req.query.state,
        base : req.query.base
    }

    var pullRequests = await githubapi.updatePullRquest(request)

    res.status(201).json({ status: 201, "msg": "Update pull request by id", "pull requests": pullRequests})

}

// List commits on a pull request

async function getCommitsOnPullRequest(req, res) {
    var request = {
        owner : req.query.owner,
        repo : req.query.repo,
        number : req.query.id,
    }

    var pullRequests = await githubapi.listCommitsOnPullRequest(request)

    res.status(201).json({ status: 201, "msg": "List commits on a pull request", "pull requests": pullRequests})

}

// Get pull request files

async function getPullRequestFiles(req, res) {
    var request = {
        owner : req.query.owner,
        repo : req.query.repo,
        number : req.query.id,
    }

    var result = await githubapi.getPullRequestFiles(request)

    res.status(200).json({status:200, "msg": "Get pull request files", "result": result})
}

// Get if a pull request has been merged

async function getMergedPullRequest(req, res) {
    var request = {
        owner : req.query.owner,
        repo : req.query.repo,
        number : req.query.id,
    }

    var result = await githubapi.getMergedPullRequest(request)

    res.status(200).json({status:200, "msg": "Get merged pull request ", "result": result})

    
    // if(result.status == 204){
    //     res.send({status:204, content: "No Content"})
    // } else if (result.status == 404){
    //     res.status(404).json({ status:404, "message": "Not Found"})
    // } else{
    //     res.send({err: "Get pull request failed!"});
    // }

}

// Merge a pull request

async function mergePullRequest(req, res) {
    var request = {
        owner : req.query.owner,
        repo : req.query.repo,
        number : req.query.id,
    }

    var result = await githubapi.mergePullRequest(request)

    res.status(200).json({status:200, "msg": "Get merged pull request ", "result": result})


    // if(result.status == 200){
    //     res.status(200).json({ status: 200, "sha": result.sha, "merged": result.merged, "message": result.message})
    // } else if (result.status == 405){
    //     res.status(405).json({ status:405, "message": result.message})
    // } else if (result.status == 409){
    //     res.status(409).json({ status:409, "message": result.message})
    // } else{
    //     res.send({err: "Merge pull request failed!"});
    // }

}

// List issues

async function getIssues(req, res) {
    var result = await githubapi.getIssues(req);
    res.status(201).json({status:200, "msg": "Get issues", "issues": result });
}

// List issues for a repository

async function getUserIssues(req, res) {

}

// Get a single issue

async function orgIssues(req, res) {

}

// Create an issue

async function createIssue(req, res) {
    var result = await githubapi.createIssue(req);
    res.status(201).json({status:200, "msg": "Create an issue", "issues": result });
}

// Edit an issue

async function editIssue(req, res) {
    var result = await githubapi.editIssue(req);
    res.status(201).json({status:200, "msg": "Edit an issue", "issues": result });
}

// Lock an issue

async function lockIssue(req, res) {

}

// Unlock an issue

async function unlockIssue(req, res) {
    
}

// Repositories

async function userRepo(req, res){
    var request = {
        username: req.query.username
    }
    console.log(request, request.username);
    if(request.username) {   
        await githubapi.userRepo(request)
        .then(result=>{
            res.status(200).json({status:200, "msg": "List user repositories", "result": result})
        })
        .catch(error=>{
            console.log(error);
            res.status(200).json({status:200, "msg": "List user repositories", "result": "Something went wrong"})
        })
    } else {
        var result = await githubapi.yourRepo(request)
        res.status(200).json({status:200, "msg": "List your repositories", "result": result})
    }
}

async function getOrgRepo(req, res){
    var request = {
        org: req.query.org
    }

    var result = await githubapi.getOrgRepo(request)
    res.status(200).json({status:200, "msg": "List organization repositories", "result": result})
}

async function getPublicRepo(req, res){
    var request = {
        
    }

    var result = await githubapi.getPublicRepo(request)
    res.status(200).json({status:200, "msg": "List all public repositories", "result": result})
}

async function createRepo(req, res){
    var result = await githubapi.createRepo(request)
    res.status(200).json({status:200, "msg": "Create", "result": result})
}

async function getRepo(req, res){
    var request = {
        owner : req.query.owner,
        repo : req.query.repo
    }

    var result = await githubapi.getRepo(request)
    res.status(200).json({status:200, "msg": "Get", "result": result})
}

async function editRepo(req, res){
    var request = {
        owner : req.query.owner,
        repo : req.query.repo
    }

    var result = await githubapi.editRepo(request)
    res.status(200).json({status:200, "msg": "Edit", "result": result})
}

async function getTopicsRepo(req, res){
    var request = {
        owner : req.query.owner,
        repo : req.query.repo
    }

    var result = await githubapi.getTopicsRepo(request)
    res.status(200).json({status:200, "msg": "List all topics for a repository", "result": result})
}

async function replaceTopicsRepo(req, res){
    var request = {
        owner : req.query.owner,
        repo : req.query.repo
    }

    var result = await githubapi.replaceTopicsRepo(request)
    res.status(200).json({status:200, "msg": "Replace all topics for a repository", "result": result})
}

async function getContributors(req, res){
    var request = {
        owner : req.query.owner,
        repo : req.query.repo
    }

    var result = await githubapi.getContributors(request)
    res.status(200).json({status:200, "msg": "List contributors", "result": result})
}

async function getLanguages(req, res){
    var request = {
        owner : req.query.owner,
        repo : req.query.repo
    }

    var result = await githubapi.getLanguages(request)
    res.status(200).json({status:200, "msg": "List languages", "result": result})
}

async function getTeams(req, res){
    var request = {
        owner : req.query.owner,
        repo : req.query.repo
    }

    var result = await githubapi.getTeams(request)
    res.status(200).json({status:200, "msg": "List teams", "result": result})
}

async function getTags(req, res){
    var request = {
        owner : req.query.owner,
        repo : req.query.repo
    }

    var result = await githubapi.getTags(request)
    res.status(200).json({status:200, "msg": "List tags", "result": result})
}

async function deleteRepo(req, res){
    var request = {
        owner : req.query.owner,
        repo : req.query.repo
    }

    var result = await githubapi.deleteRepo(request)
    res.status(200).json({status:200, "msg": "Delete a repository", "result": result})
}

async function transferRepo(req, res){
    var request = {
        owner : req.query.owner,
        repo : req.query.repo
    }

    var result = await githubapi.transferRepo(request)
    res.status(200).json({status:200, "msg": "Transfer a repository", "result": result})
}
