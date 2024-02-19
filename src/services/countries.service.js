import { CannotDelete, ElementAlreadyExists, ElementNotFound } from '../utils/custom-exceptions.js'

export default class CountriesService {
    constructor(countriesRepository, continentsRepository, contentRepository, relationsRepository, provincesRepository){
        this.countriesRepository = countriesRepository
        this.continentsRepository = continentsRepository
        this.contentRepository = contentRepository
        this.relationsRepository = relationsRepository
        this.provincesRepository = provincesRepository
    }

    getAllCountries = async () => {
        const countries = await this.countriesRepository.getAll()
        if(countries.length === 0){
            throw new ElementNotFound('Countries not found')
        }
        return countries
    }

    getCountryById = async (countryId) =>{
        const country = await this.countriesRepository.getById(countryId)
        
        if(country.length === 0){
            throw new ElementNotFound('Country not found')
        }
        return country
    }

    getCountryByName = async (name) => {
        const country = await this.countriesRepository.getByName(name)
        if(country.length === 0){
            throw new ElementNotFound('Country not found')
        }
        return country
    }

    getCountriesByContinentName = async (continentName) => {
        const continent = await this.continentsRepository.getByName(continentName)
        if(continent.length === 0){
            throw new ElementNotFound('Continent not found')
        }
        const continentId = continent[0].continent_id
        
        const countries = await this.countriesRepository.getByParent(continentId)

        if(countries.length === 0){
            throw new ElementNotFound('Countries not found')
        }
        return countries
    }
    
    
    createRelation = async (params) => {
        const countryId = await this.countriesRepository.getIdByName(params.name)
        const contentId = await this.contentRepository.getIdByName(params.title)
                
        const relations = {
            contentId: contentId.content_id,
            recordId : countryId.country_id,
            recordType: 'countries'
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

    createCountry = async (country) => {
        const findCountry = await this.countriesRepository.getByName(country.name)
        
        if(!findCountry.length === 0){
           throw new ElementAlreadyExists(`A country called ${country.name} already exists`)
        }
        
        const continent = await this.continentsRepository.getByName(country.continent)

        if(continent.length === 0){
            throw new ElementNotFound('Continent not found')
        }
    
        const newCountry = {
            name: country.name,
            continentId: continent[0].continent_id
        }

        await this.createContent(country)

        const result = await this.countriesRepository.create(newCountry)
        
        await this.createRelation(country)

        return result
    }
    
    addContent = async (country) => {
        const findCountry = await this.countriesRepository.getByName(country.name)

        if (findCountry.length === 0) {
            throw new ElementNotFound(`Country ${country.name} not found`)
        }
        
        await this.createContent(country)
        const result = await this.createRelation(country)

        return result
    }


    updateCountryById = async (countryId, updates) => {
        const findCountry = await this.countriesRepository.getById(countryId)

        if(findCountry.length === 0){
            throw new ElementNotFound(`Country with id ${countryId} not found`)
        }

        const result = await this.countriesRepository.updateById(countryId, updates)
        return result
    }

    updateCountryByName = async (country, updates) => {
        const findCountry = await this.countriesRepository.getByName(country)

        if(findCountry.length === 0){
            throw new ElementNotFound(`Country ${country} not found`)
        }

        const result = await this.countriesRepository.updateByName(country, updates)
        return result
    }
    
    deleteCountryById = async (countryId) => {
        const [findCountry] = await this.countriesRepository.getById(countryId)

        if(findCountry.length === 0){
            throw new ElementNotFound('Country not found')
        }

        const isParent = await this.provincesRepository.getByParent(findCountry.country_id)

        if (isParent) {
            throw new CannotDelete('Element has relationships and cannot be deleted')
        }
        

        const result = await this.countriesRepository.deleteById(countryId)

        return result
    }

    deleteCountryByName = async (country) => {
        const [findCountry] = await this.countriesRepository.getByName(country)

        if(findCountry.length === 0){
            throw new ElementNotFound('Country not found')
        }

        const isParent = await this.provincesRepository.getByParent(findCountry.country_id)

        if (isParent) {
            throw new CannotDelete('Element has relationships and cannot be deleted')
        }

        const result = await this.countriesRepository.deleteByName(country)

        return result
    }

}
