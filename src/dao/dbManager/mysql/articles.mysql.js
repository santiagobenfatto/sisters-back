export default class ArticlesMySQL {
    constructor(connection){ 
        console.log('Working ArticlesDB with MySQL')
        this.connection = connection
    }

    getAll = async () => {
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(article_id) article_id, a.topic, co.title, co.paragraph
            FROM articles a
            INNER JOIN relations r ON a.article_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id;`
        )
        return result
    }

    getById = async (articleId) => {
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(article_id) article_id, a.topic, co.title, co.paragraph
            FROM articles a
            INNER JOIN relations r ON a.article_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE a.article_id = UUID_TO_BIN(?);`,
            [articleId]
        )
        return result
    }

    getIdByName = async (article) => {
        const name = article.toLowerCase()
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(article_id) article_id, topic
            FROM articles
            WHERE LOWER(topic) = ?;`,
            [name]
        )
        return result[0]
    }

    getByName = async (name) => {
        const topic = name.toLowerCase()
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(article_id) article_id, a.topic, co.title, co.paragraph
            FROM articles a
            INNER JOIN relations r ON a.article_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            WHERE LOWER(a.topic) = ?;`,
            [topic]
        )
        return result
    }

    create = async (articleTopic) => {
        const result = await this.connection.query(
            `INSERT INTO articles (topic) VALUES (?);`,
            [articleTopic.topic]
        )
        return result
    }

    updateById = async (articleId, updates) => {
        const result = await this.connection.query(
            `UPDATE articles a
            INNER JOIN relations r ON a.article_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            SET a.topic = ?, co.title = ?, co.paragraph = ?
            WHERE BIN_TO_UUID(a.article_id) = ?;`,
            [updates.topic, updates.title, updates.paragraph, articleId]
        )
        return result
    }

    updateByName = async (name, updates) => {
        const topic = name.toLowerCase()
        const result = await this.connection.query(
            `UPDATE articles a
            INNER JOIN relations r ON a.article_id = r.record_id
            INNER JOIN content co ON r.content_id = co.content_id
            SET a.topic = ? , co.title = ?, co.paragraph = ?
            WHERE LOWER(a.topic) = ?;`,
            [updates.topic, updates.title, updates.paragraph, topic]
        )
        return result
    }
    
    deleteById = async (articleId) => {
        const [result] = await this.connection.query(
            `DELETE FROM articles
            WHERE BIN_TO_UUID(article_id) = ?;`,
            [articleId]
        )
        return result
    }

    deleteByName = async (name) => {
        const [result] = await this.connection.query(
            `DELETE FROM articles
            WHERE LOWER(topic) = ?;`,
            [name]
        )
        return result
    }

}
