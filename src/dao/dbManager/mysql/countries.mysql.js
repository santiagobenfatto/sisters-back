export default class CountriesMySQL {
    constructor(connection){ 
        console.log('Working CountriesDB with MySQL')
        this.connection = connection
    }

    getAll = async () => {
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(c.country_id) country_id, c.name as country, cnt.name as continent, co.title, co.paragraph
            FROM countries c
            INNER JOIN continents cnt ON c.continent_id = cnt.continent_id
            INNER JOIN relations r ON c.country_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id;`
        )
        return result
    } 

    getById = async (countryId) => {
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(c.country_id) country_id, c.name as country, cnt.name as continent, co.title, co.paragraph
            FROM countries c
            INNER JOIN continents cnt ON c.continent_id = cnt.continent_id
            INNER JOIN relations r ON c.country_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE c.country_id = UUID_TO_BIN(?);`,
            [countryId]
        )
        return result
    }
    
    getByName = async (country) => {
        const name = country.toLowerCase()
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(c.country_id) country_id, c.name, cnt.name as continent, co.title, co.paragraph
            FROM countries c
            INNER JOIN continents cnt ON c.continent_id = cnt.continent_id
            INNER JOIN relations r ON c.country_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE LOWER(c.name) = ?;`,
            [name]
        )
        return result
    }

    getIdByName = async (countries) => {
        const name = countries.toLowerCase()
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(country_id) country_id
            FROM countries
            WHERE LOWER(name) = ?;`,
            [name]
        )
        return result[0]
    }


    getByParent = async (continent)=> {
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(country_id) country_id, c.name as country, cnt.name as continent, co.title, co.paragraph
            FROM countries c
            INNER JOIN relations r ON c.country_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            INNER JOIN continents cnt ON c.continent_id = cnt.continent_id
            WHERE cnt.continent_id = UUID_TO_BIN(?);`,
            [continent]
        )
        return result
    }

    create = async (country) => {
        const result = await this.connection.query(
            `INSERT INTO countries (name, continent_id) VALUES (?, UUID_TO_BIN(?));`,
            [country.name, country.continentId]
        )
        
        return result
    }
    
    updateById = async (countryId, updates) => {
       const result = await this.connection.query(
            `UPDATE countries c 
            INNER JOIN relations r ON c.country_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id  
            SET c.name = ?, co.title = ?, co.paragraph = ?
            WHERE BIN_TO_UUID(c.country_id) = ?;`,
        [updates.name, updates.title, updates.paragraph, countryId]
       )
       return result 
    }

    updateByName = async (country, updates) => {
        const name = country.toLowerCase()
        const result = await this.connection.query(
            `UPDATE countries c 
            INNER JOIN relations r ON c.country_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id  
            SET c.name = ?, co.title = ?, co.paragraph = ?
            WHERE LOWER(c.name) = ?;`,
            [updates.name, updates.title, updates.paragraph , name]
        )
        return result 
    }

    deleteById = async (countryId) => {
        const [result] = await this.connection.query(
            `DELETE r, c, co 
            FROM relations r
            INNER JOIN countries c ON r.record_id = c.country_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE country_id = UUID_TO_BIN(?);`,
            [countryId]
        )
        return result
    }

    deleteByName = async (country) => {
        const name = country.toLowerCase()
        const [result] = await this.connection.query(
            `DELETE r, c, co 
            FROM relations r
            INNER JOIN countries c ON r.record_id = c.country_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE LOWER(c.name) = ?;`,
            [name]
        )
        return result
    }

}
