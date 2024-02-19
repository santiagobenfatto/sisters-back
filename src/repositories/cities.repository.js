import GenericRepository from './generic.repository.js'

export default class CitiesRepository extends GenericRepository {
    constructor(dao){
        super(dao)
        this.dao = dao
    }

    //Specific Methods
    getByProvinceId = async (provinceId) =>{
        const result = await this.dao.getByProvinceId(provinceId)
        return result
    }
}