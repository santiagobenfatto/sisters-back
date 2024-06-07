export default class RelationTurso {
    constructor(client){ 
        console.log('Working RelationsDB with Turso')
        this.client = client
    }

    //asegurarse que el contentID venga en formado uuid
    create = async (doc) => {
        const result = await this.client.execute({
            sql:`INSERT INTO relations (content_id, record_id, record_type) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?);`,
            args:[doc.contentId, doc.recordId, doc.recordType]
        })
        return result
    }
    
    delete = async (relationId) => {
        const result = await this.client.execute({
            sql:`DELETE FROM relations
            WHERE relation_id = UUID_TO_BIN(?);`,
            args:[relationId]
        })
        return result
    }

}
