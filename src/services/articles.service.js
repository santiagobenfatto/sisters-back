import { ElementNotFound } from '../utils/custom-exceptions.js'

export default class ArticlesService {
    constructor(articlesRepository, contentRepository, relationsRepository){
        this.articlesRepository = articlesRepository
        this.contentRepository = contentRepository
        this.relationsRepository = relationsRepository
    }


    getAllArticles = async () => {
        const result = await this.articlesRepository.getAll()
        
        if(result.length === 0){
            throw new ElementNotFound('Article not found')
        }
        return result
    }

    getArticleById = async (articleId) => {
        const article = await this.articlesRepository.getById(articleId)        
        if(article.length === 0){
            throw new ElementNotFound('Article not found')
        }
        return article
    }

    getArticleByName = async (name) => {
        const article = await this.articlesRepository.getByName(name)
        if(article.length === 0){
            throw new ElementNotFound('Article not found')
        }
        return article
    }

    createRelation = async (params) => {
        const articleId = await this.articlesRepository.getIdByName(params.topic)
        const contentId = await this.contentRepository.getIdByName(params.title)
        

        const relations = {
            contentId: contentId.content_id,
            recordId : articleId.article_id,
            recordType: 'articles'
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

    createArticle = async (article) => {    
        
        const newArticle = {
            topic: article.topic
        }

        await this.createContent(article)

        const result = await this.articlesRepository.create(newArticle)

        await this.createRelation(article)

        return result
    }

    addContent = async (article) => {
        const findArticle = await this.articlesRepository.getByName(article.name)

        if (findArticle.length === 0) {
            throw new ElementNotFound(`Article ${article.name} not found`)
        }
        
        await this.createContent(article)
        const result = await this.createRelation(article)

        return result
    }

    updateArticleById = async (articleId, updates) => {
        const findArticle = await this.articlesRepository.getById(articleId)

        if(findArticle.length === 0){
            throw new ElementNotFound(`Article with id ${articleId} not found`)
        }

        const result = await this.articlesRepository.updateById(articleId, updates)

        return result
    }

    deleteArticleById = async (articleId) => {
        const findArticle = await this.articlesRepository.getById(articleId)

        if(findArticle.length === 0){
            throw new ElementNotFound(`Article with id ${articleId} not found`)
        }
        const result = await this.articlesRepository.deleteById(articleId)
        return result
    }

}
