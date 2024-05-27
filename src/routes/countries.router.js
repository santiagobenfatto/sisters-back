import Router from './app.routes.js'
import CountriesController from '../controllers/countries.controller.js'
import { strategyEnum } from '../utils/passportStrategies.js'

const countriesController = new CountriesController()

export default class CountriesRouter extends Router {
    init(){
        this.get('/', ['PUBLIC'], strategyEnum.NOTHING,countriesController.getAllCountries)
        this.get('/:countryId', ['PUBLIC'], strategyEnum.NOTHING,countriesController.getCountryById)
        this.get('/country/:name', ['PUBLIC'], strategyEnum.NOTHING,countriesController.getCountryByName)
        this.get('/continent/:continent', ['PUBLIC'], strategyEnum.NOTHING,countriesController.getCountriesByContinentName)
       
        this.post('/country', ['ADMIN'], strategyEnum.JWT,countriesController.createCountry)
        this.post('/content/:name', ['ADMIN'], strategyEnum.JWT,countriesController.addContent)


        this.put('/:countryId', ['ADMIN'], strategyEnum.JWT,countriesController.updateCountryById)
        this.put('/country/:name', ['ADMIN'], strategyEnum.JWT,countriesController.updateCountryByName)

        this.delete('/:countryId', ['ADMIN'], strategyEnum.JWT,countriesController.deleteCountryById)
        this.delete('/country/:name', ['ADMIN'], strategyEnum.JWT,countriesController.deleteCountryByName)
    }
}