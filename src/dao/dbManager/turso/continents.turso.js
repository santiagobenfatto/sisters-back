export default class ContinentsTurso {
    constructor(client){ 
        console.log('Working ContinentsDB with Turso')
        this.client = client
    }

    getAll = async () => {
        const [result] = await this.client.execute({
            sql:`SELECT BIN_TO_UUID(continent_id) continent_id, name
            FROM continents;`
        })
        return result
    } 

    
    getById = async (continentId) => {
        const [result] = await this.client.execute({
            sql:`SELECT  BIN_TO_UUID(c.continent_id) continent_id, c.name, co.title, co.paragraph
            FROM continents c
            INNER JOIN relations r ON c.continent_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE c.continent_id = UUID_TO_BIN(?);`,
            args:[continentId]
        })
        return result
    }
    
    getByName = async (continent) => {
        const name = continent.toLowerCase()
        const [result] = await this.client.execute({
            sql:`SELECT  BIN_TO_UUID(c.continent_id) continent_id, c.name, co.title, co.paragraph
            FROM continents c
            INNER JOIN relations r ON c.continent_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE LOWER(name) = ?;`,
            args:[name]
        })
        return result
    }

    getIdByName = async (continent) => {
        const name = continent.toLowerCase()
        const [result] = await this.client.execute({
            sql:`SELECT BIN_TO_UUID(continent_id) continent_id
            FROM continents
            WHERE LOWER(name) = ?;`,
            args:[name]
        })
        return result[0]
    }

    create = async (continent) => {
        const result = await this.client.execute({
            sql:`INSERT INTO continents (name) VALUES (?);`,
            args:[continent.name]
        })
        return result
    }
    
    updateById = async (continentId, updates) => {
        const result = await this.client.execute({
            sql:`UPDATE continents c
            INNER JOIN relations r ON c.continent_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id  
            SET c.name = ?, co.title = ?, co.paragraph = ?
            WHERE BIN_TO_UUID(c.continent_id) = ?;`,
            args:[updates.name, updates.title, updates.paragraph, continentId]
        })
        return result 
    }

    updateByName = async (continent, updates) => {
        const name = continent.toLowerCase()
        const result = await this.client.execute({
            sql:`UPDATE continents c
            INNER JOIN relations r ON c.continent_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id  
            SET c.name = ?, co.title = ?, co.paragraph = ?
            WHERE LOWER(c.name) = ?;`,
            args:[updates.name, updates.title, updates.paragraph, name]
        })
        return result 
    }


    deleteById = async (continentId) => {
        const [result] = await this.client.execute({
            sql:`DELETE r, c, co 
            FROM relations r
            INNER JOIN continents c ON r.record_id = c.continent_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE continent_id = UUID_TO_BIN(?);`,
            args:[continentId]
        })
        return result
    }

    deleteByName = async (continent) => {
        const name = continent.toLowerCase()
        const [result] = await this.client.execute({
            sql:`DELETE r, c, co 
            FROM relations r
            INNER JOIN continents c ON r.record_id = c.continent_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE LOWER(c.name) = ?;`,
            args:[name]
        })
        return result
    }
}

