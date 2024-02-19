import mySqlConnection from '../config/mysql.config.js'
import DAOModuleGenerator from '../dao/index.js'
import ContinentsRepository from './continents.repository.js'
import CountriesRepository from './countries.repository.js'
import ProvincesRepository from './provinces.repository.js'
import CitiesRepository from './cities.repository.js'
import AboutInfoRepository from './aboutInfo.repository.js'
import ArticlesRepository from './articles.repository.js'
import ContentRepository from './content.repository.js'
import RelationsRepository from './relations.repository.js'
import UsersRepository from './users.repository.js'

const continentsModule = await DAOModuleGenerator.ContinentsModule()
const countriesModule = await DAOModuleGenerator.CountriesModule()
const provinceModule = await DAOModuleGenerator.ProvincesModule()
const citiesModule = await DAOModuleGenerator.CitiesModule()
const aboutInfoModule = await DAOModuleGenerator.AboutInfoModule()
const articlesModule = await DAOModuleGenerator.ArticlesModule()
const contentModule = await DAOModuleGenerator.ContentModule()
const relationsModule = await DAOModuleGenerator.RelationsModule()
const usersModule = await DAOModuleGenerator.UsersModule()

export const continentsRepository = new ContinentsRepository(new continentsModule(mySqlConnection))
export const countriesRepository = new CountriesRepository(new countriesModule(mySqlConnection))
export const provincesRepository = new ProvincesRepository(new provinceModule(mySqlConnection))
export const citiesRepository = new CitiesRepository(new citiesModule(mySqlConnection))
export const aboutInfoRepository = new AboutInfoRepository(new aboutInfoModule(mySqlConnection))
export const articlesRepository = new ArticlesRepository(new articlesModule(mySqlConnection))
export const contentRepository = new ContentRepository(new contentModule(mySqlConnection))
export const relationsRepository = new RelationsRepository(new relationsModule(mySqlConnection))
export const usersRepository = new UsersRepository(new usersModule(mySqlConnection))