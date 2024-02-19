import { UserAlreadyExists, UserNotFound, IncorrectLoginCredentials } from '../utils/custom-exceptions.js'
import { createHash, passwordValidation, generateToken } from '../utils/utils.js'

export default class UsersService {
    constructor(usersRepository){
        this.usersRepository = usersRepository
    }

    getAllUsers = async () => {
        const result = await this.usersRepository.getAll()
        if (result.length === 0){
            throw new UserNotFound('Users not found')
        }
        return result
    }

    getUserByEmailRegister = async (userEmail) => {
        const result = await this.usersRepository.getByEmailRegister(userEmail)
        if (result.length === 0){
            throw new UserNotFound('User not found')
        }
        return result
    }

    register = async (user) => {
        const userData = await this.usersRepository.getByEmailRegister(user.emailRegister)
        
        if(userData.email_register) {
            throw new UserAlreadyExists('User already exists')
        }
        
        const newUser = {
            first_name: user.first_name,
            last_name: user.last_name,
            email_register: user.email
        }
        
        const passHashed = createHash(user.password)
        newUser.password = passHashed

        const result = await this.usersRepository.create(newUser)
        return result
    }

    login = async (user)=> {
        const [userData] = await this.usersRepository.getByEmailRegister(user.email)

        if(userData.length === 0){
            throw new UserNotFound('User not found')
        }
    
        const validatePass = passwordValidation(user.password, userData.password)
        
        if (!validatePass) {
            throw new IncorrectLoginCredentials('Incorrect credentials')
        }
        
        const accessToken = generateToken(userData)
    

        return accessToken
    }

    deleteUser = async (email) => {
        const user = await this.usersRepository.getByEmailRegister(email)
    
        if(user.length === 0) {
            throw new UserNotFound('User not found')
        }

        const result = await this.usersRepository.toggleStatus(email.user_id)

        return result
    }

}