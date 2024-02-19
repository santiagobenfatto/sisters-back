export default class UsersMySQL {
    constructor(connection){ 
        console.log('Working UsersDB with MySQL')
        this.connection = connection
    }

    getAll = async () => {
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(user_id) user_id, first_name, last_name, email_register, role
            FROM users;`
        )
        return result
    } 

    getById = async (userId) => {
        const [result] = await this.connection.query(
            `SELECT BIN_TO_UUID(user_id) user_id, first_name, last_name, email_register, role
            FROM users
            WHERE user_id = UUID_TO_BIN(?);`,
            [userId]
        )
        return result
    }

    getByEmailRegister = async (email) => {
        const [result] = await this.connection.query(
            `SELECT first_name, last_name, email_register, role, password
            FROM users
            WHERE email_register = ?;`,
            [email]
        )
        return result
    }

    create = async (user) => {
        console.log(user)
        const result = await this.connection.query(
            `INSERT INTO users (first_name, last_name, email_register, password)
            VALUES (?,?,?,?);`,
            [user.first_name, user.last_name, user.email_register, user.password]
        )
        return result
    }
   
    updateById = async (userId, updates) => {
       const result = await this.connection.query(
            `UPDATE users
            SET first_name = ?, last_name = ?, email_secondary = ?, role = ?
            WHERE BIN_TO_UUID(user_id) = ?;`,
        [updates.firtName, updates.lastName, updates.emailSecondary, userId]
       )
       return result 
    }

    toggleStatus = async (userId) => {
        const [result] = await this.connection.query(
            `UPDATE users
            SET status = ?
            WHERE user_id = UUID_TO_BIN(?);`,
            [userId]
        )
        return result
    }

}
