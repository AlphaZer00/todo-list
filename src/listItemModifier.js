const modifyTitle = (listItem, newValue) => {
    return listItem.title=newValue;
}
const modifyDescription = (listItem, newValue) => {
    return listItem.description=newValue;
}
const modifyDueDate = (listItem, newValue) => {
    return listItem.dueDate=newValue;
}
const modifyPriority = (listItem, newValue) => {
    return listItem.priority=newValue;
}
const modifyCheckBox = (listItem, newValue) => {
    return listItem.checkBox=newValue;
}
const modifyProjectGroup = (listItem, newValue) => {
    return listItem.projectGroup=newValue;
}

export {modifyTitle, modifyDescription, modifyDueDate, modifyPriority, modifyCheckBox, modifyProjectGroup};