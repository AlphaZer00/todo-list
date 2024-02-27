import {modifyTitle, modifyDescription, modifyDueDate, modifyPriority, modifyCheckBox, modifyProjectGroup} from './listItemModifier';
import {getProjectList, addNewProject, deleteProject, sortListItemsByProject} from './projectManager';
import {getListItemArr, addListItemToArr, removeListItemFromArr, listItemArr} from './listItemArray';

function displayProjectList() {
    const arr = getProjectList();
    const projectArea = document.createElement('div');
    projectArea.classList.add('project-area');

    for (const project of arr) {
        const projectDiv = document.createElement('div');
        projectDiv.innerText = project;
        projectDiv.classList.add('project-section');
        projectArea.append(projectDiv);
    }

    document.body.append(projectArea);
}

//show Todolist items inside the project-section divs
function displayProjectItems() {
    const projectArea = document.querySelector('project-area');
    projectArea
}

export default displayProjectList;