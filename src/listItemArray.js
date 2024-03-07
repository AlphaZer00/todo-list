const listItemArr = [];

function getListItemArr() {
    return listItemArr;
}

function addListItemToArr(item) {
    listItemArr.push(item);
    return listItemArr;
}

function removeListItemFromArr(item) {
    if (!(listItemArr.includes(item))) {
        return console.log("This item does not exist!");
    } else if (listItemArr.includes(item)) {
        let index = listItemArr.indexOf(item);
        listItemArr.splice(index, 1);
        return listItemArr;
    }
}

function addUniqueID() {
    for(let i=0; i < listItemArr.length; i++) {
        let obj = listItemArr[i];
        obj['id'] = i;
    }
    return listItemArr;
}

export {getListItemArr, addListItemToArr, removeListItemFromArr, addUniqueID, listItemArr}