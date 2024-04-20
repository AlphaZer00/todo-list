import {getProjectList, addNewProject, deleteProject, sortListItemsByProject, projectList, updateProjectListFromStorage} from './projectManager';
import {getListItemArr, addListItemToArr, removeListItemFromArr, listItemArr, addUniqueID, updateItemArrFromStorage} from './listItemArray';
import createListItem from './listItemFactory';
import {format} from "date-fns";
import {removeObjFromStorage, storeObj, getKeyArrFromStorage} from './storage';

function displayProjectList() {
    //copy array from projectList
    let arr = getProjectList();
    //if projectArray is stored in localStorage then set that as arr
    if (localStorage.getItem('projectArray')) {
        arr = JSON.parse(localStorage.getItem('projectArray'));
    }
    
    //Get reference to project-area div
    const projectArea = document.querySelector('.project-area');

    //Clear projectArea
    projectArea.innerHTML = '';
    
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
    const completedArea = document.querySelector('.completed-area');

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
    const buttonContainer = document.createElement('div');
    const infoContainer = document.createElement('div');
    
    obj.checkBox === true ? checkBox.checked = true : checkBox.checked = false;
    title.textContent = obj.title;
    if (obj.description) {
        desc.textContent = obj.description;
    }
    if (obj.duedate) {
        dueDate.textContent = handleDate(obj.dueDate);
    }
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
    buttonContainer.classList.add('btn-container')
    infoContainer.classList.add('info-container')
    
    buttonContainer.append(editBtn, deleteBtn);
    infoContainer.append(title, desc, dueDate, priority,);
    itemDiv.append(checkBox, infoContainer, buttonContainer);

    if (obj.checkBox == 'true' || obj.checkBox == true) {
        completedArea.append(itemDiv);
    } else if (obj.checkBox == 'false' || obj.checkBox == false) {
        parent.append(itemDiv);
    }

    handleEditModalButtons();
    handleItemDeleteBtn(itemDiv);
    handleCheckBox(itemDiv);
}

function setModalProjectSelectors() {
    let arr = [];
    if (localStorage.getItem('projectArray')) {
        arr = JSON.parse(localStorage.getItem("projectArray"));
    }

    const selector = document.getElementById('itemProjectSelector');
    const editSelector = document.getElementById('editItemProjectSelector');
    const removeSelector = document.getElementById('projectSelector');
    selector.innerHTML = '';
    editSelector.innerHTML = '';
    removeSelector.innerHTML = '';
	
    for (const index in arr) {
        selector.options[selector.options.length] = new Option(arr[index], arr[index]);
    }

	for (const index in arr) {
		editSelector.options[editSelector.options.length] = new Option(arr[index], arr[index]);
	}

	for (const index in arr) {
		removeSelector.options[removeSelector.options.length] = new Option(arr[index], arr[index]);
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

function handleAddProjectModalButtons() {
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
            e.target.parentNode.parentNode.remove();
            let obj = listItemArr[e.target.parentNode.parentNode.getAttribute('data-id')];
            removeObjFromStorage(e.target.parentNode.parentNode.getAttribute('data-id'));
            removeListItemFromArr(obj);
            const itemArr = getListItemArr();
            storeObj('itemList', JSON.stringify(itemArr));
        } else {
            return;
        }
    })
}

function handleProjectDeleteButton() {
    const deleteBtn = document.querySelector('.submit-remove-project-btn');
    const selector = document.getElementById('projectSelector');

    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const project = selector.value;
        for (let i = 0; i < listItemArr.length; i++) {
            if (listItemArr[i].projectGroup === project) {
                const itemID = listItemArr[i].id;
                removeObjFromStorage(itemID);
                listItemArr.splice(i, 1);
            }
        }
        deleteProject(project);
        const projArr = getProjectList();
        storeObj('projectArray', JSON.stringify(projArr));
        setModalProjectSelectors();
        displayProjectList();
        loadItemsFromStorage();
    })
}

function handleRemoveProjectModalButtons() {
    const deleteBtn = document.querySelector('.delete-project-btn');
    const closeBtn = document.querySelector('.close-remove-project-modal-btn');
    const modal = document.querySelector('.remove-project-modal');

    deleteBtn.addEventListener('click', () => modal.showModal());
    closeBtn.addEventListener('click', () => modal.close());
}

function handleCheckBox(div) {
    const checkBox = div.querySelector('.item-checkbox');
    const completed = document.querySelector('.completed-area');
    checkBox.addEventListener('change', (e) => {
        if (checkBox.checked === true) {
            let index = e.target.parentNode.getAttribute('data-id');
            listItemArr[index].checkBox = true;
            console.log(listItemArr[index]);
            storeObj(listItemArr[index].id, JSON.stringify(listItemArr[index]));
            completed.append(e.target.parentNode);
        }
        if (checkBox.checked === false) {
            let index = e.target.parentNode.getAttribute('data-id');
            const project = listItemArr[index].projectGroup;
            const projectSection = document.querySelector(`.${project}`);
            listItemArr[index].checkBox = false;
            storeObj(listItemArr[index].id, JSON.stringify(listItemArr[index]));
            projectSection.append(e.target.parentNode);
        }
    })
}

function loadEditModalValues(e) {
    const editModal = document.querySelector('.edit-task-modal');
    const item = e.target.parentNode.parentNode;
    const itemId = item.getAttribute('data-id');
    const infoContainer = item.querySelector('.info-container');

    const title = document.getElementById('editItemTitle');
    const desc = document.getElementById('editItemDesc');
    const dueDate = document.getElementById('editItemDueDate');
    const priority = document.getElementById('editItemPriority');
    const project = document.getElementById('editItemProjectSelector');
    const projectOptions = project.querySelectorAll('option');	
    const itemIdInput = document.getElementById('itemId');

    title.value = infoContainer.querySelector('.item-title').textContent;
    if (infoContainer.querySelector('.item-desc').textContent) {
        desc.value = infoContainer.querySelector('.item-desc').textContent;
    }
    if (infoContainer.querySelector('.item-due-date').textContent) {
        dueDate.value = formatISODate(infoContainer.querySelector('.item-due-date').textContent);
    }
    priority.value = infoContainer.querySelector('.item-priority').textContent;
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
    	const newItem = createListItem(false, obj.title, obj.description, obj.dueDate, obj.priority, obj.projectGroup);
        
        form.reset();
        addListItemToArr(newItem);
        addUniqueID();
        renderItemToDom(newItem, newItem.projectGroup);
        storeObj(newItem.id, JSON.stringify(newItem));
        const itemArr = getListItemArr();
        storeObj('itemList', JSON.stringify(itemArr));
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

        const message = document.querySelector('.ap-message');
        if (arr.includes(obj.project)) {
            return message.textContent = 'This project already exists, please use a unique name'
        }
        let str = obj.project
        const regex = new RegExp(/[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/);
        const regex2 = new RegExp(/^[0-9].*/);
        if (regex2.test(str)) {
            return message.textContent = 'Project name cannot start with a digit'
        }
        if (regex.test(str)) {
            return message.textContent = 'No special characters allowed'
        }

        addNewProject(obj.project);
        displayNewProject(obj.project);
        const projArr = getProjectList();
        storeObj('projectArray', JSON.stringify(projArr));
        updateProjectListFromStorage();
        setModalProjectSelectors();
        form.reset();
        modal.close();
    })
}

function updateListItemFromFormInput() {
    const form = document.querySelector('.edit-task-form');
    const submitBtn = document.getElementById('edit-modal-submit-btn');

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const checkBox = document.getElementById('editItemCheckBox');
        const modal = document.querySelector('.edit-task-modal');
        const editFormData = new FormData(form);
        const newObj = Object.fromEntries(editFormData);
        newObj.id = Number(newObj.id);
        if (checkBox.checked === true) {
            newObj.checkBox = true;
        } else if (checkBox.checked === false) {
            newObj.checkBox = false;
        }

        const oldObj = listItemArr[newObj.id];
        let oldIndex = listItemArr.indexOf(oldObj);

        if (oldIndex !== -1 && !(oldObj == newObj)) {
            listItemArr[oldIndex] = newObj;
        }

        const oldObjDom = document.querySelector(`[data-id='${newObj.id}']`);
        oldObjDom.remove();
        removeObjFromStorage(oldObj.id);
        storeObj(newObj.id, JSON.stringify(newObj));
        storeObj('itemList', JSON.stringify(getListItemArr()));
        console.log(newObj);
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
    const keyArr = getKeyArrFromStorage();
    updateItemArrFromStorage();
    updateProjectListFromStorage();
    displayProjectList();
    keyArr.forEach((key) => {
        const item = JSON.parse(localStorage.getItem(key));
        renderItemToDom(item, item.projectGroup);
    });
}

export {displayProjectList, renderItemToDom, setModalProjectSelectors, handleModalButtons, createListItemFromFormInput, loadEditModalValues, updateListItemFromFormInput, loadItemsFromStorage, handleAddProjectModalButtons, createProjectFromForm, handleRemoveProjectModalButtons, handleProjectDeleteButton,};