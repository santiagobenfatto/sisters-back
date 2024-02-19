export default class ContentMySQL {
    constructor(connection){ 
        console.log('Working ContentsDB with MySQL')
        this.connection = connection
    }

    getAll = async (content) => {
        const result = await this.connection.query(
            `SELECT BIN_TO_UUID(content_id) content_id, title
            FROM content;`
        )
        return result
    }

    create = async (content) => {
        const result = await this.connection.query(
            `INSERT INTO content (title, paragraph) VALUES (?,?);`,
            [content.title, content.paragraph]
        )
        return result

    }

    getIdByName = async (content) => {
        const name = content.toLowerCase()
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(content_id) content_id
            FROM content
            WHERE LOWER(title) = ?;`,
            [name]
        )
        return result[0]
    }

    getById = async (contentId) => {
        const [result] = this.connection.query(
            `SELECT BIN_TO_UUID(content_id) content_id, title, paragraph
            FROM content
            WHERE content_id = UUID_TO_BIN(?);`,
            [contentId]
        )
        return result
    }
    
    updateById = async (contentId, updates) => {
        const result = await this.connection.query(
         //acá hay que relacionar distintas tablas    
            `UPDATE content
            SET title = ?, paragraph = ?
            WHERE BIN_TO_UUID(content_id) = ?;`,
        [updates.title, updates.paragraph, contentId]
        )
        return result 
    }

    deleteById = async (contentId) => {
        const result = this.connection.query(
            `DELETE FROM content
            WHERE content_id = UUID_TO_BIN(?);`,
            [contentId]
        )
        return result
    }

}
