const express = require('express')
const { CartController } = require('../controllers/cartController')
const cartRouter = express.Router()

cartRouter.post('/carts', CartController.routeAddCart)
cartRouter.get('/carts', CartController.routeGetCart)
cartRouter.delete('/carts/:cartId', CartController.routeRemoveCart)
cartRouter.patch('/carts/:cartId/inc', CartController.routeIncrementStock)
cartRouter.patch('/carts/:cartId/dec', CartController.routeDecrementStock)


module.exports = {
    cartRouter
}