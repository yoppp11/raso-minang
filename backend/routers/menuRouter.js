
const { MenuController } = require("../controllers/menuControllers")

const express = require('express')
const multer  = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const menuRouter = express.Router()


menuRouter.get('/menus', MenuController.routeGetMenu)
menuRouter.get('/pub/menus', MenuController.routeGetMenuLimit)
menuRouter.get('/ref/menus', MenuController.routeGetMenuRandom)
menuRouter.post('/menus', upload.single('image'), MenuController.routeCreateMenu)
menuRouter.patch('/menus/:id', upload.single('image'), MenuController.routeUpdateMenu)
menuRouter.get('/categories',  MenuController.routeGetCategories)
menuRouter.post('/categories',  MenuController.routeAddCategory)
menuRouter.get('/menus/:id', MenuController.routeGetMenuById)
menuRouter.get('/categories/:id', MenuController.routeGetCategoryById)
menuRouter.patch('/categories/:id', MenuController.routeEditCategory)
menuRouter.delete('/menus/:id', MenuController.routeDeleteMenu)
menuRouter.delete('/categories/:id',  MenuController.routeDeteleCategory)


module.exports = {
    menuRouter
}