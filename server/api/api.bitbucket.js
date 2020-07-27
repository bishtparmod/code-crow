const request = require('superagent');
const config = require('../config/config');

module.exports = {

    // Users

    getUser,

    // Teams

    getTeams,

    // Repos
    getRepos,

    // Pull Requests
    getPullRequests,
}

async function getUser(req){
    try{
        const result = await request.get('https://bitbucket.org/api/2.0/user')
        .set('Authorization', 'Bearer ' + config.bitbucket.accessToken)
        return result.body
    }catch(e){
        console.log(e.text)
    }
}

async function getTeams(req){
    try{
        const result = await request.get('https://bitbucket.org/api/2.0/teams?role=' + req.query.role)
        .set('Authorization', 'Bearer ' + config.bitbucket.accessToken)
        return result.body
    }catch(e){
        console.log(e)
    }
}

async function getRepos(req) {
    try{
        const result = await request.get('https://bitbucket.org/api/2.0/repositories')
        return result.body;
    } catch(e) {
        console.log(e);
    }
}

async function getPullRequests(req) {
    try{
        const result = await request
            .get('https://bitbucket.org/api/2.0/pullrequests/'+ req.query.user)
        return result.body;
    } catch(e) {
        console.log(e.text);
    }
}