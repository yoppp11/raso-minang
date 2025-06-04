const { verifyToken } = require("../helpers/jwt")
const { User } = require('../models/index')

async function authMiddleware(req, res, next){
    try {
        const { authorization } = req.headers
        if(!authorization) throw { name: 'Unauthorized', message: 'Invalid token' }

        const [type, token] = authorization.split(' ')
        if(type !== 'Bearer' || !token) throw { name: 'Unauthorized', message: 'Invalid token' }

        const user = verifyToken(token)
        if(!user) throw { name: 'Unauthorized', message: 'Invalid token' }

        const isValidUser = await User.findOne({
            where: {
                email: user.email
            }
        })
        if(!isValidUser) throw { name: 'Unauthorized', message: 'Invalid token' }

        req.user = {
            id: isValidUser.id,
            email: isValidUser.email,
            name: isValidUser.full_name,
            role: isValidUser.role
        }

        next()

    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = {
    authMiddleware
}