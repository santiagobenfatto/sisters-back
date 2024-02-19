import { citiesRepository, provincesRepository, contentRepository, relationsRepository} from '../repositories/index.js'
import CitiesService from '../services/cities.service.js'
import ContentDTO from '../DTOs/content.dto.js'
import { ElementNotFound, ElementAlreadyExists } from '../utils/custom-exceptions.js'


const citiesService = new CitiesService(citiesRepository, provincesRepository, contentRepository, relationsRepository)

export default class CitiesController {
    async getAllCities (req, res) {
        try {
            const cities = await citiesService.getAllCities()
            res.sendSuccess(cities)
        } catch (error) {
            res.sendServerError(error.message)
        }
    }

    async getCityById (req, res) {
        try {
            const cityId = req.params.cityId

            const city = await citiesService.getCityById(cityId)
            res.sendSuccess(city)
        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async getCityByName (req, res) {
        try {
            const name = req.params.name
            const city = await citiesService.getCityByName(name)
            const DTO = ContentDTO.transformContent(city)
            res.sendSuccess(DTO)
        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async getCityByProvinceId (req, res) {
        try {
            const provinceId = req.params.provinceId

            const cities = await citiesService.getCitiesByProvinceId(provinceId)
            
            res.sendSuccess(cities)
        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async getCityByCountryId (req, res) {
        try {
            const countryId = req.params.countryId

            const cities = await citiesService.getCitiesByCountryId(countryId)
            
            res.sendSuccess(cities)
        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async createCity (req, res) {
        try {
            const { name, title, paragraph,province} = req.body
       
            if(!name || !title || !paragraph || !province){
               return res.sendClientError('Incomplete Values')
            }

            await citiesService.createCity({...req.body})

            res.sendSuccess(`City ${name} created`)

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

            await citiesService.addContent({name, ...req.body})

            res.sendSuccess(`Content added to cities ${name}, title:  ${title} `)

        } catch (error) {
            if(error instanceof ElementAlreadyExists){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }

    async updateCityById (req, res) {
        try {
            const cityId = req.params.cityId
            const updates = req.body

            if(!updates.name || !updates.title || !updates.paragraph){
                return res.sendClientError('Incomplete Values')
            }

            await citiesService.updateCityById(cityId, updates)

            res.sendSuccess(`City ID: ${cityId} updated`)

        } catch (error) {
            if(error instanceof ElementNotFound){
                res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }

    async updateCityByName (req, res) {
        try {
            const city = req.params.name
            const updates = req.body

            if(!updates.name || !updates.title || !updates.paragraph){
                return res.sendClientError('Incomplete Values')
            }

            await citiesService.updateCityByName(city, updates)

            res.sendSuccess(`City ${city} updated`)

        } catch (error) {
            if(error instanceof ElementNotFound){
                res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }

    async deleteCityById (req, res) {
        try {
            const cityId  = req.params.cityId
            await citiesService.deleteCityById(cityId)

            res.sendSuccess(`City Id: ${cityId} was deleted successfully`)

        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }

    async deleteCityByName (req, res) {
        try {
            const city  = req.params.name
            await citiesService.deleteCityByName(city)

            res.sendSuccess(`City ${city} was deleted successfully`)

        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }

}