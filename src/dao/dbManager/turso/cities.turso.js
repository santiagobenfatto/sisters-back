export default class CitiesTurso {
    constructor(client){ 
        console.log('Working CitiesDB with Turso')
        this.client = client
    }

    getAll = async () => {
        const [result] = await this.client.execute({
            sql: `SELECT BIN_TO_UUID(c.city_id) city_id, c.name as city, p.name as province, co.title, co.paragraph
            FROM cities c
            INNER JOIN provinces p ON c.province_id = p.province_id
            INNER JOIN relations r ON c.city_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id;`
        })
        return result
    } 

    getById = async (cityId) => {
        const [result] = await this.client.execute({
            sql:`SELECT BIN_TO_UUID(c.city_id) city_id, c.name as city, p.name as province, co.title, co.paragraph
            FROM cities c
            INNER JOIN provinces p ON c.province_id = p.province_id
            INNER JOIN relations r ON c.city_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE city_id = UUID_TO_BIN(?);`,
            args:[cityId]
        })
        return result
    }


    getByName = async (name) => {
        const nameToLower = name.toLowerCase()

        const [result] = await this.client.execute({
            sql: `SELECT BIN_TO_UUID(city_id) city_id, name
            FROM cities 
            WHERE LOWER(name) = ?;`,
            args:[nameToLower]
        })
        return result
    }

    getIdByName = async (cities) => {
        const name = cities.toLowerCase()
        const [result] = await this.client.execute({
            sql:`SELECT BIN_TO_UUID(city_id) city_id, name
            FROM cities 
            WHERE LOWER(name) = ?;`,
            args:[name]
        })
        return result[0]
    }
    


    getByParent = async (provinceId)=> {
        const [result] = await this.client.execute({
            sql:`SELECT BIN_TO_UUID(c.city_id) city_id, c.name as city, p.name as province, co.title, co.paragraph
            FROM cities c
            INNER JOIN provinces p ON c.province_id = p.province_id
            INNER JOIN relations r ON c.city_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE c.province_id = UUID_TO_BIN(?);`,
            args:[provinceId]
        })
        return result

    }

    create = async (city) => {
        const result = await this.client.execute({
            sql:`INSERT INTO cities (name, province_id) VALUES (?, UUID_TO_BIN(?));`,
            args:[city.name, city.provinceId]
        })
        return result
    }

    updateById = async (cityId, updates) => {
        const result = await this.client.execute({
            sql:`UPDATE cities c
            INNER JOIN provinces p ON c.province_id = p.province_id
            INNER JOIN relations r ON c.city_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            SET c.name = ?, co.title = ?, co.paragraph = ?
            WHERE BIN_TO_UUID(city_id) = ?;`,
            args:[updates.name, updates.title, updates.paragraph, cityId]
        })
       return result
    }

    updateByName = async (city, updates) => {
        const name = city.toLowerCase()
        
        const result = await this.client.execute({
            sql:`UPDATE cities c
            INNER JOIN provinces p ON c.province_id = p.province_id
            INNER JOIN relations r ON c.city_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            SET c.name = ?, co.title = ?, co.paragraph = ?
            WHERE LOWER(c.name) = ?;`,
            args:[updates.name, updates.title, updates.paragraph, name]
        })
       return result 
    }

    deleteById = async (cityId) => {
        const [result] = await this.client.execute({
            sql:`DELETE FROM cities
            WHERE city_id = UUID_TO_BIN(?);`,
            args:[cityId]
        })
        return result
    }

    deleteByName = async (city) => {
        const name = city.toLowerCase()
        const [result] = await this.client.execute({
            sql:`DELETE FROM cities
            WHERE LOWER(name) = ?;`,
            args:[name]
        })
        return result
    }

}
