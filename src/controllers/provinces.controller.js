import { provincesRepository, countriesRepository, contentRepository, relationsRepository, citiesRepository } from '../repositories/index.js'
import ProvincesService from '../services/provinces.service.js'
import { ElementNotFound, ElementAlreadyExists, CannotDelete } from '../utils/custom-exceptions.js'


const provincesService = new ProvincesService(provincesRepository, countriesRepository, contentRepository, relationsRepository, citiesRepository)

export default class ProvincesController {
    async getAllProvinces (req, res) {
        try {
            const provinces = await provincesService.getAllProvinces()
            res.sendSuccess(provinces)
        } catch (error) {
            
            if (error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)

        }
    }

    async getProvinceById (req, res) {
        try {
            const provinceId = req.params.provinceId

            const province = await provincesService.getProvinceById(provinceId)
            res.sendSuccess(province)

        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async getProvinceByName (req, res) {
        try {
            const name = req.params.name
            const province = await provincesService.getProvinceByName(name)

            res.sendSuccess(province)
        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async getProvinceByCountryName (req, res) {
        try {
            const country = req.params.country
            
            const provinces = await provincesService.getProvincesByCountryName(country)
            
            res.sendSuccess(provinces)

        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async createProvince (req, res) {
        try {
            const { name, title, paragraph, country } = req.body

            if(!name || !title || !paragraph || !country ){
               return res.sendClientError('Incomplete Values')
            }

            await provincesService.createProvince({...req.body})

            res.sendSuccess(`Province ${name} created`)

        } catch (error) {
            if(error instanceof ElementAlreadyExists){
                return res.sendClientError(error.message)
            } 
            if(error instanceof ElementNotFound){
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

            await provincesService.addContent({name, ...req.body})

            res.sendSuccess(`Content added to province ${name}, title:  ${title} `)

        } catch (error) {
            if(error instanceof ElementAlreadyExists){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }
    

    async updateProvinceById (req, res) {
        try {
            const provinceId = req.params.provinceId
            const updates = req.body

            if(!updates.name || !updates.title || !updates.paragraph){
                return res.sendClientError('Incomplete Values')
            }

            const result = await provincesService.updateProvinceById(provinceId, updates)

            res.sendSuccess(`Province ID: ${provinceId} updated`)

        } catch (error) {
            if(error instanceof ElementNotFound){
                res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }

    async updateProvinceByName (req, res) {
        try {
            const province = req.params.name
            const updates = req.body

            if(!updates.name || !updates.title || !updates.paragraph){
                return res.sendClientError('Incomplete Values')
            }

            await provincesService.updateProvinceByName(province, updates)

            res.sendSuccess(`Province ${province} updated`)

        } catch (error) {
            if(error instanceof ElementNotFound){
                res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }

    async deleteProvinceById (req, res) {
        try {
            const provinceId  = req.params.provinceId
            await provincesService.deleteProvinceById(provinceId)

            res.sendSuccess(`Province Id: ${provinceId} was deleted successfully`)

        } catch (error) {
            if(error instanceof ElementNotFound || error instanceof CannotDelete){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }
    
    async deleteProvinceByName (req, res) {
        try {
            const province  = req.params.name
            await provincesService.deleteProvinceByName(province)

            res.sendSuccess(`Province ${province} was deleted successfully`)

        } catch (error) {
            if(error instanceof ElementNotFound || error instanceof CannotDelete){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }

}