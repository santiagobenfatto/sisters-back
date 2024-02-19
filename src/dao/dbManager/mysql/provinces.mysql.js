export default class ProvincesMySQL {
    constructor(connection){ 
        console.log('Working ProvincesDB with MySQL')
        this.connection = connection
    }

    getAll = async () => {
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(p.province_id) province_id, p.name as province, c.name as country, co.title, co.paragraph
            FROM provinces p
            INNER JOIN countries c ON p.country_id = c.country_id
            INNER JOIN relations r ON p.province_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id;`
        )
        return result
    } 
   
    getById = async (provinceId) => {
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(p.province_id) province_id, p.name as province, c.name as country, co.title, co.paragraph
            FROM provinces p
            INNER JOIN countries c ON p.country_id = c.country_id
            INNER JOIN relations r ON p.province_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE p.province_id = UUID_TO_BIN(?);`,
            [provinceId]
        )
        return result
    }

    getByName = async (name) => {
        const nameToLower = name.toLowerCase()
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(p.province_id) province_id, p.name, c.name as country, co.title, co.paragraph
            FROM provinces p
            INNER JOIN countries c ON p.country_id = c.country_id
            INNER JOIN relations r ON p.province_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE LOWER(p.name) = ?;`,
            [nameToLower]
        )
        return result
    }

    getIdByName = async (province) => {
        const name = province.toLowerCase()
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(province_id) province_id
            FROM provinces
            WHERE LOWER(name) = ?;`,
            [name]
        )
        return result[0]
    }

    getByParent = async (countryId) => {
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(province_id) province_id, p.name as province, c.name as country, co.title, co.paragraph 
            FROM provinces p
            INNER JOIN countries c ON p.country_id = c.country_id
            INNER JOIN relations r ON p.province_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE c.country_id = UUID_TO_BIN(?);`,
            [countryId]
        )
        return result
    }
   
    create = async (province) => {  
        const result = await this.connection.query(
            `INSERT INTO provinces (name, country_id) VALUES (?, UUID_TO_BIN(?));`,
            [province.name, province.countryId]
        )
        return result
    }

    updateById = async (provinceId, updates) => {
       const result = await this.connection.query(
                `UPDATE provinces p 
                INNER JOIN relations r ON p.province_id = r.record_id
                INNER JOIN content co ON r.content_id = co.content_id  
                SET p.name = ?, co.title = ?, co.paragraph = ?
                WHERE BIN_TO_UUID(p.province_id) = ?;`,
            [updates.name, updates.title, updates.paragraph, provinceId]
       )
       return result 
    }

    updateByName = async (province, updates) => {
        const name = province.toLowerCase()
        const result = await this.connection.query(
            `UPDATE provinces p
            INNER JOIN relations r ON p.province_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id 
            SET p.name = ?, co.title= ?, co.paragraph = ?
            WHERE LOWER(name) = ?;`,
            [updates.name, updates.title, updates.paragraph, name]
        )
        return result 
    }

    deleteById = async (provinceId) => {
        const [result] = await this.connection.query(
            `DELETE r, p, co 
            FROM relations r
            INNER JOIN provinces p ON r.record_id = p.province_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE province_id = UUID_TO_BIN(?);`,
            [provinceId]
        )
        return result
    }

    deleteByName = async (province) => {
        const name = province.toLowerCase()
        
        const [result] = await this.connection.query(
            `DELETE r, p, co 
            FROM relations r
            INNER JOIN provinces p ON r.record_id = p.province_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE LOWER(p.name) = ?;`,
            [name]
        )
        return result
    }
}
