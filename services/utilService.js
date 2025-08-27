import fs from 'fs'

export const utilService = {
    readJsonFile,
    makeId
}

function readJsonFile(path) {
    const str = fs.readFileSync(path, 'utf8')
    return JSON.parse(str)
}

function makeId(length = 5) {
    let text = ''
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) text += chars.charAt(Math.floor(Math.random() * chars.length))
    return text
}
