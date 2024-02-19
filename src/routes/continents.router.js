import Router from './app.routes.js'
import ContinentsController from '../controllers/continents.controller.js'
import { strategyEnum } from '../utils/passportStrategies.js'

const continentsController = new ContinentsController()

export default class ContinentsRouter extends Router {
    init(){
        this.get('/', ['PUBLIC'], strategyEnum.NOTHING, continentsController.getAllContinents)
        this.get('/:continentId', ['PUBLIC'], strategyEnum.NOTHING, continentsController.getContinentById)
        this.get('/continent/:name', ['PUBLIC'], strategyEnum.NOTHING, continentsController.getContinentByName)

        this.post('/continent', ['ADMIN'], strategyEnum.JWT, continentsController.createContinent)
        this.post('/content/:name', ['ADMIN'], strategyEnum.JWT, continentsController.addContent)

        this.put('/:continentId', ['ADMIN'], strategyEnum.JWT, continentsController.updateContinentById)
        this.put('/continent/:name', ['ADMIN'], strategyEnum.JWT, continentsController.updateContinentByName)

        this.delete('/:continentId', ['ADMIN'], strategyEnum.JWT, continentsController.deleteContinentById)
        this.delete('/continent/:name', ['ADMIN'], strategyEnum.JWT, continentsController.deleteContinentByName)
    }
}