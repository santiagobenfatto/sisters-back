import config from '../config/config.js'

export default class DAOModuleGenerator {
    
    static async createModule(className){
        if(config.persistence === 'mysql'){
        const module = await import(`./dbManager/mysql/${className}.mysql.js`)
        return module.default
        } else if(config.persistence === 'turso'){
            const module = await import(`./dbManager/turso/${className}.turso.js`)
            return module.default
        
        } else {
            console.log('Persistence not found')
            return module.default
        }
    }

    //If module qty increase, don't create this methods and use createModule directly
    static async UsersModule () {
        return DAOModuleGenerator.createModule('users')
    }
    
    static async ContinentsModule () {
        return DAOModuleGenerator.createModule('continents')
    }

    static async CountriesModule () {
        return DAOModuleGenerator.createModule('countries')
    }

    static async ProvincesModule () {
        return DAOModuleGenerator.createModule('provinces')
    }

    static async CitiesModule () {
        return DAOModuleGenerator.createModule('cities')
    }

    static async AboutInfoModule () {
        return DAOModuleGenerator.createModule('aboutInfo')
    }

    static async ArticlesModule () {
        return DAOModuleGenerator.createModule('articles')
    }
    
    static async ContentModule () {
        return DAOModuleGenerator.createModule('content')
    }

    static async RelationsModule () {
        return DAOModuleGenerator.createModule('relations')
    }

    static async UsersModule () {
        return DAOModuleGenerator.createModule('users')
    }
}