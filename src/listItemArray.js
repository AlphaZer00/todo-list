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

export {getListItemArr, addListItemToArr, removeListItemFromArr, listItemArr}