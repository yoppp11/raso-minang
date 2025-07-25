const { Cart_Item, Cart, Menu_Item, Order, Order_Item, User, sequelize } = require('../models/')
const { Op } = require('sequelize');
const midtransClient = require('midtrans-client');
const { randomUUID } = require('crypto');
const { http } = require('../helpers/axios');
const SECRET_KEY = process.env.SECRET_KEY   

class OrderController {

    static async routeCreateToken(req, res, next){
        try {
            const userId = req.user.id

            let detailCart = await Cart.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                where: {
                    user_id: userId
                },
                include: {
                    attributes: {exclude: ['createdAt', 'updatedAt']},
                    model: Cart_Item,
                    include: {
                        model: Menu_Item,
                        attributes: {exclude: ['createdAt', 'updatedAt']}
                    }
                }
            })
            let cartWithSubTotal = detailCart.flatMap(cart => {
                const itemWithSubTotal = cart.Cart_Items.map(item => {
                    const price = item.Menu_Item?.price || 0
                    const quantity = item.quantity
                    const subTotal = price * quantity
                    
                    return {
                        id: item.id,
                        cart_id: item.cart_id,
                        menu_item_id: item.menu_item_id,
                        quantity,
                        special_instructions: item.special_instructions,
                        Menu_Item: item.Menu_Item,
                        subTotal
                    }
                })
                return itemWithSubTotal
            })

            // cartWithSubTotal = cartWithSubTotal[0].concat(cartWithSubTotal[1])

            const totalAmount = cartWithSubTotal.reduce((accumulate, item) => accumulate + item.subTotal, 0) + 10000
            
            let snap = new midtransClient.Snap({
                isProduction : false,
                serverKey : SECRET_KEY
            });

            const paymentId = randomUUID()
        
            let parameter = {
                "transaction_details": {
                    "order_id": paymentId,
                    "gross_amount": totalAmount
                },
                "credit_card":{
                    "secure" : true
                },
                "customer_details": {
                    "first_name": req.user.name,
                    "email": req.user.email
                }
            };

            const transaction = await snap.createTransaction(parameter)

            return res.status(201).send({
                token: transaction.token,
                paymentId,
                totalAmount
            })

        } catch (error) {
            console.log(error);
            next(error)
        }
    }    
    
    static async routeCreateOrder(req, res, next){
        try {
            const { paymentId, deliveryAddress, notes, totalAmount } = req.body
            const userId = req.user.id
            const serverKey = process.env.SECRET_KEY
            const authString = Buffer.from(`${serverKey}:`).toString('base64')
            console.log(req.body);

            const checkStatus = await http({
                method: 'get',
                url: `/v2/${paymentId}/status`,
                headers: {
                    Authorization: `Basic ${authString}`
                }
            })

            if(checkStatus.data.transaction_status !== 'capture' && checkStatus.data.transaction_status !== 'settlement') throw { name: 'BadRequest', message: 'Payment not completed' }
            
            if(!deliveryAddress) throw { name: 'BadRequest', message: 'All fields is required' }

            let detailCart = await Cart.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                where: {
                    user_id: userId
                },
                include: {
                    attributes: {exclude: ['createdAt', 'updatedAt']},
                    model: Cart_Item,
                    include: {
                        model: Menu_Item,
                        attributes: {exclude: ['createdAt', 'updatedAt']}
                    }
                }
            })
            let cartWithSubTotal = detailCart.flatMap(cart => {
                const itemWithSubTotal = cart.Cart_Items.map(item => {
                    const price = item.Menu_Item?.price || 0
                    const quantity = item.quantity
                    const subTotal = price * quantity
                    
                    return {
                        id: item.id,
                        cart_id: item.cart_id,
                        menu_item_id: item.menu_item_id,
                        quantity,
                        special_instructions: item.special_instructions,
                        Menu_Item: item.Menu_Item,
                        subTotal
                    }
                })
                return itemWithSubTotal
            })

            // cartWithSubTotal = cartWithSubTotal[0].concat(cartWithSubTotal[1])

            const total = cartWithSubTotal.reduce((accumulate, item) => accumulate + item.subTotal, 0) + 10000

            const result = await sequelize.transaction(async (t)=> {
                try {

                    const order = await Order.create({
                        user_id: userId,
                        total_amount: totalAmount,
                        delivery_address: deliveryAddress,
                        payment_id: paymentId,
                        payment_status: 'Lunas',
                        notes
                    }, { transaction: t })
        
                    cartWithSubTotal.map(async (el) => {
                        await Order_Item.create({
                            order_id: order.id,
                            menu_item_id: el.menu_item_id,
                            quantity: el.quantity,
                            unit_price: el.Menu_Item?.price,
                            subtotal: el.subTotal,
                            special_instructions: '-'
                        }, { transaction: t })
                    })
        
                    await Cart_Item.destroy({
                        where: {
                            cart_id: detailCart.map(el => el.id)
                        },
                        transaction: t
                    })
        
                    await Cart.destroy({
                        where: {
                            user_id: userId
                        },
                        transaction: t
                    })

                    return {
                        message: 'Order created successfully',
                        orderId: order.id,
                        paymentId: order.payment_id
                    }
                    
                } catch (error) {
                    console.log(error);
                    next(error)
                }
            })

            console.log(result);

            return res.status(201).send({
                message: result.message,
                orderId: result.orderId,
                paymentId: result.paymentId
            })
            
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeGetOrders(req, res, next){
        try {
            const userId = req.user.id

            const orders = await Order.findAll({
                where: {
                    user_id: userId
                },
                attributes: { exclude: ['updatedAt'] },
                include: [
                    {
                        model: Order_Item,
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                        include: {
                            model: Menu_Item,
                            attributes: { exclude: ['createdAt', 'updatedAt'] }
                        }
                    },
                    {
                        model: User,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }
                    }
                ]
            })

            return res.status(200).send({
                message: 'Orders retrieved successfully',
                orders
            })
            
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeGetOrderById(req, res, next){
        try {
            const { id } = req.params
            const userId = req.user.id

            const order = await Order.findOne({
                where: {
                    id: +id
                },
                attributes: { exclude: ['updatedAt'] },
                include: [
                    {
                        model: Order_Item,
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                        include: {
                            model: Menu_Item,
                            attributes: { exclude: ['createdAt', 'updatedAt'] }
                        }
                    },
                    {
                        model: User,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }
                    }
                ]
            })
            if(!order) throw {
                name: "NotFound",
                message: "Order Not Found"
            }
            return res.status(200).send({
                message: 'Order retrieved successfully',
                order
            })

            
        } catch (error) {
            console.log(error);
        }
    }

    static async routeGetAllOrders(req, res, next){
        try {
            const orders = await Order.findAll({
                attributes: { exclude: ['updatedAt'] },
                include: [
                    {
                        model: Order_Item,
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                        include: {
                            model: Menu_Item,
                            attributes: { exclude: ['createdAt', 'updatedAt'] }
                        }
                    },
                    {
                        model: User,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }
                    }
                ],
                order: [['id', 'DESC']]
            })

            return res.status(200).send({
                message: 'Orders retrieved successfully',
                orders
            })
            
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeGetOrdersToday(req, res, next){
        try {
            const today = new Date()
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

            const orders = await Order.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: startOfDay,
                        [Op.lt]: endOfDay
                    }
                },
                attributes: { exclude: ['updatedAt'] },
                include: [
                    {
                        model: Order_Item,
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                        include: {
                            model: Menu_Item,
                            attributes: { exclude: ['createdAt', 'updatedAt'] }
                        }
                    },
                    {
                        model: User,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }
                    }
                ],
                order: [['id', 'DESC']]
            })

            return res.status(200).send({
                message: 'Orders retrieved successfully',
                orders
            })
            
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeGetIncomeThisMonth(req, res, next){
        try {
            const today = new Date()
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

            const income = await Order.sum('total_amount', {
                where: {
                    createdAt: {
                        [Op.gte]: startOfMonth,
                        [Op.lt]: endOfMonth
                    }
                }
            })

            return res.status(200).send({
                message: 'Income retrieved successfully',
                income
            })
            
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeUpdateOrder(req, res, next){
        try {
            const { id } = req.params
            const { order_status } = req.body
            if(!order_status) throw { name: 'BadRequest', message: 'Order status is required' }

            const order = await Order.findByPk(+id)
            if(!order) throw {
                name: "NotFound",
                message: "Order Not Found"
            }

            await Order.update({
                order_status
            }, {
                where: {
                    id: +id
                }
            })

            return res.status(200).send({
                message: 'Order updated successfully',
                orderId: id,
                order_status
            })
            
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

}

module.exports = {
    OrderController
} 