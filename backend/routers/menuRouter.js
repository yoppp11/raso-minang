
const { MenuController } = require("../controllers/menuControllers")

const express = require('express')
const multer  = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const menuRouter = express.Router()


menuRouter.get('/menus', MenuController.routeGetMenu)
menuRouter.post('/menus', upload.single('image'), MenuController.routeCreateMenu)
menuRouter.get('/categories',  MenuController.routeGetCategories)
menuRouter.get('/menus/:id', MenuController.routeGetMenuById)


module.exports = {
    menuRouter
}