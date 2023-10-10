
export function getUserId() {
    if (JSON.parse(localStorage.getItem('v1:userInfo'))?.id) {
        return JSON.parse(localStorage.getItem('v1:userInfo')).id;
    }
    window.location.href = '/login'
}


export function getUserName() {
    if (JSON.parse(localStorage.getItem('v1:userInfo'))?.id) {
        return JSON.parse(localStorage.getItem('v1:userInfo')).name;
    }
    window.location.href = '/login'
}