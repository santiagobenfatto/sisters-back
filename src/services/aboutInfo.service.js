import { ElementNotFound } from '../utils/custom-exceptions.js'

export default class AboutInfoService {
    constructor(aboutInfoRepository, contentRepository, relationsRepository){
        this.aboutInfoRepository = aboutInfoRepository
        this.contentRepository = contentRepository
        this.relationsRepository = relationsRepository
    }

    getAllInfo = async () => {
        const result = await this.aboutInfoRepository.getAll()
        if(result.length === 0){
            throw new ElementNotFound('Info not found')
        }
        return result
    }

    getInfoById = async (infoId) =>{
        const info = await this.aboutInfoRepository.getById(infoId)
            
        if(info.length === 0){
            throw new ElementNotFound('Info not found')
        }
        return info
    }

    createRelation = async (params) => {
        const infoId = await this.aboutInfoRepository.getIdByName(params.topic)
        const contentId = await this.contentRepository.getIdByName(params.title)

        const relations = {
            contentId: contentId.content_id,
            recordId : infoId.info_id,
            recordType: 'info'
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

    createInfo = async (info) => {    
        
        const newInfo = {
            topic: info.topic
        }
        
        await this.createContent(info)
        
        const result = await this.aboutInfoRepository.create(newInfo)
        
        await this.createRelation(info)

        return result
    }

    addContent = async (info) => {
        const findInfo = await this.aboutInfoRepository.getByName(info.topic)

        if (findInfo.length === 0) {
            throw new ElementNotFound(`Info ${info.name} not found`)
        }
        
        await this.createContent(info)
        const result = await this.createRelation(info)

        return result
    }

    updateInfoById = async (infoId, updates) => {
        const findInfo = await this.aboutInfoRepository.getById(infoId)
    
        if(findInfo.length === 0){
            throw new ElementNotFound(`Info with id ${infoId} not found`)
        }
        
        const result = await this.aboutInfoRepository.updateById(infoId, updates)

        return result
    }

    deleteInfoById = async (infoId) => {
        const findEntry = await this.aboutInfoRepository.getById(infoId)

        if(findEntry.length === 0){
            throw new ElementNotFound(`Info with id ${infoId} not found`)
        }
        const result = await this.aboutInfoRepository.deleteById(infoId)
        return result
    }
}