const express = require('express')
const { OrderController } = require('../controllers/orderController')
const orderRouter = express.Router()

orderRouter.get('/orders', OrderController.routeGetOrders)
orderRouter.get('/orders/all', OrderController.routeGetAllOrders)
orderRouter.get('/orders/today', OrderController.routeGetOrdersToday)
orderRouter.get('/orders/income', OrderController.routeGetIncomeThisMonth)
orderRouter.post('/orders/token', OrderController.routeCreateToken)
orderRouter.post('/orders/create', OrderController.routeCreateOrder)
orderRouter.get('/orders/:id', OrderController.routeGetOrderById)
orderRouter.patch('/orders/:id/status', OrderController.routeUpdateOrder)


module.exports = {
    orderRouter
}