
////////////////////////////////////////
//               METHODS              //
////////////////////////////////////////

const request = require('superagent');
const config = require('../config/config');

module.exports = {

  // Authentication

  getAccessToken, 
  getUserInfo,
  getState,

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

  // pull requests

  getPullRequest,
  getPullRequestByPullNumber,
  newPullRequest,
  newPullRequestFromIssue,
  updatePullRquest,
  listCommitsOnPullRequest,
  getPullRequestFiles,
  getMergedPullRequest,
  mergePullRequest,

  // issues

  getIssues,
  getUserIssues,
  orgIssues,
  createIssue,
  editIssue,
  lockIssue,
  unlockIssue,
  
  // repositories

  yourRepo,
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
  transferRepo

}

async function getAccessToken(code) {
    // POST access token
    try {
      const result = await request
      .post('https://github.com/login/oauth/access_token')
      .send({ 
        client_id: config.github.clientID, 
        client_secret: config.github.clientSecret,
        code: code
      })
      return result.body.access_token
    } catch (e) {
      console.log(e)
    }  
}

async function getUserInfo(access_token) {    
  // GET header fields
  const result = await request
    .get('https://api.github.com/user')
    .set('Authorization', 'token ' + access_token)
  return result.body
}

function getState() {
  return "Online";
}

async function getSingleUser(req){
  const result = await request.get('https://api.github.com/users/'+req.username)
  return result.body
}

async function getAuthenticatedUser(req){
  const result = await request
    .get('https://api.github.com/user')
    .set('Authorization', 'token '+config.github.accessToken)
  return result.body
}

async function updateUser(req){
  try{
    const result = await request
    .patch('https://api.github.com/user')
    .send({ 
      name: req.name,
      email: req.email,
      blog: req.blog,
      company: req.company,
      location: req.location,
      hireable: req.hireable,
      bio: req.bio
    })
    .set('Authorization', 'token '+config.github.accessToken)
    return result.body
  } catch(e){
  }
  
  return result.body
}

async function getUserInformation(req) { 
  // GET header fields
  const result = await request
    .get('https://api.github.com/user')
    .set('Authorization', 'token '+config.github.accessToken)
    .set('Accept', 'application/vnd.github.hagar-preview+json')
  return result.body
}

async function getAllUsers(req){
  const result = await request.get('https://api.github.com/users');
  return result.body;
}

async function getTeam(req) {
  try{
    const result = await request.get('https://api.github.com/orgs/'+req.query.org+'/teams')
      .set('Authorization', 'token ' + config.github.accessToken)
    return result.body;
  } catch(e) {
    console.log(e)
  }
}

async function createTeam(req) {
  try{
    const result = await request.post('https://api.github.com/orgs/'+req.query.org+'/teams')
      .send({
        name: req.body.name,
        // description: req.body.description,
        // repo_names: req.body.repo_names,
      })
      .set('Authorization', 'token ' + config.github.accessToken)
    return result.body;
  } catch(e) {
    console.log(e.text)
  }
}

async function editTeam(req) {
  try{
    const result = await request.patch('https://api.github.com/teams/' + req.query.team_id)
      .send({
        name: req.body.name,
        description: req.body.description,
        repo_names: req.body.repo_names,
      })
      .set('Authorization', 'token ' + config.github.accessToken)
    return result.body;
  } catch(e) {
    console.log(e)
  }
}

async function deleteTeam(req) {
  try{
    const result = await request.delete('https://api.github.com/teams/' + req.query.team_id)
      .set('Authorization', 'token ' + config.github.accessToken)
    return result.body;
  } catch(e) {
    console.log(e)
  }
}

async function getPullRequest(req) {

  var owner = req.owner;
  var repo = req.repo;

  const result = await request.get('https://api.github.com/repos/' + owner + '/' + repo + '/pulls')
  return result.body
}

async function getPullRequestByPullNumber(req) {

  var owner = req.owner;
  var repo = req.repo;
  var number = req.number;

  const result = await request.get('https://api.github.com/repos/' + owner + '/' + repo + '/pulls/' + number)
  return result.body
}

async function newPullRequest(req) {

  var owner = req.owner;
  var repo = req.repo;
  var head = req.head;
  var base = req.base;
  var title = req.title;
  var body = req.body;

  const result = await request
    .post('https://api.github.com/repos/' + owner + '/' + repo + '/pulls')
    .send({ 
      "title" : title,
      "body" : body,
      "head" : head,
      "base" : base
    })
  return result.body
}

async function newPullRequestFromIssue(req) {

  var owner = req.owner;
  var repo = req.repo;
  var issue = req.number;
  var head = req.head;
  var base = req.base;

  const result = await request
    .post('https://api.github.com/repos/' + owner + '/' + repo + '/pulls')
    .send({ 
      "issue" : issue,
      "head" : head,
      "base" : base
    })    
  return result.body
}

async function updatePullRquest(req) {

  var owner = req.owner;
  var repo = req.repo;
  var number = req.number;
  var head = req.head;
  var base = req.base;
  var title = req.title;
  var body = req.body;

  const result = await request
    .patch('https://api.github.com/repos/' + owner + '/' + repo + '/pulls/' + number)
    .send({ 
      "title": title,
      "body": body,
      "head" : head,
      "base" : base
    })    
  return result.body
}

async function listCommitsOnPullRequest(req) {

  var owner = req.owner;
  var repo = req.repo;
  var number = req.number;

  const result = await request.get('https://api.github.com/repos/' + owner + '/' + repo + '/pulls/' + number + '/commits')
    
  return result.body
}

async function getPullRequestFiles(req) {

  var owner = req.owner;
  var repo = req.repo;
  var number = req.number;

  const result = await request.get('https://api.github.com/repos/' + owner + '/' + repo + '/pulls/' + number + '/files')
    
  return result.body
}

async function getMergedPullRequest(req) {

  var owner = req.owner;
  var repo = req.repo;
  var number = req.number;

  const result = await request.get('https://api.github.com/repos/' + owner + '/' + repo + '/pulls/' + number + '/merge')
    
  return result.body
}

async function mergePullRequest(req) {

  var owner = req.owner;
  var repo = req.repo;
  var number = req.number;

  const result = await request.put('https://api.github.com/repos/' + owner + '/' + repo + '/pulls/' + number + '/merge')

  return result.body
}









async function getIssues(req) {
  const result = await request.get('https://api.github.com/repos/'+ req.query.owner +'/' + req.query.repo + '/issues');
  return result.body;
}

async function getUserIssues(req) {

}

async function orgIssues(req) {

}

async function createIssue(req) {
  try{
    const result = await request
    .post('https://api.github.com/repos/'+ req.query.owner +'/' + req.query.repo + '/issues')
    .send({
      title: req.body.title,
      body: req.body.body
    })
  return result.body;
  }catch(e) {
    console.log(e.text)
  }
}

async function editIssue(req) {
  const result = await request
    .patch('https://api.github.com/repos/'+ req.query.owner +'/' + req.query.repo + '/issues/' + req.query.issue_number)
    .send({
      title: req.body.title,
      body: req.body.body
    })
  return result.body;
}

async function lockIssue(req) {

}

async function unlockIssue(req) {
    
}

async function yourRepo(req){

  const result = await request.get('https://api.github.com/user/repos')

  return result.body
}

async function userRepo(req){
  //https://api.github.com/users/{username}/repos
  const result = await request.get('https://api.github.com/users/'+req.username+'/repos')

  return result.body
}

async function getOrgRepo(req){

  const result = await request.get('https://api.github.com/orgs/' + req.org + '/repos')

  return result.body
}

async function getPublicRepo(req){

  const result = await request.get('https://api.github.com/repositories')

  return result.body
}

async function createRepo(req){

  const result = await request.post('https://api.github.com/user/repos')

  return result.body
}

async function getRepo(req){

  const result = await request.get('https://api.github.com/repos/' + req.owner + '/' + req.repo)

  return result.body
}

async function editRepo(req){

  const result = await request.patch('https://api.github.com/repos/' + req.owner + '/' + req.repo)

  return result.body
}

async function getTopicsRepo(req){

  const result = await request.get('https://api.github.com/repos/' + req.owner + '/' + req.repo + '/topics')

  return result.body
}

async function replaceTopicsRepo(req){

  const result = await request.put('https://api.github.com/repos/' + req.owner + '/' + req.repo + '/topics')

  return result.body
}

async function getContributors(req){

  const result = await request.get('https://api.github.com/repos/' + req.owner + '/' + req.repo + '/contributors')

  return result.body
}

async function getLanguages(req){

  const result = await request.get('https://api.github.com/repos/' + req.owner + '/' + req.repo + '/languages')

  return result.body
}

async function getTeams(req){

  const result = await request.get('https://api.github.com/repos/' + req.owner + '/' + req.repo + '/teams')

  return result.body
}

async function getTags(req){

  const result = await request.get('https://api.github.com/repos/' + req.owner + '/' + req.repo + '/tags')

  return result.body
}

async function deleteRepo(req){

  const result = await request.delete('https://api.github.com/repos/' + req.owner + '/' + req.repo)

  return result.body
}

async function transferRepo(req){

  const result = await request.post('https://api.github.com/repos/' + req.owner + '/' + req.repo + '/transfer')

  return result.body
}

