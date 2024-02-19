import { ElementAlreadyExists, ElementNotFound, CannotDelete } from '../utils/custom-exceptions.js'

export default class ProvincesService {
    constructor(provincesRepository, countriesRepository, contentRepository, relationsRepository, citiesRepository){
        this.provincesRepository = provincesRepository
        this.countriesRepository = countriesRepository
        this.contentRepository = contentRepository
        this.relationsRepository = relationsRepository
        this.citiesRepository = citiesRepository

    }

    getAllProvinces = async () => {
        const result = await this.provincesRepository.getAll()
        if (result.length === 0){
            throw new ElementNotFound('Provinces not found')
        }
        return result
    }

    getProvinceById = async (provinceId) =>{
        const province = await this.provincesRepository.getById(provinceId)
        
        if(province.length === 0){
            throw new ElementNotFound(`Province id ${provinceId} not found`)
        }
        return province
    }

    getProvinceByName = async (name) => {
        const province = await this.provincesRepository.getByName(name)
        if(province.length === 0){
            throw new ElementNotFound(`Province ${name} not found`)
        }
        return province
    }
    
    getProvincesByCountryName = async (country) =>{
        const countries = await this.countriesRepository.getByName(country)

        if(countries.length === 0){
            throw new ElementNotFound(`Provinces from country with id: ${country} not found`)
        }
        const countryId = countries[0].country_id

        const provinces = await this.provincesRepository.getByParent(countryId)
    
        return provinces
    }

    createRelation = async (params) => {
        const provinceId = await this.provincesRepository.getIdByName(params.name)
        const contentId = await this.contentRepository.getIdByName(params.title)
                
        const relations = {
            contentId: contentId.content_id,
            recordId : provinceId.province_id,
            recordType: 'provinces'
        }
        const result = await this.relationsRepository.create(relations)
        return result
    }
    
    createContent = async (content) => {

        const newContent = {
            title: content.title,
            paragraph: content.paragraph
        }
        const result = await this.contentRepository.create(newContent)
        
        return result

    }

    createProvince = async (province) => {
        const findProvince = await this.provincesRepository.getByName(province.name)   
        
        if(!findProvince.length === 0){
            throw new ElementAlreadyExists(`A province called ${province.name} already exists`)
        }
        
        const country = await this.countriesRepository.getByName(province.country)
        

        if(country.length === 0){
            throw new ElementNotFound('Country not found')
        }
       
        const newProvince = {
            name: province.name,
            title: province.title,
            paragraph: province.paragraph,
            countryId: country[0].country_id
        }
        await this.createContent(province)

        const result = await this.provincesRepository.create(newProvince)
        
        await this.createRelation(province)

        return result
    }

    addContent = async (province) => {
        const findProvince = await this.provincesRepository.getByName(province.name)

        if (findProvince.length === 0) {
            throw new ElementNotFound(`Province ${province.name} not found`)
        }
        
        await this.createContent(province)
        const result = await this.createRelation(province)

        return result
    }

    
    updateProvinceById = async (provinceId, updates) => {
        const findProvince = await this.provincesRepository.getById(provinceId)

        if(findProvince.length === 0){
            throw new ElementNotFound(`Province with id ${provinceId} not found`)
        }

        const result = await this.provincesRepository.updateById(provinceId, updates)
        return result
    }

    updateProvinceByName = async (province, updates) => {
        const findProvince = await this.provincesRepository.getByName(province)

        if(findProvince.length === 0){
            throw new ElementNotFound(`Province with id ${province} not found`)
        }

        const result = await this.provincesRepository.updateByName(province, updates)
        return result
    }
    
    deleteProvinceById = async (provinceId) => {
        const [findProvince] = await this.provincesRepository.getById(provinceId)

        if(findProvince.length === 0){
            throw new ElementNotFound('Province not found')
        }
        
        const isParent = await this.citiesRepository.getByParent(findProvince.province_id)

        if (isParent) {
            throw new CannotDelete('Element has relationships and cannot be deleted')
        }

        const result = await this.provincesRepository.deleteById(provinceId)

        return result
    }

    deleteProvinceByName = async (province) => {
        const [findProvince] = await this.provincesRepository.getByName(province)

        if(findProvince.length === 0){
            throw new ElementNotFound('Province not found')
        }

        const isParent = await this.citiesRepository.getByParent(findProvince.province_id)

        if (isParent) {
            throw new CannotDelete('Element has relationships and cannot be deleted')
        }

        const result = await this.provincesRepository.deleteByName(province)

        return result
    }

}
