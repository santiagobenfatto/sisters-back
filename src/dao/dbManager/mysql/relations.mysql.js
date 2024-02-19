export default class RelationMySQL {
    constructor(connection){ 
        console.log('Working RelationsDB with MySQL')
        this.connection = connection
    }

    //asegurarse que el contentID venga en formado uuid
    create = async (doc) => {
        const result = await this.connection.query(
            `INSERT INTO relations (content_id, record_id, record_type) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?);`,
            [doc.contentId, doc.recordId, doc.recordType]
        )
        return result
    }
    
    delete = async (relationId) => {
        const result = await this.connection.query(
            `DELETE FROM relations
            WHERE relation_id = UUID_TO_BIN(?);`,
            [relationId]
        )
        return result
    }

}
