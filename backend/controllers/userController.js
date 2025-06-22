const { where } = require('sequelize');
const { comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt')
const {User} = require('../models/index')

class UserController {
    static async routeRegister(req, res, next){
        try {
            const {username, email, password, full_name, phone_number, address} = req.body

            const response = await User.create({
                username, email, password, full_name, phone_number, address
            })

            console.log(response);

            return res.status(201).send({
                id: response.id,
                username: response.username,
                email: response.email
            })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeLogin(req, res, next){
        try {
            const { email, password } = req.body
            if(!email) throw { name: 'BadRequest', message: 'Email is required' }
            if(!password) throw { name: 'BadRequest', message: 'Password is required' }

            const userFound = await User.findOne({
                where: {
                    email
                }
            })

            if(!userFound) throw { name: 'BadRequest', message: 'Invalid email / password' }

            const isValid = comparePassword(password, userFound.password)
            if(!isValid) throw { name: 'BadRequest', message: 'Invalid email / password' }

            const access_token = signToken({ id: userFound.id, email: userFound.email, role: userFound.role })

            return res.status(200).send({ 
                access_token,
                user: {
                    id: userFound.id,
                    email: userFound.email,
                    username: userFound.username,
                    role: userFound.role,
                }
             })

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeCheckLogin(req, res, next){
        try {
            const { id } = req.user

            const response = await User.findOne({
                where: {
                    id
                }
            })

            return res.status(200).send({ role: response.role })

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeGetUsers(req, res, next){
        try {
            const response = await User.findAll({
                where: {
                    role: 'user'
                },
                attributes: { exclude: ['password'] }
            })

            return res.status(200).send({
                users: response.length
            })

        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}

module.exports = {UserController}