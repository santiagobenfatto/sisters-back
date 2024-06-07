export default class UsersTurso {
    constructor(client){ 
        console.log('Working UsersDB with Turso')
        this.client = client
    }

    getAll = async () => {
        const [result] = await this.client.execute({
            sql:`SELECT BIN_TO_UUID(user_id) user_id, first_name, last_name, email_register, role
            FROM users;`
        })
        return result
    } 

    getById = async (userId) => {
        const [result] = await this.client.execute({
            sql:`SELECT BIN_TO_UUID(user_id) user_id, first_name, last_name, email_register, role
            FROM users
            WHERE user_id = UUID_TO_BIN(?);`,
            args:[userId]
        })
        return result
    }

    getByEmailRegister = async (email) => {
        const [result] = await this.client.execute({
            sql:`SELECT first_name, last_name, email_register, role, password
            FROM users
            WHERE email_register = ?;`,
            args:[email]
        })
        return result
    }

    create = async (user) => {
        const result = await this.client.execute({
            sql:`INSERT INTO users (first_name, last_name, email_register, password)
            VALUES (?,?,?,?);`,
            args:[user.first_name, user.last_name, user.email_register, user.password]
        })
        return result
    }
   
    updateById = async (userId, updates) => {
       const result = await this.client.execute({
        sql:`UPDATE users
        SET first_name = ?, last_name = ?, email_secondary = ?, role = ?
        WHERE BIN_TO_UUID(user_id) = ?;`,
        args:[updates.firtName, updates.lastName, updates.emailSecondary, userId]
       })
       return result 
    }

    toggleStatus = async (userId) => {
        const [result] = await this.client.execute({
            sql:`UPDATE users
            SET status = ?
            WHERE user_id = UUID_TO_BIN(?);`,
            args:[userId]
        })
        return result
    }

}
