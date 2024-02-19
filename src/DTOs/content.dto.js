

export default class ContentDTO {
    static transformContent (doc) {

        const objectModel = {
            name: doc[0].name || doc[0].topic,
            content: []
        }

        const DAOcontent = doc.map( cont => (
            {
                title: cont.title,
                paragraph: cont.paragraph
            }
        ))

        objectModel.content = DAOcontent

        return objectModel

    }
}