import _ from 'lodash';
import './style.css';
import {sortListItemsByProject} from './projectManager';
import {setModalProjectSelectors, handleModalButtons, createListItemFromFormInput, updateListItemFromFormInput, loadItemsFromStorage, handleAddProjectModalButtons, createProjectFromForm, handleRemoveProjectModalButtons, handleProjectDeleteButton} from './UI';

window.addEventListener('load', () => loadItemsFromStorage());

handleModalButtons();
handleRemoveProjectModalButtons();
handleAddProjectModalButtons();
handleProjectDeleteButton();

sortListItemsByProject();

setModalProjectSelectors();

createListItemFromFormInput();
updateListItemFromFormInput();

createProjectFromForm();
console.log(JSON.parse(localStorage.getItem('itemList')));