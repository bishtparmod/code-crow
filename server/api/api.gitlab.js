const request = require('superagent');
const config = require('../config/config');

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

    // MR

    getMergeRequests,
    createMergeRequest,
    updateMergeRequest,
    deleteMergeRequest,

    // Issues,

    getIssues,
    newIssue,
    updateIssue,
    deleteIssue,

    // Repositories

    getRepos,

    // Wikis

    getWikiPages,
    createWikiPage,
    editWikiPage,
    deleteWikiPage,
    
}

async function getUser(req){
    const result = await request.get('https://gitlab.com/api/v4/users')
    .send({private_token: config.gitlab.accessToken})
    .on('error', function(err){
        console.log(err)
    })
    return result.body
}

async function createUser(req){
    try {
        const result = await request
            .post('https://gitlab.com/api/v4/users')
            .send({
                email: req.email,
                username: req.username,
                password: req.password,
                name: req.name,
                private_token: config.gitlab.accessToken
            })
        return result.body
    }
    catch(e){
        console.log(e)
    }
}

async function editUser(req){
    try {
        const result = await request
            .put('https://gitlab.com/api/v4/users')
            .send({
                email: req.email,
                username: req.username,
                password: req.password,
                name: req.name,
                private_token: config.gitlab.accessToken
            })
        return result.body
    }
    catch(e){
        console.log(e)
    }
}

async function getGroup(req){
    const result = await request
        .get('https://gitlab.com/api/v4/groups')
        .send({private_token: config.gitlab.accessToken})
    .on('error', function(err){
        console.log(err)
    })
    return result.body
}

async function newGroup(req){
    try {
        const result = await request
            .post('https://gitlab.com/api/v4/groups')
            .send({
                name: req.body.name,
                path: req.body.path,
                private_token: config.gitlab.accessToken
            })
        return result.body
    }
    catch(e){
        console.log(e)
    }
}

async function updateGroup(req){
    try {
        const result = await request
            .put('https://gitlab.com/api/v4/groups/' + req.query.id)
            .send({
                name: req.body.name,
                path: req.body.path,
                private_token: config.gitlab.accessToken
            })
        return result.body
    }
    catch(e){
        console.log(e)
    }
}

async function deleteGroup(req){
    try {
        const result = await request
            .delete('https://gitlab.com/api/v4/groups/' + req.query.id)
            .send({
                private_token: config.gitlab.accessToken
            })
        return result.body
    }
    catch(e){
        console.log(e)
    }
}

async function getMergeRequests(req){
    const result = await request.get('https://gitlab.com/api/v4/merge_requests')
    .send({private_token: config.gitlab.accessToken})
    .on('error', function(err){
        console.log(err)
    })
    return result.body
}

async function createMergeRequest(req){
    try {
        const result = await request
            .post('https://gitlab.com/api/v4/projects/' + req.id + '/merge_requests')
            .send({
                source_branch: req.source_branch,
                target_branch: req.target_branch,
                title: req.title,
                private_token: config.gitlab.accessToken
            })
        return result.body
    }
    catch(e){
        console.log(e)
    }
}

async function updateMergeRequest(req){
    try {
        const result = await request
            .put('https://gitlab.com/api/v4/projects/' + req.id + '/merge_requests')
            .send({
                source_branch: req.source_branch,
                target_branch: req.target_branch,
                title: req.title,
                private_token: config.gitlab.accessToken
            })
        return result.body
    }
    catch(e){
        console.log(e)
    }
}

async function deleteMergeRequest(req){
    try {
        const result = await request
            .put('https://gitlab.com/api/v4/projects/' + req.id + '/merge_requests/' + req.merge_request_iid)
            .send({
                private_token: config.gitlab.accessToken
            })
        return result.body
    }
    catch(e){
        console.log(e)
    }
}

async function getIssues(req){
    const result = await request.get('https://gitlab.com/api/v4/issues')
    .send({private_token: config.gitlab.accessToken})
    .on('error', function(err){
        console.log(err)
    })
    return result.body
}

async function newIssue(req){
    console.log(req.body, req.query)
    try {
        const result = await request
            .post('https://gitlab.com/api/v4/projects/'+ req.query.id +'/issues')
            .send({
                title: req.body.title,
                private_token: config.gitlab.accessToken
            })
        return result.body
    }
    catch(e){
        console.log(e)
    }
}

async function updateIssue(req){
    try {
        const result = await request
            .put('https://gitlab.com/api/v4/projects/'+ req.query.id +'/issues/'+ req.query.iid)
            .send({
                description: req.body.description,
                private_token: config.gitlab.accessToken
            })
        return result.body
    }
    catch(e){
        console.log(e)
    }
}

async function deleteIssue(req){
    try {
        const result = await request
            .delete('https://gitlab.com/api/v4/projects/'+ req.query.id +'/issues/'+ req.query.iid)
            .send({
                private_token: config.gitlab.accessToken
            })
        return result.body
    }
    catch(e){
        console.log(e)
    }
}

async function getRepos(req){
    console.log(req.id)
    // const result = await request.get('https://gitlab.com/api/v4/projects/'+ req.id +'/repository/tree')
    const result = await request.get('https://gitlab.com/api/v4/projects/')
    // .send({private_token: config.gitlab.accessToken})
    .on('error', function(err){
        console.log(">>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<",err)
    })
    return result.body
}

async function getWikiPages(req){
    const result = await request.get('https://gitlab.com/api/v4/projects/'+ req.id +'/wikis')
    .send({private_token: config.gitlab.accessToken})
    .on('error', function(err){
        console.log(err)
    })
    return result.body
}


    // Wikis

async function createWikiPage(req) {
    console.log(req.body, req.query)
    try {
        const result = await request
            .post('https://gitlab.com/api/v4/projects/'+ req.query.id +'/wikis')
            .send({
                title: req.body.title,
                content: req.body.content,
                private_token: config.gitlab.accessToken
            })
        return result.body
    }
    catch(e){
        console.log(e)
    }
}
async function editWikiPage(req) {
    try {
        const result = await request
            .put('https://gitlab.com/api/v4/projects/'+ req.query.id +'/wikis/'+ req.query.slug)
            .send({
                content: req.body.content,
                title: req.body.title,
                private_token: config.gitlab.accessToken
            })
        return result.body
    }
    catch(e){
        console.log(e)
    }
}
async function deleteWikiPage(req) {
    try {
        const result = await request
            .delete('https://gitlab.com/api/v4/projects/'+ req.query.id +'/wikis/'+ req.query.slug)
            .send({
                private_token: config.gitlab.accessToken
            })
        return result.body
    }
    catch(e){
        console.log(e)
    }
}
