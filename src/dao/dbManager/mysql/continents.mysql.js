export default class ContinentsMySQL {
    constructor(connection){ 
        console.log('Working ContinentsDB with MySQL')
        this.connection = connection
    }

    getAll = async () => {
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(continent_id) continent_id, name
            FROM continents;`
        )
        return result
    } 

    
    getById = async (continentId) => {
        const [result] = await this.connection.query(
            `SELECT  BIN_TO_UUID(c.continent_id) continent_id, c.name, co.title, co.paragraph
            FROM continents c
            INNER JOIN relations r ON c.continent_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE c.continent_id = UUID_TO_BIN(?);`,
            [continentId]
        )
        return result
    }
    
    getByName = async (continent) => {
        const name = continent.toLowerCase()
        const [result] = await this.connection.query(
            `SELECT  BIN_TO_UUID(c.continent_id) continent_id, c.name, co.title, co.paragraph
            FROM continents c
            INNER JOIN relations r ON c.continent_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE LOWER(name) = ?;`,
            [name]
        )
        return result
    }

    getIdByName = async (continent) => {
        const name = continent.toLowerCase()
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(continent_id) continent_id
            FROM continents
            WHERE LOWER(name) = ?;`,
            [name]
        )
        return result[0]
    }

    create = async (continent) => {
        const result = await this.connection.query(
            `INSERT INTO continents (name) VALUES (?);`,
            [continent.name]
        )
        return result
    }
    
    updateById = async (continentId, updates) => {
        const result = await this.connection.query(
             `UPDATE continents c
             INNER JOIN relations r ON c.continent_id = r.record_id
             INNER JOIN content co ON r.content_id = co.content_id  
             SET c.name = ?, co.title = ?, co.paragraph = ?
             WHERE BIN_TO_UUID(c.continent_id) = ?;`,
         [updates.name, updates.title, updates.paragraph, continentId]
        )
        return result 
    }

    updateByName = async (continent, updates) => {
        const name = continent.toLowerCase()
        const result = await this.connection.query(
             `UPDATE continents c
             INNER JOIN relations r ON c.continent_id = r.record_id
             INNER JOIN content co ON r.content_id = co.content_id  
             SET c.name = ?, co.title = ?, co.paragraph = ?
             WHERE LOWER(c.name) = ?;`,
         [updates.name, updates.title, updates.paragraph, name]
        )
        return result 
    }


    deleteById = async (continentId) => {
        const [result] = await this.connection.query(
            `DELETE r, c, co 
            FROM relations r
            INNER JOIN continents c ON r.record_id = c.continent_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE continent_id = UUID_TO_BIN(?);`,
            [continentId]
        )
        return result
    }

    deleteByName = async (continent) => {
        const name = continent.toLowerCase()
        const [result] = await this.connection.query(
            `DELETE r, c, co 
            FROM relations r
            INNER JOIN continents c ON r.record_id = c.continent_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE LOWER(c.name) = ?;`,
            [name]
        )
        return result
    }
}

