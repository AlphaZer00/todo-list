const projectList = [];

function getProjectList() {
    return projectList;
}

function addNewProject(project) {
    projectList.push(project);
    return projectList;
}

function deleteProject(project) {
    if (!(projectList.includes(project))) {
        return console.log("This project does not exist!");
    } else if (projectList.includes(project)) {
        let index = projectList.indexOf(project);
        projectList.splice(index, 1);
        return projectList;
    }
}

export {getProjectList, addNewProject, deleteProject};