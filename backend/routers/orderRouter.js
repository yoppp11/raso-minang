const express = require('express')
const { OrderController } = require('../controllers/orderController')
const orderRouter = express.Router()

orderRouter.get('/orders', OrderController.routeGetOrders)
orderRouter.get('/orders/all', OrderController.routeGetAllOrders)
orderRouter.post('/orders/token', OrderController.routeCreateToken)
orderRouter.post('/orders/create', OrderController.routeCreateOrder)
orderRouter.patch('/orders/:id/status', OrderController.routeUpdateOrder)


module.exports = {
    orderRouter
}