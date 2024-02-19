import Router from './app.routes.js'
import CitiesController from '../controllers/cities.controller.js'
import { strategyEnum } from '../utils/passportStrategies.js'

const citiesController = new CitiesController()

export default class CountriesRouter extends Router {
    init(){
        // '/apit/cities/...'
        this.get('/', ['PUBLIC'], strategyEnum.NOTHING, citiesController.getAllCities)
        this.get('/:cityId', ['PUBLIC'], strategyEnum.NOTHING, citiesController.getCityById)
        this.get('/city/:name', ['PUBLIC'], strategyEnum.NOTHING, citiesController.getCityByName)
        this.get('/province/:provinceId', ['PUBLIC'], strategyEnum.NOTHING, citiesController.getCityByProvinceId)
        this.get('/country/:countryId', ['PUBLIC'], strategyEnum.NOTHING, citiesController.getCityByCountryId)

        this.post('/city', ['ADMIN'], strategyEnum.JWT, citiesController.createCity)
        this.post('/content/:name', ['ADMIN'], strategyEnum.JWT, citiesController.addContent)

        this.put('/:cityId', ['ADMIN'], strategyEnum.JWT, citiesController.updateCityById)
        this.put('/city/:name', ['ADMIN'], strategyEnum.JWT, citiesController.updateCityByName)

        this.delete('/:cityId', ['ADMIN'], strategyEnum.JWT, citiesController.deleteCityById)
        this.delete('/city/:name', ['ADMIN'], strategyEnum.JWT, citiesController.deleteCityByName)
    }
}