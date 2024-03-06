import {modifyTitle, modifyDescription, modifyDueDate, modifyPriority, modifyCheckBox, modifyProjectGroup} from './listItemModifier';
import {getProjectList, addNewProject, deleteProject, sortListItemsByProject} from './projectManager';
import {getListItemArr, addListItemToArr, removeListItemFromArr, listItemArr} from './listItemArray';
import createListItem from './listItemFactory';

function displayProjectList() {
    //copy array from projectList
    const arr = getProjectList();
    
    //if projectArea div exists remove it
    if (document.querySelector('.project-area')) {
        document.querySelector('.project-area').remove();
    }
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
    if(document.querySelector('.project-area')) {
       // document.querySelector('.project-area').innerHTML;
    }

    const projectArea = document.querySelector('.project-area');
    const parent = projectArea.querySelector(`.${project}`);

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('todo-item');

    const title = document.createElement('div');
    const desc = document.createElement('div');
    const dueDate = document.createElement('div');
    const priority = document.createElement('div');
    const checkBox = document.createElement('div');
    const editBtn = document.createElement('button');
    
    title.textContent = obj.title;
    desc.textContent = obj.description;
    dueDate.textContent = obj.dueDate;
    priority.textContent = obj.priority;
    checkBox.textContent = obj.checkBox;
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-task-modal-btn');
    
    itemDiv.append(title, desc, dueDate, priority, checkBox, editBtn);
    parent.append(itemDiv);
    handleEditModalButtons();
}

function setModalProjectSelector() {
    const arr = getProjectList();
    const selector = document.getElementById('itemProjectSelector')
    for (const index in arr) {
        selector.options[selector.options.length] = new Option(arr[index]);
    }
}

function handleModalButtons() {
    const createModal = document.querySelector('.create-task-modal');
    const createTaskModalBtn = document.querySelector('.create-task-modal-btn');
    const closeTaskModalBtn = document.querySelector('.modal-close-btn');
  
    closeTaskModalBtn.addEventListener('click', () => {
        createModal.close();
    });
    
    createTaskModalBtn.addEventListener('click', () => {
        createModal.showModal();
    })
}

function handleEditModalButtons() {
    const editModal = document.querySelector('.edit-task-modal');
    const editTaskModalBtn = document.querySelectorAll('.edit-task-modal-btn');
    const closeEditTaskModalBtn = document.querySelector('.edit-modal-close-btn');

    editTaskModalBtn.forEach(function(el) {
        el.addEventListener('click', () => {
            editModal.showModal();
        })
    })
    
    closeEditTaskModalBtn.addEventListener('click', () => {
        editModal.close();
    })
}

function createListItemFromFormInput() {
    const form = document.querySelector('.create-task-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const modal = document.querySelector('.create-task-modal');
        modal.close();
        const formData = new FormData(form);
        const obj = Object.fromEntries(formData);

        const newItem = createListItem(obj.itemTitle, obj.itemDesc, obj.itemDueDate, obj.itemPriority, false, obj.itemProject);

        addListItemToArr(newItem);
        displayProjectList();
        sortListItemsByProject();
    })
}

export {displayProjectList, renderItemToDom, setModalProjectSelector, handleModalButtons, createListItemFromFormInput};