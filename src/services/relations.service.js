export default class RelationsService {
    constructor (relationsRepository){
        this.relationsRepository = relationsRepository
        
    }

    create = async(data) => {
        const doc = {
            content_id: data.content_id,
            record_id: data.record_id,
            record_type: data.record_type
        }

        const result = await this.relationsRepository.create(doc)
        return result

    }
}