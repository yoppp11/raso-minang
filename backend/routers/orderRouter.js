const express = require('express')
const { OrderController } = require('../controllers/orderController')
const orderRouter = express.Router()

orderRouter.get('/orders', OrderController.routeGetOrders)
orderRouter.post('/orders/token', OrderController.routeCreateToken)
orderRouter.post('/orders/create', OrderController.routeCreateOrder)


module.exports = {
    orderRouter
}