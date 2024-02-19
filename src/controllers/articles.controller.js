import { articlesRepository, contentRepository, relationsRepository } from '../repositories/index.js'
import ArticlesService from '../services/articles.service.js'
import ContentDTO from '../DTOs/content.dto.js'
import { ElementNotFound, ElementAlreadyExists } from '../utils/custom-exceptions.js'


const articlesService = new ArticlesService(articlesRepository, contentRepository, relationsRepository)


export default class ArticlesController {
    async getAllEntries (req, res) {
        try {
            const entries = await articlesService.getAllArticles()
            res.sendSuccess(entries)
        } catch (error) {
            res.sendServerError(error.message)
        }
    }

    async getArticleById (req, res) {
        try {
            const articleId = req.params.articleId
            const article = await articlesService.getArticleById(articleId)
            res.sendSuccess(article)
        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }
    async getArticleByName (req, res) {
        try {
            const articleName = req.params.article
            const article = await articlesService.getArticleByName(articleName)
            const DTO = ContentDTO.transformContent(article)
            res.sendSuccess(DTO)
        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error.message)
        }
    }

    async createArticle (req, res) {
        try {
            const { topic, title, paragraph } = req.body
            
            if(!topic || !title || !paragraph){
               return res.sendClientError('Incomplete Values')
            }

            await articlesService.createArticle({...req.body})

            res.sendSuccess(`Entry ${title} created`)

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

            await articlesService.addContent({topic, ...req.body})

            res.sendSuccess(`Content added to Articles ${topic}, title:  ${title} `)

        } catch (error) {
            if(error instanceof ElementAlreadyExists){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }
    
    async updateArticleById (req, res) {
        try {
            const articleId = req.params.articleId
            const updates = req.body

            if(!updates.topic || !updates.title || !updates.paragraph){
                return res.sendClientError('Incomplete Values')
            }

            await articlesService.updateArticleById(articleId, updates)

            res.sendSuccess(`Article ID ${articleId} updated`)

        } catch (error) {
            if(error instanceof ElementNotFound){
                res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }


    async deleteArticleById (req, res) {
        try {
            const articleId = req.params.articleId
            await articlesService.deleteArticleById(articleId)

            res.sendSuccess(`Entry Id: ${articleId} was deleted successfully`)

        } catch (error) {
            if(error instanceof ElementNotFound){
                return res.sendClientError(error.message)
            }
            res.sendServerError(error)
        }
    }

}