import _ from 'lodash';
import './style.css';
import createListItem from './listItemFactory';
import {modifyTitle, modifyDescription, modifyDueDate, modifyPriority, modifyCheckBox, modifyProjectGroup} from './listItemModifier';
import {getProjectList, addNewProject, deleteProject, sortListItemsByProject} from './projectManager';
import {getListItemArr, addListItemToArr, removeListItemFromArr, listItemArr} from './listItemArray';
import displayProjectList from './UI';


let todo1 = createListItem('run1', 'run a mile', '2/22/24', "1", false, 'fitness');
let todo2 = createListItem('run2', 'run a mile', '2/22/24', "1", false, 'work');
let todo3 = createListItem('run3', 'run a mile', '2/22/24', "1", false, 'home');
let todo4 = createListItem('run4', 'run a mile', '2/22/24', "1", false, 'home');


addListItemToArr(todo1);
addListItemToArr(todo2);
addListItemToArr(todo3);
addListItemToArr(todo4);

addNewProject('fitness');
addNewProject('work');
addNewProject('home');
sortListItemsByProject();

displayProjectList();