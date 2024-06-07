export default class CountriesTurso {
    constructor(client){ 
        console.log('Working CountriesDB with Turso')
        this.client = client
    }

    getAll = async () => {
        const [result] = await this.client.execute({
            sql:`SELECT BIN_TO_UUID(c.country_id) country_id, c.name as country, cnt.name as continent, co.title, co.paragraph
            FROM countries c
            INNER JOIN continents cnt ON c.continent_id = cnt.continent_id
            INNER JOIN relations r ON c.country_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id;`
        })
        return result
    } 

    getById = async (countryId) => {
        const [result] = await this.client.execute({
            sql:`SELECT BIN_TO_UUID(c.country_id) country_id, c.name as country, cnt.name as continent, co.title, co.paragraph
            FROM countries c
            INNER JOIN continents cnt ON c.continent_id = cnt.continent_id
            INNER JOIN relations r ON c.country_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE c.country_id = UUID_TO_BIN(?);`,
            args:[countryId]
        })
        return result
    }
    
    getByName = async (country) => {
        const name = country.toLowerCase()
        const [result] = await this.client.execute({
            sql:`SELECT BIN_TO_UUID(c.country_id) country_id, c.name, cnt.name as continent, co.title, co.paragraph
            FROM countries c
            INNER JOIN continents cnt ON c.continent_id = cnt.continent_id
            INNER JOIN relations r ON c.country_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE LOWER(c.name) = ?;`,
            args:[name]
        })
        return result
    }

    getIdByName = async (countries) => {
        const name = countries.toLowerCase()
        const [result] = await this.client.execute({
            sql:`SELECT BIN_TO_UUID(country_id) country_id
            FROM countries
            WHERE LOWER(name) = ?;`,
            args:[name]
        })
        return result[0]
    }


    getByParent = async (continent)=> {
        const [result] = await this.client.execute({
            sql:`SELECT BIN_TO_UUID(country_id) country_id, c.name as country, cnt.name as continent, co.title, co.paragraph
            FROM countries c
            INNER JOIN relations r ON c.country_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            INNER JOIN continents cnt ON c.continent_id = cnt.continent_id
            WHERE cnt.continent_id = UUID_TO_BIN(?);`,
            args:[continent]
        })
        return result
    }

    create = async (country) => {
        const result = await this.client.execute({
            sql:`INSERT INTO countries (name, continent_id) VALUES (?, UUID_TO_BIN(?));`,
            args:[country.name, country.continentId]
        })
        return result
    }
    
    updateById = async (countryId, updates) => {
       const result = await this.client.execute({
        sql:`UPDATE countries c 
        INNER JOIN relations r ON c.country_id = r.record_id
        INNER JOIN content co ON r.content_id = co.content_id  
        SET c.name = ?, co.title = ?, co.paragraph = ?
        WHERE BIN_TO_UUID(c.country_id) = ?;`,
        args:[updates.name, updates.title, updates.paragraph, countryId]
       })
       return result 
    }

    updateByName = async (country, updates) => {
        const name = country.toLowerCase()
        const result = await this.client.execute({
            sql:`UPDATE countries c 
            INNER JOIN relations r ON c.country_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id  
            SET c.name = ?, co.title = ?, co.paragraph = ?
            WHERE LOWER(c.name) = ?;`,
            args:[updates.name, updates.title, updates.paragraph , name]
        })
        return result 
    }

    deleteById = async (countryId) => {
        const [result] = await this.client.execute({
            sql:`DELETE r, c, co
            FROM relations r
            INNER JOIN countries c ON r.record_id = c.country_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE country_id = UUID_TO_BIN(?);`,
            args:[countryId]
        })
        return result
    }

    deleteByName = async (country) => {
        const name = country.toLowerCase()
        const [result] = await this.client.execute({
            sql:`DELETE r, c, co
            FROM relations r
            INNER JOIN countries c ON r.record_id = c.country_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE LOWER(c.name) = ?;`,
            args:[name]
        })
        return result
    }

}
