export default class GenericRepository {
    constructor(dao){
        this.dao = dao
    }

    getAll = async () => {
        const result = await this.dao.getAll()
        return result
    }

    getById = async (id) =>{
        const result = await this.dao.getById(id)
        return result
    }
    
    getByName = async (name) =>{
        const result = await this.dao.getByName(name)
        return result
    }
    
    getIdByName = async (name) =>{
        const result = await this.dao.getIdByName(name)
        return result
    }

    getByParent = async (name) =>{
        const result = await this.dao.getByParent(name)
        return result
    }
    
    create = async (doc) => {
        const result = await this.dao.create(doc)
        return result
    }

    updateById = async (id, updates) => {
        const result = await this.dao.updateById(id, updates)
        return result
    }

    updateByName = async (name, updates) => {
        const result = await this.dao.updateByName(name, updates)
        return result
    }

    deleteById = async (id) => {
        const result = await this.dao.deleteById(id)
        return result
    }

    deleteByName = async (name) => {
        const result = await this.dao.deleteByName(name)
        return result
    }
}