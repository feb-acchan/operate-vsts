let vsts = require('vso-node-api');

/**
 * VSTSとの連携を確立させる
 */
function connect() {
    // your collection url
    let collectionUrl = process.env.URL;

    // ideally from config
    let token = process.env.PERSONAL_TOKEN;

    let authHandler = vsts.getPersonalAccessTokenHandler(token); 
    return connect = new vsts.WebApi(collectionUrl, authHandler); 
}

/**
 * プロジェクトを取得する
 * @param {vso-node-api/WebApi} connect 
 */
function getProjects(connect){
    core = connect.getCoreApi();
    projects = core.getProjects();
    return projects
}

/**
 * PullRequestを取得する
 * @param {vso-node-api/WebApi} connect 
 * @param {string} project_name 
 */
function getPullRequests(connect, project_name){
    git = connect.getGitApi();
    search_criteria = {"status": 1}
    pullrequests = git.getPullRequestsByProject(project_name, search_criteria);
    return pullrequests
}

/**
 * Backlogを取得する
 * @param {vso-node-api/WebApi} connect 
 * @param {string} project_name 
 */
function createWorkItem(connect, project_name){
    workitem = connect.getWorkItemTrackingApi();
    json = [{"op": "add", "path": "/fields/System.Title", "value": "emergency"}]
    result = workitem.createWorkItem(null, json, project_name, "Product Backlog Item");
    return result
}

async function run(){
    console.log("--start--")
    result = await connect();
    projects = await getProjects(result);
    console.log('project', projects[0].name);
    pullrequests = await getPullRequests(result, projects[0].name)
    console.log('pullrequest', pullrequests[0].title);
    workitem = await createWorkItem(result, projects[0].name)
    console.log("id", workitem.id);
    console.log("--end--")
}

run()
