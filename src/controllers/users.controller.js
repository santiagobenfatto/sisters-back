import { UserNotFound, UserAlreadyExists, IncorrectLoginCredentials } from '../utils/custom-exceptions.js'
import { usersRepository } from '../repositories/index.js'
import UsersService from '../services/users.service.js'
import config from '../config/config.js'


const usersService = new UsersService(usersRepository)


export default class UsersController {
    async getAllUsers (req,res) {
        try {
            const users = await usersService.getAllUsers()
            res.sendSuccess(users)
        } catch (error) {
            if(error instanceof UserNotFound){
                return res.sendServerError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async getUserByEmailRegister (req,res) {
        try {
            const { email } = req.body
            const user = await usersService.getUserByEmailRegister(email)
            return user
        } catch (error) {
            if(error instanceof UserNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async register (req,res) {
        try {
            const { first_name, last_name, email, password } = req.body

            if (!first_name || !last_name || !email || !password){
                return res.sendClientError('Incomplete values')
            }

            const register = await usersService.register({ ...req.body })

            res.sendSuccess(register)

        } catch (error) {
            if(error instanceof UserAlreadyExists){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async login (req,res) {
        try {
            const { email, password } = req.body
            
            if( !email || !password){
                return res.sendClientError('Incomplete values')
            }

            const accessToken = await usersService.login({...req.body})
            
            res.cookie(
                config.cookieToken, accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
            ).send({message: 'Authorized'})

        } catch (error) {
            if(error instanceof UserNotFound){
                return res.sendClientError(error.message)
            }
            if(error instanceof IncorrectLoginCredentials){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async deleteUser (req, res) {
        try {
            const { email } = req.body
            usersService.deleteUser(email)

        } catch (error) {
            if(error instanceof UserNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }
} 