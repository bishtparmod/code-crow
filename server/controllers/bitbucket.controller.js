/////////////////////////////////////
//      BITBUCKET CONTROLLER       //
/////////////////////////////////////

const bitbucketapi = require("../api/api.bitbucket")

module.exports = {

    // Users

    getUser,

    // Teams,

    getTeams,

    // Repos
    getRepos,

    // Pull Requests
    getPullRequests,

}

async function getUser(req, res){
    var result = await bitbucketapi.getUser(req);
    res.status(201).json({ status: 201, "msg": "Get a single user", "users": result });
}

async function getTeams(req, res) {
    var result = await bitbucketapi.getTeams(req);
    res.status(201).json({ status: 201, "msg": "Get teams", "teams": result });
}

async function getPullRequests(req, res){
    var result = await bitbucketapi.getPullRequests(req.query);
    res.status(201).json({ status: 201, "msg": "Get Pull Requests", "pull requests": result});
}

async function getRepos(req, res){
    console.log("wanna get repos?");
    await bitbucketapi.getRepos(req.query)
    .then(result=>{
        // console.log("respond::", result);
        res.status(201).json({ status: 201, "msg": "Get Repositories", "repositories": result});
    })
    .catch(error=>{
        // console.log("error:::", error);
        res.status(201).json({ status: 201, "msg": "Get Repositories", "repositories": "Something went wrong"});
    });
}