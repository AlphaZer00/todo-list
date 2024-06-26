function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            // everything except Firefox
            (e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === "QuotaExceededError" ||
            // Firefox
            e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
        );
    }
}

function storeObj(id, obj) {
    if (storageAvailable('localStorage')) {
        localStorage.setItem(id, obj);
    }
}

function removeObjFromStorage(key) {
    localStorage.removeItem(key);
}

function getKeyArrFromStorage() {
    if (storageAvailable('localStorage')) {
        const keyArr = [];
        for (let i = 0; i < localStorage.length; i++) {
            if (isNaN(localStorage.key(i)) && isNaN(parseFloat(localStorage.key(i)))) continue;
            let key = localStorage.key(i);
            keyArr.push(key);
        }
        return keyArr;
    }
}

export { storeObj, removeObjFromStorage, getKeyArrFromStorage }