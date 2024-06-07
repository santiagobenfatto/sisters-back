export default class ContentTurso {
    constructor(client){ 
        console.log('Working ContentsDB with Turso')
        this.client = client
    }

    getAll = async () => {
        const result = await this.client.execute({
            sql:`SELECT BIN_TO_UUID(content_id) content_id, title
            FROM content;`
        })
        return result
    }

    create = async (content) => {
        const result = await this.client.execute({
            sql:`INSERT INTO content (title, paragraph) VALUES (?,?);`,
            args:[content.title, content.paragraph]
        })
        return result

    }

    getIdByName = async (content) => {
        const name = content.toLowerCase()
        const [result] = await this.client.execute({
            sql:`SELECT BIN_TO_UUID(content_id) content_id
            FROM content
            WHERE LOWER(title) = ?;`,
            args:[name]
        })
        return result[0]
    }

    getById = async (contentId) => {
        const [result] = this.client.execute({
            sql:`SELECT BIN_TO_UUID(content_id) content_id, title, paragraph
            FROM content
            WHERE content_id = UUID_TO_BIN(?);`,
            args:[contentId]
        })
        return result
    }
    
    updateById = async (contentId, updates) => {
        const result = await this.client.execute({
            sql:`UPDATE content
            SET title = ?, paragraph = ?
            WHERE BIN_TO_UUID(content_id) = ?;`,
            args:[updates.title, updates.paragraph, contentId]
        })
        return result 
    }

    deleteById = async (contentId) => {
        const result = this.client.execute({
            sql:`DELETE FROM content
            WHERE content_id = UUID_TO_BIN(?);`,
            args:[contentId]
        })
        return result
    }

}
