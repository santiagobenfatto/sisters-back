import Router from './app.routes.js'
import { strategyEnum } from '../utils/passportStrategies.js'
import UsersController from '../controllers/users.controller.js'

const usersController = new UsersController()

export default class UsersRouter extends Router {
    init(){
        this.get('/', ['PUBLIC'], strategyEnum.NOTHING, usersController.getAllUsers)
        
        this.post('/register', ['PUBLIC'], strategyEnum.NOTHING, usersController.register)
        this.post('/login', ['PUBLIC'], strategyEnum.NOTHING, usersController.login)

        this.delete('/delete', ['ADMIN'], strategyEnum.JWT, usersController.deleteUser)
    }
}