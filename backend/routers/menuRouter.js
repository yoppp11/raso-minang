const { MenuController } = require("../controllers/menuControllers")

const express = require('express')
const menuRouter = express.Router()


menuRouter.get('/menu', MenuController.routeGetMenu)
menuRouter.get('/menu/:id', MenuController.routeGetMenuById)


module.exports = {
    menuRouter
}