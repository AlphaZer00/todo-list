import _ from 'lodash';
import './style.css';
import createListItem from './listItemFactory';
import {getProjectList, addNewProject, deleteProject, sortListItemsByProject} from './projectManager';
import {getListItemArr, addListItemToArr, removeListItemFromArr, addUniqueID, listItemArr} from './listItemArray';
import {displayProjectList, setModalProjectSelectors, handleModalButtons, createListItemFromFormInput, loadEditModalValues, updateListItemFromFormInput, loadItemsFromStorage, handleAddProjectModalButtons, createProjectFromForm, handleRemoveProjectModalButtons, handleProjectDeleteButton} from './UI';
import { storeObj, removeObjFromStorage, getKeyArrFromStorage } from './storage';

addNewProject('fitness');
addNewProject('work');
addNewProject('home');


handleModalButtons();
handleRemoveProjectModalButtons();
handleAddProjectModalButtons();
handleProjectDeleteButton();

sortListItemsByProject();

setModalProjectSelectors();

createListItemFromFormInput();
updateListItemFromFormInput();

createProjectFromForm();

window.addEventListener('load', () => loadItemsFromStorage());