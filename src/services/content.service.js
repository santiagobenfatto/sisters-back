export default class ContentService {
    contructor(contentRepository){
        this.contentRepository = contentRepository
    }

    create = async(title, paragraph) => {

        const newContent = {
            title: title,
            paragraph: paragraph
        }

        const result = await this.contentRepository.create(newContent)
        return result
    }

}