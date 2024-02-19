export default class AboutInfoSQL {
    constructor(connection){ 
        console.log('Working About Us Info with MySQL')
        this.connection = connection
    }
    getAll = async () => {
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(info_id) info_id, ai.topic as topic, co.title, co.paragraph
            FROM about_info ai
            INNER JOIN relations r ON ai.info_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id;`
        )
        return result
    }

    getById = async (infoId) => {
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(ai.info_id) info_id, ai.topic as topic, co.title, co.paragraph
            FROM about_info ai
            INNER JOIN relations r ON ai.info_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE BIN_TO_UUID(ai.info_id) = ?;`,
            [infoId]
        )
        return result
    }

    getIdByName = async (info) => {
        const name = info.toLowerCase()
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(info_id) info_id, topic
            FROM about_info
            WHERE LOWER(topic) = ?;`,
            [name]
        )
        return result[0]
    }

    getByName = async (name) => {
        const topic = name.toLowerCase()
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(info_id) info_id, ai.topic as topic, co.title, co.paragraph
            FROM about_info ai
            INNER JOIN relations r ON a.article_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE LOWER(ai.topic) = ?;`,
            [topic]
        )
        return result
    }
    
    create = async (infoTopic) => {
        const result = await this.connection.query(
            `INSERT INTO about_info (topic) VALUES (?);`,
            [infoTopic.topic]
        )
        return result
    }

    updateById = async (infoId, updates) => {
        const result = await this.connection.query(
            `UPDATE about_info ai
            INNER JOIN relations r ON ai.info_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            SET ai.topic = ?, co.title = ?, co.paragraph = ?
            WHERE BIN_TO_UUID(ai.info_id) = ?;`,
            [updates.topic, updates.title, updates.paragraph, infoId]
        )
        return result
    }

    updateByName = async (name, updates) => {
        const topic = name.toLowerCase()
        const result = await this.connection.query(
            `UPDATE about_info ai
            INNER JOIN relations r ON a.article_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            SET ai.topic = ? , co.title = ?, co.paragraph = ?
            WHERE LOWER(ai.topic) = ?;`,
            [updates.topic, updates.title, updates.paragraph, topic]
        )
        return result
    }
    
    deleteById = async (infoId) => {
        const [result] = await this.connection.query(
            `DELETE FROM about_info
            WHERE BIN_TO_UUID(info_id) = ?;`,
            [infoId]
        )
        return result
    }

    deleteByName = async (name) => {
        const [result] = await this.connection.query(
            `DELETE FROM about_info
            WHERE LOWER(topic) = ?;`,
            [name]
        )
        return result
    }

}
