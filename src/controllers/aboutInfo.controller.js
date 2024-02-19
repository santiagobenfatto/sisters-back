import { aboutInfoRepository, contentRepository, relationsRepository } from '../repositories/index.js'
import AboutInfoService from '../services/aboutInfo.service.js'

import { ElementNotFound, ElementAlreadyExists } from '../utils/custom-exceptions.js'


const aboutInfoService = new AboutInfoService(aboutInfoRepository, contentRepository, relationsRepository)


export default class AboutUsController {
    async getAllInfo (req, res) {
        try {
            const info = await aboutInfoService.getAllInfo()
            res.sendSuccess(info)
        } catch (error) {
            res.sendServerError(error.message)
        }
    }

    async getInfoById (req, res) {
        try {
            const infoId = req.params.infoId

            const info = await aboutInfoService.getInfoById(infoId)
            res.sendSuccess(info)
        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async createInfo (req, res) {
        try {
            const { topic, title, paragraph } = req.body
            
            if( !topic || !title || !paragraph){
               return res.sendClientError('Incomplete Values')
            }

            await aboutInfoService.createInfo({...req.body})

            res.sendSuccess(`Info ${title} created`)

        } catch (error) {
            if(error instanceof ElementAlreadyExists){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }

    async addContent (req, res) {
        try {
            const topic = req.params.name
            const {title, paragraph} = req.body
            
            if(!topic || !title || !paragraph){
               return res.sendClientError('Incomplete Values')
            }

            await aboutInfoService.addContent({topic, ...req.body})

            res.sendSuccess(`Content added to Info ${topic}, title:  ${title} `)

        } catch (error) {
            if(error instanceof ElementAlreadyExists){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }
    

    async updateInfoById (req, res) {
        try {
            const infoId = req.params.infoId
            const updates = req.body

            
            if(!updates.topic || !updates.title || !updates.paragraph){
                return res.sendClientError('Incomplete Values')
            }

            await aboutInfoService.updateInfoById(infoId, updates)

            res.sendSuccess(`Entry ID ${infoId} updated`)

        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }


    async deleteInfoById (req, res) {
        try {
            const infoId  = req.params.infoId
            await aboutInfoService.deleteInfoById(infoId)

            res.sendSuccess(`Info Id: ${infoId} was deleted successfully`)

        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }

}