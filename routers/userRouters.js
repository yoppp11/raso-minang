const express = require('express')
const { UserController } = require('../controllers/userController')
const userRouter = express.Router()

userRouter.post('/login', UserController.routeLogin)
userRouter.post('/register', UserController.routeRegister)

module.exports = {
    userRouter
}