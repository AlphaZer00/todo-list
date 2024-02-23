import {getListItemArr, addListItemToArr, removeListItemFromArr, listItemArr} from './listItemArray';

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

function sortListItemsByProject() {
    //create empty object, This object will contain Key:projectGroup, Value: Array of todolist objects that have that projectGroup:
    const projectObjects = {};
    //for every project in list of project (i.e 'fitness' or 'work')
    for (const project of projectList) {
        //Make Array to hold todolist objects with the matching projectGroup
        const projectGroupArray = [];
        //loop through array of all todolist objects
        for (let i = 0; i < listItemArr.length; i++) {
            //if todolist object's projectGroup value is equivalent to projectGroup name
            if (listItemArr[i].projectGroup == project) {
                //Add that object to the projectGroupArray
                projectGroupArray.push(listItemArr[i]);
                //Create key:value pair of project: Array of objects with that projectGroup
                projectObjects[project] = projectGroupArray;
            }
        }
    }
    return console.log(projectObjects);
}


export {getProjectList, addNewProject, deleteProject, sortListItemsByProject};