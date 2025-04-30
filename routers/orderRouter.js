const express = require('express')
const { OrderController } = require('../controllers/orderController')
const orderRouter = express.Router()

orderRouter.post('/orders', OrderController.routeCreateOrder)


module.exports = {
    orderRouter
}