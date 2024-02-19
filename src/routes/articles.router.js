import Router from './app.routes.js'
import ArticlesController from '../controllers/articles.controller.js'
import { strategyEnum } from '../utils/passportStrategies.js'

const articlesController = new ArticlesController()

export default class NewsRouter extends Router {
    init(){
        this.get('/',['PUBLIC'], strategyEnum.NOTHING, articlesController.getAllEntries)
        this.get('/:articleId',['PUBLIC'], strategyEnum.NOTHING, articlesController.getArticleById)
        this.get('/article/:article',['PUBLIC'], strategyEnum.NOTHING, articlesController.getArticleByName)

        this.post('/article',['ADMIN'], strategyEnum.JWT, articlesController.createArticle)
        this.post('/content/:name',['ADMIN'], strategyEnum.JWT, articlesController.addContent)

        this.put('/:articleId',['ADMIN'], strategyEnum.JWT, articlesController.updateArticleById)

        this.delete('/:articleId',['ADMIN'], strategyEnum.JWT, articlesController.deleteArticleById)
    }
}