
const { MenuController } = require("../controllers/menuControllers")

const express = require('express')
const multer  = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const menuRouter = express.Router()


menuRouter.get('/menus', MenuController.routeGetMenu)
menuRouter.post('/menus', upload.single('image'), MenuController.routeCreateMenu)
menuRouter.put('/menus/:id', upload.single('image'), MenuController.routeUpdateMenu)
menuRouter.get('/categories',  MenuController.routeGetCategories)
menuRouter.get('/menus/:id', MenuController.routeGetMenuById)
menuRouter.delete('/menus/:id', MenuController.routeDeleteMenu)


module.exports = {
    menuRouter
}