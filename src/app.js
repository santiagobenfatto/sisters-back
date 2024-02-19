import express from 'express'
import { __dirname } from './utils/utils.js'
import cors from 'cors'
import initializePassport from './config/passport.config.js'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import ContinentsRouter from './routes/continents.router.js'
import CountriesRouter from './routes/countries.router.js'
import ProvincesRouter from './routes/provinces.router.js'
import CitiesRouter from './routes/cities.router.js'
import ArticlesRouter from './routes/articles.router.js'
import AboutInfoRouter from './routes/aboutInfo.router.js'
import UsersRouter from './routes/users.router.js'

const app = express()
const PORT = process.env.PORT || 8080

const continentsRouter = new ContinentsRouter()
const countriesRouter = new CountriesRouter()
const provincesRouter = new ProvincesRouter()
const citiesRouter = new CitiesRouter()
const articlesRouter = new ArticlesRouter()
const aboutInfoRouter = new AboutInfoRouter()
const usersRouter = new UsersRouter()

//Formatters and encoders
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

//Cross Origin Site
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}))

//Passport
initializePassport();
app.use(passport.initialize());


app.use('/api/continents', continentsRouter.getRouter())
app.use('/api/countries', countriesRouter.getRouter())
app.use('/api/provinces', provincesRouter.getRouter())
app.use('/api/cities', citiesRouter.getRouter())
app.use('/api/articles', articlesRouter.getRouter())
app.use('/api/about', aboutInfoRouter.getRouter())
app.use('/api/users', usersRouter.getRouter())


app.listen(PORT, () => {
    console.log(`Server listening and running on port ${PORT}`)
})