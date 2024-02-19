import { ElementAlreadyExists, ElementNotFound } from '../utils/custom-exceptions.js'

export default class CitiesService {
    constructor(citiesRepository, provincesRepository, contentRepository, relationsRepository){
        this.citiesRepository = citiesRepository
        this.provincesRepository = provincesRepository
        this.contentRepository = contentRepository
        this.relationsRepository = relationsRepository
    }

    getAllCities = async () => {
        const result = await this.citiesRepository.getAll()

        if(result.length === 0){
            throw new ElementNotFound(`No cities yet`)
        }
        return result
    }

    getCityById = async (cityId) =>{
        const city = await this.citiesRepository.getById(cityId)

        if(city.length === 0){
            throw new ElementNotFound('City not found')
        }
        return city
    }

    getCityByName = async (name) => {
        const city = await this.citiesRepository.getByName(name)
        if(city.length === 0){
            throw new ElementNotFound('City not found')
        }
        return city
    }

    getCitiesByProvinceName = async (provinceId) =>{
        const cities = await this.citiesRepository.getByProvinceId(provinceId)

        if(cities.length === 0){
            throw new ElementNotFound(`Cities from province with id: ${provinceId} not found`)
        }
        return cities
    }

    createRelation = async (params) => {
        const cityId = await this.citiesRepository.getIdByName(params.name)
        const contentId = await this.contentRepository.getIdByName(params.title)
            console.log(params)
            //console.log(contentId)OK
        const relations = {
            contentId: contentId.content_id,
            recordId : cityId.city_id,
            recordType: 'cities'
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

    createCity = async (city) => {  
        const findCity = await this.citiesRepository.getByName(city.name)
        
        if(!findCity.length === 0){
           throw new ElementAlreadyExists(`A city called ${city.name} already exists`)
        }
        
        const [province] = await this.provincesRepository.getByName(city.province)

        if(province.length === 0){
        throw new ElementNotFound('Province not found. City needs a province')
        }

        const newCity = {
            name: city.name,
            provinceId: province.province_id
        }

        await this.createContent(city)
        
        const result = await this.citiesRepository.create(newCity)
    
        await this.createRelation(city)

        return result
    }

    addContent = async (city) => {
        const findCity = await this.citiesRepository.getByName(city.name)

        if (findCity.length === 0) {
            throw new ElementNotFound(`City ${city.name} not found`)
        }
        
        await this.createContent(city)
        const result = await this.createRelation(city)

        return result
    }
    
    
    updateCityById = async (cityId, updates) => {
        const findCity = await this.citiesRepository.getById(cityId)

        if(findCity.length === 0){
            throw new ElementNotFound(`City with id ${cityId} not found`)
        }

        const result = await this.citiesRepository.updateById(cityId, updates)
        return result
    }

    updateCityByName = async (city, updates) => {
        const findCity = await this.citiesRepository.getByName(city)

        if(findCity.length === 0){
            throw new ElementNotFound(`City with id ${city} not found`)
        }

        const result = await this.citiesRepository.updateByName(city, updates)
        return result
    }
    
    deleteCityById = async (cityId) => {
        const city = await this.citiesRepository.getById(cityId)

        if(!city){
            throw new ElementNotFound('City not found')
        }

        const result = await this.citiesRepository.deleteById(cityId)

        return result
    }

    deleteCityByName = async (city) => {
        const name = await this.citiesRepository.getByName(city)

        if(!name){
            throw new ElementNotFound('City not found')
        }

        const result = await this.citiesRepository.deleteByName(city)

        return result
    }
}
