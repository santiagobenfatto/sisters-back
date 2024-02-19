import Router from './app.routes.js'
import AboutInfoController from '../controllers/aboutInfo.controller.js'
import { strategyEnum } from '../utils/passportStrategies.js'

const aboutInfoController = new AboutInfoController()

export default class AboutInfoRouter extends Router {
    init(){
        this.get('/',['PUBLIC'], strategyEnum.NOTHING, aboutInfoController.getAllInfo)
        this.get('/:infoId', ['PUBLIC'], strategyEnum.NOTHING, aboutInfoController.getInfoById)

        this.post('/info', ['ADMIN'], strategyEnum.JWT, aboutInfoController.createInfo)
        this.post('/content/:name', ['ADMIN'], strategyEnum.JWT, aboutInfoController.addContent)

        this.put('/:infoId', ['ADMIN'], strategyEnum.JWT, aboutInfoController.updateInfoById)

        this.delete('/:infoId', ['ADMIN'], strategyEnum.JWT, aboutInfoController.deleteInfoById)
    }
}