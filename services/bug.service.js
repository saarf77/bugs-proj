
const fs = require('fs')
const bugs = require('../data/bugs.json')

module.exports = {
    query,
    getById,
    remove,
    save
}


function query(filterBy) {
    const title = filterBy.title || ''
    const page = +filterBy.page || 0
    const itemsPerPage = +filterBy.itemsPerPage || 3
  
    const regex = new RegExp(title, 'i')
    let filteredBugs = bugs.filter(bug => regex.test(bug.title))
    const startIdx = page * itemsPerPage
    const totalPages = Math.ceil(filteredBugs.length / itemsPerPage)
    if (itemsPerPage !== Infinity) filteredBugs = filteredBugs.slice(startIdx, startIdx + itemsPerPage)

    return Promise.resolve({
        totalPages,
        bugs: filteredBugs
    })
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('invalid bug id')
    return Promise.resolve(bug)
}

function save(bug) {
    if (bug._id) {
        const idx = bugs.findIndex(({ _id }) => _id === bug._id)
        if (idx === -1) return Promise.reject('invalid bug id')
        bugs[idx] = bug
    } else {
        bug._id = _makeId()
        bugs.unshift(bug)
    }
    return _saveBugs().then(() => bug)
}

function remove(bugId, loggedinUser) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('invalid bug id')
    if(loggedinUser.fullname !== bugs[idx].owner.fullname && loggedinUser._id !==  bugs[idx].owner._id) return _saveBugs()
    bugs.splice(idx, 1)
    return _saveBugs()
}

// PRIVATES

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveBugs() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)

        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}
