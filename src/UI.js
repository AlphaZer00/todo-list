import {modifyTitle, modifyDescription, modifyDueDate, modifyPriority, modifyCheckBox, modifyProjectGroup} from './listItemModifier';
import {getProjectList, addNewProject, deleteProject, sortListItemsByProject} from './projectManager';
import {getListItemArr, addListItemToArr, removeListItemFromArr, listItemArr, addUniqueID} from './listItemArray';
import createListItem from './listItemFactory';
import {format} from "date-fns";
import {removeObjFromStorage, storeObj, getKeyArrFromStorage} from './storage';

function displayProjectList() {
    //copy array from projectList
    let str = localStorage.getItem('projectArray');
    const arr = str.split(',');
    
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

function displayNewProject(project) {
    const projectArea = document.querySelector('.project-area');
    const projectDiv = document.createElement('div');

    projectDiv.innerText = project;
    projectDiv.classList.add('project-section', `${project}`);
    projectArea.append(projectDiv);
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
    const deleteBtn = document.createElement('button');
    
    obj.checkBox === 'true' ? checkBox.checked = true : checkBox.checked = false;
    title.textContent = obj.title;
    desc.textContent = obj.description;
    dueDate.textContent = handleDate(obj.dueDate);
    priority.textContent = obj.priority;
    editBtn.textContent = 'Edit';
    deleteBtn.textContent = 'Delete';

    checkBox.classList.add('item-checkbox');
    title.classList.add('item-title');
    desc.classList.add('item-desc');
    dueDate.classList.add('item-due-date');
    priority.classList.add('item-priority');
    editBtn.classList.add('edit-task-modal-btn');
    deleteBtn.classList.add('delete-btn');
    
    itemDiv.append(checkBox, title, desc, dueDate, priority, editBtn, deleteBtn);
    parent.append(itemDiv);
    handleEditModalButtons();
    handleItemDeleteBtn(itemDiv);
    handleCheckBox(itemDiv);
}

function setModalProjectSelectors() {
    const arr = getProjectList();
    const selector = document.getElementById('itemProjectSelector');
    const editSelector = document.getElementById('editItemProjectSelector');
    selector.innerHTML = '';
    editSelector.innerHTML = '';
	
    for (const index in arr) {
        selector.options[selector.options.length] = new Option(arr[index], arr[index]);
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

function handleProjectModalButtons() {
    const projectModal = document.querySelector('.add-project-modal');
    const projectModalBtn = document.querySelector('.add-project-btn');
    const closeProjectModalBtn = document.getElementById('add-project-close-btn');

    closeProjectModalBtn.addEventListener('click', () => projectModal.close());
    projectModalBtn.addEventListener('click', () => projectModal.showModal());

}

function handleItemDeleteBtn(div) {
    const deleteBtn = div.querySelector('.delete-btn');
    
    deleteBtn.addEventListener('click', (e) => {
        if (window.confirm("This will permanently delete this item, are you sure?")) {
            e.target.parentNode.remove();
            removeObjFromStorage(e.target.parentNode.getAttribute('data-id'));
            let obj = listItemArr[e.target.parentNode.getAttribute('data-id')];
            removeListItemFromArr(obj);
        } else {
            return;
        }
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
    dueDate.value = formatISODate(item.querySelector('.item-due-date').textContent);
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
        
        form.reset();
        addListItemToArr(newItem);
        addUniqueID();
        renderItemToDom(newItem, newItem.projectGroup);
        storeObj(newItem.id, JSON.stringify(newItem));
    })
}

function createProjectFromForm() {
    const form = document.querySelector('.add-project-form');
    const modal = document.querySelector('.add-project-modal');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const obj = Object.fromEntries(formData);
        const arr = getProjectList();

        if (arr.includes(obj.project)) {
            return console.log('Err; Already exists');
        }
        addNewProject(obj.project);
        displayNewProject(obj.project);
        storeObj('projectArray', getProjectList());
        form.reset();
        modal.close();
        setModalProjectSelectors();
    })
}

function updateListItemFromFormInput() {
    const form = document.querySelector('.edit-task-form');
    const submitBtn = document.getElementById('edit-modal-submit-btn');

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const modal = document.querySelector('.edit-task-modal');
        const editFormData = new FormData(form);
        const newObj = Object.fromEntries(editFormData);
        const oldObj = listItemArr[newObj.id];
        let oldIndex = listItemArr.indexOf(oldObj);

        if (oldIndex !== -1 && !(oldObj == newObj)) {
            listItemArr[oldIndex] = newObj;
        }

        const oldObjDom = document.querySelector(`[data-id='${newObj.id}']`);
        oldObjDom.remove();
        removeObjFromStorage(oldObj.id);
        storeObj(newObj.id, JSON.stringify(newObj));
        renderItemToDom(newObj, newObj.projectGroup);

        modal.close();
        form.reset();
    })
}

function handleDate(inputDate) {
    return format(new Date(inputDate), 'MM/dd/yyyy hh:mm a')
}

function formatISODate(inputDate) {
    return format(new Date(inputDate), "yyyy-MM-dd'T'HH:mm:ss");
}

function loadItemsFromStorage() {
    window.addEventListener('load', () => {
        const keyArr = getKeyArrFromStorage();
        displayProjectList();
        keyArr.forEach((key) => {
            const item = JSON.parse(localStorage.getItem(key));
            addListItemToArr(item);
            renderItemToDom(item, item.projectGroup);
        });
    })
}

export {displayProjectList, renderItemToDom, setModalProjectSelectors, handleModalButtons, createListItemFromFormInput, loadEditModalValues, updateListItemFromFormInput, loadItemsFromStorage, handleProjectModalButtons, createProjectFromForm};