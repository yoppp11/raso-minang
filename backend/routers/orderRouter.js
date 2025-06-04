const express = require('express')
const { OrderController } = require('../controllers/orderController')
const orderRouter = express.Router()

orderRouter.post('/orders', OrderController.routeCreateOrder)
orderRouter.get('/payment/:total', OrderController.routeGetPayment)


module.exports = {
    orderRouter
}