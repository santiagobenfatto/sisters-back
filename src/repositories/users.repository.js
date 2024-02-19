import GenericRepository from './generic.repository.js'

export default class UsersRepository extends GenericRepository {
    constructor(dao){
        super(dao)
    }
    
    getByEmailRegister = async (email) => {
        const result = await this.dao.getByEmailRegister(email)
        return result
    }

    toggleStatus = async (userId) => {
        const result = await this.dao.toggleStatus(userId)
        return result
    }
}