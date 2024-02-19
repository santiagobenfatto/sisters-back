import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

const passwordValidation = (userPass, hash) => {
    return bcrypt.compareSync(userPass, hash)
}

const generateToken = (user) => {
    const token = jwt.sign({ user }, config.privateKey, { expiresIn: '24h' })
    return token
}

export {
    __dirname,
    createHash,
    passwordValidation,
    generateToken
}