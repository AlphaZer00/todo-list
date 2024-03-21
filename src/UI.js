import {modifyTitle, modifyDescription, modifyDueDate, modifyPriority, modifyCheckBox, modifyProjectGroup} from './listItemModifier';
import {getProjectList, addNewProject, deleteProject, sortListItemsByProject} from './projectManager';
import {getListItemArr, addListItemToArr, removeListItemFromArr, listItemArr, addUniqueID} from './listItemArray';
import createListItem from './listItemFactory';

function displayProjectList() {
    //copy array from projectList
    const arr = getProjectList();
    
    //Get reference to project-area div
    const projectArea = document.querySelector('.project-area');
    
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
}

function renderItemToDom(obj, project) {
    const projectArea = document.querySelector('.project-area');
    const parent = projectArea.querySelector(`.${project}`);

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('todo-item');
    itemDiv.setAttribute('data-id', obj.id);

    const checkBox = document.createElement('input');
    checkBox.setAttribute('type', 'checkbox');
    const title = document.createElement('div');
    const desc = document.createElement('div');
    const dueDate = document.createElement('div');
    const priority = document.createElement('div');
    const editBtn = document.createElement('button');
    
    obj.checkBox === 'true' ? checkBox.checked = true : checkBox.checked = false;
    title.textContent = obj.title;
    desc.textContent = obj.description;
    dueDate.textContent = obj.dueDate;
    priority.textContent = obj.priority;
    editBtn.textContent = 'Edit';

    checkBox.classList.add('item-checkbox');
    title.classList.add('item-title');
    desc.classList.add('item-desc');
    dueDate.classList.add('item-due-date');
    priority.classList.add('item-priority');
    editBtn.classList.add('edit-task-modal-btn');
    
    itemDiv.append(checkBox, title, desc, dueDate, priority,  editBtn);
    parent.append(itemDiv);
    handleEditModalButtons();
    handleCheckBox(itemDiv);
}

function setModalProjectSelectors() {
    const arr = getProjectList();
    const selector = document.getElementById('itemProjectSelector')
    const editSelector = document.getElementById('editItemProjectSelector')
    for (const index in arr) {
		selector.options[selector.options.length] = new Option(arr[index], arr[index] );
    }
	for (const index in arr) {
		editSelector.options[editSelector.options.length] = new Option(arr[index], arr[index]);
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
        el.addEventListener('click', (e) => {
            loadEditModalValues(e);
            editModal.showModal();
        })
    })
    
    closeEditTaskModalBtn.addEventListener('click', () => {
        editModal.close();
    })
}

function handleCheckBox(div) {
    const checkBox = div.querySelector('.item-checkbox');
    const completed = document.querySelector('.completed-area');
    checkBox.addEventListener('change', (e) => {
        if (checkBox.checked === true) {
            completed.append(e.target.parentNode);
        }
        if (checkBox.checked === false) {
            const project = listItemArr[e.target.parentNode.getAttribute('data-id')].projectGroup;
            const projectSection = document.querySelector(`.${project}`);
            projectSection.append(e.target.parentNode);
        }
    })
}

function loadEditModalValues(e) {
    const editModal = document.querySelector('.edit-task-modal');
    const item = e.target.parentNode;
    const itemId = item.getAttribute('data-id');

    const title = document.getElementById('editItemTitle');
    const desc = document.getElementById('editItemDesc');
    const dueDate = document.getElementById('editItemDueDate');
    const priority = document.getElementById('editItemPriority');
    const project = document.getElementById('editItemProjectSelector');
    const projectOptions = project.querySelectorAll('option');	
    const itemIdInput = document.getElementById('itemId');

    title.value = item.querySelector('.item-title').textContent;
    desc.value = item.querySelector('.item-desc').textContent;
    dueDate.value = item.querySelector('.item-due-date').textContent;
    priority.value = item.querySelector('.item-priority').textContent;
	projectOptions.forEach((el) => {
        if (el.value === listItemArr[itemId].projectGroup) {
            project.value = el.value
        }
    })
    itemIdInput.value = itemId;
}

function createListItemFromFormInput() {
    const form = document.querySelector('.create-task-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const modal = document.querySelector('.create-task-modal');
        modal.close();
        const formData = new FormData(form);
        const obj = Object.fromEntries(formData);
        
    	const newItem = createListItem(false, obj.title, obj.description, obj.dueDate, obj.priority,  obj.projectGroup);

        addListItemToArr(newItem);
        addUniqueID();
        renderItemToDom(newItem, newItem.projectGroup);
    })
}

function updateListItemFromFormInput() {
    const form = document.querySelector('.edit-task-form');
    const submitBtn = document.getElementById('edit-modal-submit-btn');

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const editFormData = new FormData(form);
        const newObj = Object.fromEntries(editFormData);
        console.table(newObj);
        console.log(listItemArr[newObj.id]);
        const oldObj = listItemArr[newObj.id];
        console.table(listItemArr);

        let oldIndex = listItemArr.indexOf(oldObj);

        if (oldIndex !== -1 && !(oldObj == newObj)) {
            listItemArr[oldIndex] = newObj;
        }
        console.table(listItemArr);

        displayProjectList();
        sortListItemsByProject();
    })
}

export {displayProjectList, renderItemToDom, setModalProjectSelectors, handleModalButtons, createListItemFromFormInput, loadEditModalValues, updateListItemFromFormInput};