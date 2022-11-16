// import { storageService } from './async-storage.service.js'
const KEY = 'userDB'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'

export const userService = {
    getLoggedInUser,
    login,
    logout,
    signup,
    getById,
    deleteUser,
    query,
    removeUser
}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}


function login({ username, password }) {
    return axios.post('/api/auth/login', { username, password })
        .then(res => res.data)
        .then(user => {
            return setLoggedinUser(user)
        })
}

function signup({ username, password, fullname }) {
    const user = { username, password, fullname }
    return axios.post('/api/auth/signup', user)
        .then(res => res.data)
        .then(user => {
            return setLoggedinUser(user)
        })
}


function logout() {
    return axios.post('/api/auth/logout')
        .then(() => {
            sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
        })
}

function setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}


function deleteUser(userId) {
    var api = `/api/user-list/${userId}`;
    return axios.delete(api)
        .then(res => res.data)
        .then(() => {
            const idx = users.findIndex(user => user._id === userId);
            users.splice(idx, 1);
        });
}

function getById(userId) {
    var api = `/api/user-list/${userId}`;
    return axios.get(api)
        .then(res => res.data);
}

const BASE_URL = '/api/user-list/'
function query(filterBy) {
    return axios.get(BASE_URL).then(res => res.data)
  }

function removeUser(userId) {
    return axios.delete(BASE_URL + userId ).then(res => res.data)
  }
