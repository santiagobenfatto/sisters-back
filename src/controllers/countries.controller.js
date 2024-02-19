import { countriesRepository, continentsRepository, contentRepository, relationsRepository, provincesRepository } from '../repositories/index.js'
import CountriesService from '../services/countries.service.js'
import { ElementNotFound, ElementAlreadyExists, CannotDelete } from '../utils/custom-exceptions.js'
import ContentDTO from '../DTOs/content.dto.js'


const countriesService = new CountriesService(countriesRepository, continentsRepository, contentRepository, relationsRepository, provincesRepository)


export default class CountriesController {
    async getAllCountries (req, res) {
        try {
            const countries = await countriesService.getAllCountries()
            res.sendSuccess(countries)
        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendServerError(error.message)
            }
        }
    }

    async getCountryById (req, res) {
        try {
            const countryId = req.params.countryId

            const country = await countriesService.getCountryById(countryId)
            res.sendSuccess(country)
        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async getCountryByName (req, res) {
        try {
            const name = req.params.name
            const country = await countriesService.getCountryByName(name)
            const DTO = ContentDTO.transformContent(country)
            res.sendSuccess(DTO)
        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async getCountriesByContinentName (req, res) {
        try {
            const continent = req.params.continent
            const countries = await countriesService.getCountriesByContinentName(continent)
            res.sendSuccess(countries)
        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async createCountry (req, res) {
        try {
            const { name, continent, title, paragraph } = req.body
            
            if(!name || !continent || !title || !paragraph ){
               return res.sendClientError('Incomplete Values')
            }

            await countriesService.createCountry({...req.body})

            res.sendSuccess(`Country ${name} created`)

        } catch (error) {
            if(error instanceof ElementAlreadyExists){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }

    async addContent (req, res) {
        try {
            const name = req.params.name
            const {title, paragraph} = req.body
            
            if(!name || !title || !paragraph){
               return res.sendClientError('Incomplete Values')
            }

            await countriesService.addContent({name, ...req.body})

            res.sendSuccess(`Content added to countries ${name}, title:  ${title} `)

        } catch (error) {
            if(error instanceof ElementAlreadyExists){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }
    

    async updateCountryById (req, res) {
        try {
            const countryId = req.params.countryId
            const updates = req.body

            if(!updates.name || !updates.title || !updates.paragraph){
                return res.sendClientError('Incomplete Values')
            }

            const result = await countriesService.updateCountryById(countryId, updates)

            res.sendSuccess(`Country ID ${countryId} updated`)

        } catch (error) {
            if(error instanceof ElementNotFound){
                res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }

    async updateCountryByName (req, res) {
        try {
            const country = req.params.name
            const updates = req.body

            if(!updates.name || !updates.title || !updates.paragraph){
                return res.sendClientError('Incomplete Values')
            }

            const result = await countriesService.updateCountryByName(country, updates)

            res.sendSuccess(`Country ${country} updated`)

        } catch (error) {
            if(error instanceof ElementNotFound){
                res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }

    async deleteCountryById (req, res) {
        try {
            const countryId  = req.params.countryId
            await countriesService.deleteCountryById(countryId)

            res.sendSuccess(`Country Id: ${countryId} was deleted successfully`)

        } catch (error) {
            if(error instanceof ElementNotFound || error instanceof CannotDelete){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }

    async deleteCountryByName (req, res) {
        try {
            const country  = req.params.name
            await countriesService.deleteCountryByName(country)

            res.sendSuccess(`Country ${country} was deleted successfully`)

        } catch (error) {
            if(error instanceof ElementNotFound || error instanceof CannotDelete){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }

}