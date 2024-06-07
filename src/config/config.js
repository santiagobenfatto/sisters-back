import dotenv from 'dotenv'

const environment = 'developer'

dotenv.config({
    path: environment === 'developer' ? `./.env.dev` : `./.env.prod`
})


export default {
    mongoUrlDevDB: process.env.MONGO_DEVELOPMENT_URL,
    persistence: process.env.PERSISTENCE,
    mysqlPass: process.env.MYSQLPASSWORD,
    privateKey: process.env.PRIVATE_KEY,
    cookieToken: process.env.COOKIE_TOKEN,
    tursoDatabaseUrl: process.env.TURSO_DATABASE_URL,
    tursoAuthToken: process.env.TURSO_AUTH_TOKEN
}