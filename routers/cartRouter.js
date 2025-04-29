const express = require('express')
const { CartController } = require('../controllers/cartController')
const cartRouter = express.Router()

cartRouter.post('/cart', CartController.routeAddCart)
cartRouter.get('/cart', CartController.routeGetCart)


module.exports = {
    cartRouter
}