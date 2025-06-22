const express = require('express')
const { UserController } = require('../controllers/userController')
const userRouter = express.Router()

userRouter.get('/users', UserController.routeGetUsers)
userRouter.post('/login', UserController.routeLogin)
userRouter.post('/register', UserController.routeRegister)

module.exports = {
    userRouter
}