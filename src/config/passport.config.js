import passport from 'passport'
import JwtPassport from 'passport-jwt'
import config from './config.js'


const JWTStrategy = JwtPassport.Strategy
const ExtractJWT = JwtPassport.ExtractJwt

const initializePassport = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.privateKey
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload.user)
        } catch (error) {
            return done(error)
        }
    }))
}

const cookieExtractor = req => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies[config.cookieToken]
    }
    return token;
}

export default initializePassport