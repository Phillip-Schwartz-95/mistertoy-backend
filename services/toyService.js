import fs from 'fs'
import { utilService } from './utilService.js'

const TOY_FILE = 'data/toys.json'

export const toyService = {
    query,
    getById,
    remove,
    save,
    getEmptyToy
}

let toys = utilService.readJsonFile(TOY_FILE)

function query(filterBy = {}) {
    let toysToReturn = toys

    if (filterBy.name) {
        const regex = new RegExp(filterBy.name, 'i')
        toysToReturn = toysToReturn.filter(toy => regex.test(toy.name))
    }

    if (filterBy.inStock !== undefined) {
        toysToReturn = toysToReturn.filter(toy => toy.inStock === filterBy.inStock)
    }

    return Promise.resolve(toysToReturn)
}

function getById(toyId) {
    const toy = toys.find(t => t._id === toyId)
    if (!toy) return Promise.reject('Toy not found')
    // Add dummy msgs property
    return Promise.resolve({ ...toy, msgs: ['Hi!', 'I am a toy.'] })
}

function remove(toyId) {
    const idx = toys.findIndex(t => t._id === toyId)
    if (idx === -1) return Promise.reject('No such toy')
    toys.splice(idx, 1)
    return _saveToysToFile()
}

function save(toy) {
    if (toy._id) {
        const idx = toys.findIndex(t => t._id === toy._id)
        if (idx === -1) return Promise.reject('Toy not found')
        toys[idx] = toy
    } else {
        toy._id = utilService.makeId()
        toy.createdAt = Date.now()
        toys.push(toy)
    }
    return _saveToysToFile().then(() => toy)
}

function getEmptyToy() {
    return {
        name: '',
        price: 0,
        labels: [],
        inStock: true
    }
}

function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        fs.writeFile(TOY_FILE, JSON.stringify(toys, null, 2), err => {
            if (err) return reject(err)
            resolve()
        })
    })
}
