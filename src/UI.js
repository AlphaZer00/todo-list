import {modifyTitle, modifyDescription, modifyDueDate, modifyPriority, modifyCheckBox, modifyProjectGroup} from './listItemModifier';
import {getProjectList, addNewProject, deleteProject, sortListItemsByProject} from './projectManager';
import {getListItemArr, addListItemToArr, removeListItemFromArr, listItemArr} from './listItemArray';

function displayProjectList() {
    //copy array from projectList
    const arr = getProjectList();
    //create new div and add class
    const projectArea = document.createElement('div');
    projectArea.classList.add('project-area');

    //for every project within the array
    for (const project of arr) {
        //create a div
        const projectDiv = document.createElement('div');
        //Set div text to project name
        projectDiv.innerText = project;
        //add class
        projectDiv.classList.add('project-section', `${project}`);
        //append div to project container div
        projectArea.append(projectDiv);
    }
    //append project div to html body
    document.body.append(projectArea);
}

function renderItemToDom(obj, project) {
    const projectArea = document.querySelector('.project-area');
    const parent = projectArea.querySelector(`.${project}`);

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('todo-item');

    const title = document.createElement('div');
    const desc = document.createElement('div');
    const dueDate = document.createElement('div');
    const priority = document.createElement('div');
    const checkBox = document.createElement('div');
    
    title.textContent = obj.title;
    desc.textContent = obj.description;
    dueDate.textContent = obj.dueDate;
    priority.textContent = obj.priority;
    checkBox.textContent = obj.checkBox;

    parent.append(title, desc, dueDate, priority, checkBox);
}

export {displayProjectList, renderItemToDom};