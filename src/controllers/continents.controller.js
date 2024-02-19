import ContentDTO from '../DTOs/content.dto.js'
import { continentsRepository, contentRepository, relationsRepository, countriesRepository } from '../repositories/index.js'
import ContinentsService from '../services/continents.service.js'
import { ElementNotFound, ElementAlreadyExists, CannotDelete } from '../utils/custom-exceptions.js'


const continentsService = new ContinentsService(continentsRepository, contentRepository, relationsRepository, countriesRepository)



export default class ContinentsController {
    async getAllContinents (req, res) {
        try {
            const continents = await continentsService.getAllContinents()
            res.sendSuccess(continents)
        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async getContinentById (req, res) {
        try {
            const continentId = req.params.continentId

            const continent = await continentsService.getContinentById(continentId)
            res.sendSuccess(continent)
        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async getContinentByName (req, res) {
        try {
            const name = req.params.name
            const continent = await continentsService.getContinentByName(name)
            const DTO = ContentDTO.transformContent(continent)
            res.sendSuccess(DTO)
        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async createContinent (req, res) {
        try {
            const {name, title, paragraph} = req.body
            
            if(!name || !title || !paragraph){
               return res.sendClientError('Incomplete Values')
            }

            await continentsService.createContinent({...req.body})

            res.sendSuccess(`Continent ${name} created`)

        } catch (error) {
            if(error instanceof ElementAlreadyExists){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async addContent (req, res) {
        try {
            const name = req.params.name
            const {title, paragraph} = req.body
            
            if(!name || !title || !paragraph){
               return res.sendClientError('Incomplete Values')
            }

            await continentsService.addContent({name, ...req.body})

            res.sendSuccess(`Content added to continent ${name}, title:  ${title} `)

        } catch (error) {
            if(error instanceof ElementAlreadyExists){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }
    


    async updateContinentById (req, res) {
        try {
            const continentId = req.params.continentId
            const updates = req.body

            if(!updates.name || !updates.title || !updates.paragraph){
                return res.sendClientError('Incomplete Values')
            }

            await continentsService.updateContinentById(continentId, updates)

            res.sendSuccess(`Continent ID ${continentId} updated`)

        } catch (error) {
            if(error instanceof ElementNotFound){
                res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async updateContinentByName (req, res) {
        try {
            const continent = req.params.name
            const updates = req.body
            
            if(!updates.name || !updates.title || !updates.paragraph){
                return res.sendClientError('Incomplete Values')
            }
            await continentsService.updateContinentByName(continent, updates)

            res.sendSuccess(`Continent ${continent} updated`)

        } catch (error) {
            if(error instanceof ElementNotFound){
                res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async deleteContinentById (req, res) {
        try {
            const continentId  = req.params.continentId
            await continentsService.deleteContinentById(continentId)

            res.sendSuccess(`Continent Id: ${continentId} was deleted successfully`)

        } catch (error) {
            if(error instanceof ElementNotFound || error instanceof CannotDelete ){
                return res.sendClientError(error.message)
            }
            
            res.sendServerError(error.message)
        }
    }

    async deleteContinentByName (req, res) {
        try {
            const continent  = req.params.name
            await continentsService.deleteContinentByName(continent)

            res.sendSuccess(`Continent ${continent} was deleted successfully`)

        } catch (error) {
            if(error instanceof ElementNotFound || error instanceof CannotDelete ){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

}