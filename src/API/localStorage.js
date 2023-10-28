
export function getUserId() {
    if (JSON.parse(localStorage.getItem('v1:userInfo'))?.id) {
        return JSON.parse(localStorage.getItem('v1:userInfo')).id;
    }
    return false;
}


export function getUserName() {
    if (JSON.parse(localStorage.getItem('v1:userInfo'))?.id) {
        return JSON.parse(localStorage.getItem('v1:userInfo')).name;
    }
    return false;
}