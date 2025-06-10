const { Cart_Item, Cart, Menu_Item, Order, Order_Item, sequelize } = require('../models/')
const midtransClient = require('midtrans-client');
const { randomUUID } = require('crypto');
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
                    "order_id": orderId,
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

            const result = await sequelize.transaction(async (t)=> {
                try {

                    const order = await Order.create({
                        user_id: userId,
                        total_amount: totalAmount,
                        delivery_address: deliveryAddress,
                        payment_id: paymentId,
                        payment_status: 'paid',
                        
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

}

module.exports = {
    OrderController
} 