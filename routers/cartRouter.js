const express = require('express')
const { CartController } = require('../controllers/cartController')
const cartRouter = express.Router()

cartRouter.post('/carts', CartController.routeAddCart)
cartRouter.get('/carts', CartController.routeGetCart)
cartRouter.delete('/carts/:cartId', CartController.routeRemoveCart)
cartRouter.post('/carts/:cartId', CartController.routeIncrementStock)


module.exports = {
    cartRouter
}