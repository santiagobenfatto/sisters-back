import Router from './app.routes.js'
import ProvincesController from '../controllers/provinces.controller.js'
import { strategyEnum } from '../utils/passportStrategies.js'

const provincesController = new ProvincesController()

export default class ProvincesRouter extends Router {
    init(){
        //'/api/provinces...'
        this.get('/', ['PUBLIC'], strategyEnum.NOTHING, provincesController.getAllProvinces)
        this.get('/:provinceId', ['PUBLIC'], strategyEnum.NOTHING, provincesController.getProvinceById)
        this.get('/province/:name', ['PUBLIC'], strategyEnum.NOTHING, provincesController.getProvinceByName)
        this.get('/country/:country', ['PUBLIC'], strategyEnum.NOTHING, provincesController.getProvinceByCountryName)
        
        this.post('/province', ['ADMIN'], strategyEnum.JWT, provincesController.createProvince)
        this.post('/content', ['ADMIN'], strategyEnum.JWT, provincesController.addContent)
       
        this.put('/:provinceId', ['ADMIN'], strategyEnum.JWT, provincesController.updateProvinceById)
        this.put('/province/:name', ['ADMIN'], strategyEnum.JWT, provincesController.updateProvinceByName)
       
        this.delete('/:provinceId', ['ADMIN'], strategyEnum.JWT, provincesController.deleteProvinceById)
        this.delete('/province/:name', ['ADMIN'], strategyEnum.JWT, provincesController.deleteProvinceByName)
    }ADMIN
}

//TESTEAR ENDPOINJWTUE LOS CAMBIÉ