////////////////////////////////////////
//         GITLAB CONTROLLER          //
////////////////////////////////////////

const gitlabapi = require("../api/api.gitlab")

module.exports = {

    // Users

    getUser,
    createUser,
    editUser,

    // Groups

    getGroup,
    newGroup,
    updateGroup,
    deleteGroup,

    // Merge Requests

    getMergeRequests,
    createMergeRequest,
    updateMergeRequest,
    deleteMergeRequest,

    // Issues,

    getIssues,
    newIssue,
    updateIssue,
    deleteIssue,

    // Repositories,

    getRepos,

    // Wikis

    getWikiPages,
    createWikiPage,
    editWikiPage,
    deleteWikiPage,
}

async function getUser(req, res){
    var result = await gitlabapi.getUser(req.query);
    res.status(201).json({ status: 201, "msg": "Get a single user", "users": result });
}

async function createUser(req, res){
    var result = await gitlabapi.createUser(req.body);
    res.status(201).json({ status: 201, "msg": "Create a user", "users": result });
}

async function editUser(req, res){
    var result = await gitlabapi.editUser(req.body);
    res.status(201).json({ status: 201, "msg": "Modify a user", "users": result });
}

async function getGroup(req, res){
    var result = await gitlabapi.getGroup(req);
    res.status(201).json({ status: 201, "msg": "Get group", "users": result });
}

async function newGroup(req, res){
    var result = await gitlabapi.newGroup(req);
    res.status(201).json({ status: 201, "msg": "Create a group", "users": result });
}

async function updateGroup(req, res){
    var result = await gitlabapi.updateGroup(req);
    res.status(201).json({ status: 201, "msg": "Modify a group", "users": result });
}

async function deleteGroup(req, res) {
    var result = await gitlabapi.deleteGroup(req);
    res.status(201).json({ status: 201, "msg": "Delete a group", "users": result });
}

async function getMergeRequests(req, res){
    var result = await gitlabapi.getMergeRequests(req.query);
    res.status(201).json({ status: 201, "msg": "Get MR", "merge requests": result });
}

async function createMergeRequest(req, res){
    var result = await gitlabapi.createMergeRequest(req.body);
    res.status(201).json({ status: 201, "msg": "Create a MR", "merge requests": result });
}

async function updateMergeRequest(req, res){
    var result = await gitlabapi.updateMergeRequest(req.body);
    res.status(201).json({ status: 201, "msg": "Update MR", "merge requests": result });
}

async function deleteMergeRequest(req, res){
    var result = await gitlabapi.deleteMergeRequest(req.query);
    res.status(201).json({ status: 201, "msg": "Delete MR", "merge requests": result });
}

async function getIssues(req, res){
    var result = await gitlabapi.getIssues(req.query);
    res.status(201).json({ status: 201, "msg": "Get issues", "issues": result });
}

async function newIssue(req, res){
    var result = await gitlabapi.newIssue(req);
    res.status(201).json({ status: 201, "msg": "Create a issue", "issues": result });
}

async function updateIssue(req, res){
    var result = await gitlabapi.updateIssue(req);
    res.status(201).json({ status: 201, "msg": "Update issue", "issues": result });
}

async function deleteIssue(req, res){
    var result = await gitlabapi.deleteIssue(req);
    res.status(201).json({ status: 201, "msg": "Delete an issue", "issues": result });
}

async function getRepos(req, res){
    var request = {
        id: req.query.id
    }
    var result = await gitlabapi.getRepos(req.query)
    .then(result=>{
        // res.status(200).json({status:200, "msg": "List user repositories", "result": result})
        res.status(201).json({ status: 201, "msg": "List repository tree", "result": result });
    })
    .catch(error=>{
        // res.status(200).json({status:200, "msg": "List user repositories", "result": "Something went wrong"})
        res.status(201).json({ status: 201, "msg": "List repository tree", "result": "Something went wrong" });
    });
    
}

async function getWikiPages(req, res){
    var result = await gitlabapi.getWikiPages(req.query);
    res.status(201).json({ status: 201, "msg": "Get wiki pages", "wikis": result });
}

async function createWikiPage(req, res){
    var result = await gitlabapi.createWikiPage(req);
    res.status(201).json({ status: 201, "msg": " Create a new wiki page", "wikis": result });
}

async function editWikiPage(req, res) {
    var result = await gitlabapi.editWikiPage(req);
    res.status(201).json({ status:201, "msg": "Edit a wiki page", "wikis": result });
}

async function deleteWikiPage(req, res) {
    var result = await gitlabapi.deleteWikiPage(req);
    res.status(201).json({ status:201, "msg": "Delete a wiki page", "wikis": result});
}