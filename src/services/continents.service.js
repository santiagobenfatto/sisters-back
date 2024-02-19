import { ElementAlreadyExists, ElementNotFound, CannotDelete } from '../utils/custom-exceptions.js'

export default class ContinentService {
    constructor(continentsRepository,contentRepository, relationsRepository, countriesRepository){
        this.continentsRepository = continentsRepository
        this.contentRepository = contentRepository
        this.relationsRepository = relationsRepository
        this.countriesRepository = countriesRepository

    }

    getAllContinents = async () => {
        const continents = await this.continentsRepository.getAll()
        
        if(continents.length === 0){
            throw new ElementNotFound('Continent not found')
        }

        return continents
    }

    getContinentById = async (continentId) =>{
        const continent = await this.continentsRepository.getById(continentId)
        
        if(continent.length === 0){
            throw new ElementNotFound('Continent not found')
        }
        return continent
    }


    getContinentByName = async (name) => {
        const continent = await this.continentsRepository.getByName(name)
        
        if(continent.length === 0){
            throw new ElementNotFound('continent not found')
        }
        return continent
    }

    createRelation = async (params) => {
        const continentId = await this.continentsRepository.getIdByName(params.name)
        const contentId = await this.contentRepository.getIdByName(params.title)
                
        const relations = {
            contentId: contentId.content_id,
            recordId : continentId.continent_id,
            recordType: 'continents'
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

    createContinent = async (continent) => {
        const findContinent = await this.continentsRepository.getByName(continent.name)
     
        if (findContinent.length !== 0) {
            throw new ElementAlreadyExists(`A continent called ${name} already exists`)
        }
        
        const newContinent = {
            name: continent.name
        }
    
        await this.createContent(continent)
        
        const result = await this.continentsRepository.create(newContinent)
        
        await this.createRelation(continent)

        return result
    }
    
    addContent = async (continent) => {
        const findContinent = await this.continentsRepository.getByName(continent.name)

        if (findContinent.length === 0) {
            throw new ElementNotFound(`Continent ${continent.name} not found`)
        }
        
        await this.createContent(continent)
        const result = await this.createRelation(continent)

        return result
    }


    updateContinentById = async (continentId, updates) => {
        const findContinent = await this.continentsRepository.getById(continentId)
        
        if(findContinent.length === 0){
            throw new ElementNotFound(`Continent with id ${continentId} not found`)
        }

        const result = await this.continentsRepository.updateById(continentId, updates)
        return result
    }

    updateContinentByName = async (continent, updates) => {
        const findContinent = await this.continentsRepository.getByName(continent)

        if(findContinent.length === 0){
            throw new ElementNotFound(`Continent ${continent} not found`)
        }

        const result = await this.continentsRepository.updateByName(continent, updates)
        return result
    }
    
    deleteContinentById = async (continentId) => {
        const [findContinent] = await this.continentsRepository.getById(continentId)

        if(findContinent.length === 0){
            throw new ElementNotFound('Continent not found')
        }
    
        const isParent = await this.countriesRepository.getByParent(findContinent.continent_id)

        if (isParent) {
            throw new CannotDelete('Element has relationships and cannot be deleted')
        }

        const result = await this.continentsRepository.deleteById(continentId)

        return result
    }

    deleteContinentByName = async (continent) => {
        const [findContinent] = await this.continentsRepository.getByName(continent)

        if(findContinent.length === 0){
            throw new ElementNotFound('Continent not found')
        }
        
        const isParent = await this.countriesRepository.getByParent(findContinent.continent_id)

        if (isParent) {
            throw new CannotDelete('Element has relationships and cannot be deleted')
        }

        const result = await this.continentsRepository.deleteByName(continent)

        return result
    }

}
