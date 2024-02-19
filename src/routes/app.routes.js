import { Router as expressRouter } from 'express'
import { strategyEnum } from '../utils/passportStrategies.js'
import passport from 'passport'

expressRouter()

export default class Router {
    constructor(){
        this.router = expressRouter()
        this.init()
    }

    getRouter (){
        return this.router
    }


    init() { }

    get(path, policies, customStrategy, ...callbacks){
        this.router.get(
            path,
            this.passportStrategy(customStrategy),
            this.policies(policies),
            this.customResponses,
            this.applyCallbacks(callbacks)
        )
    }
    post(path, policies, customStrategy, ...callbacks){
        this.router.post(
            path,
            this.passportStrategy(customStrategy),
            this.policies(policies),
            this.customResponses,
            this.applyCallbacks(callbacks)
        )
    }
    put(path, policies, customStrategy, ...callbacks){
        this.router.put(
            path,
            this.passportStrategy(customStrategy),
            this.policies(policies),
            this.customResponses,
            this.applyCallbacks(callbacks)
        )
    }

    patch(path, policies, customStrategy, ...callbacks){
        this.router.patch(
            path,
            this.passportStrategy(customStrategy),
            this.policies(policies),
            this.customResponses,
            this.applyCallbacks(callbacks)
        )
    }


    delete(path, policies, customStrategy, ...callbacks){
        this.router.delete(
            path,
            this.passportStrategy(customStrategy),
            this.policies(policies),
            this.customResponses,
            this.applyCallbacks(callbacks)
        )
    }

    customResponses = (req, res, next) => {
        res.sendSuccess = (data) => {
            res.status(200).json({ data })
        }
        res.sendClientError = (error) => {
            res.status(400).json({ error })
        }
        res.sendUnauthorized = (error) => {
            res.status(401).json(error)
        }
        res.sendForbidden = (error) => {
            res.status(403).json(error)
        }
        res.sendServerError = (error) => {
            res.status(500).json({ error })
        }

        next()
    }

    passportStrategy = (strategy) => (req, res, next) => {
        if (strategy === strategyEnum.JWT) {
            passport.authenticate(strategy, function (err, user, info) {
                if (err) return next(err)

                if (!user)
                    return res.status(401).send({
                        error: info.messages ? info.messages : info.toString()
                    })
                req.user = user
                next();
            })(req, res, next)
        } else {
            next()
        }
    }

    policies = (policies) => (req, res, next) => {
        if (policies[0] === 'PUBLIC') return next()
        
        const user = req.user
        
        if(!policies.includes(user.role.toUpperCase())) {
            return res.status(403).json({message: 'Forbidden'})
        }
        next()
    }
    

    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params);//req, res, next
            } catch (error) {
                params[1].status(500).json({ error: error.message });
            }
        })
    }
}