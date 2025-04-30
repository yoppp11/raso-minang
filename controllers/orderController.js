const { Cart_Item, Cart, Menu_Item, Order, Order_Item, sequelize } = require('../models/')

class OrderController {

    static async routeCreateOrder(req, res, next){
        try {
            const userId = req.user.id
            const {delivery_address, notes, payment_method} = req.body

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

            const totalAmount = cartWithSubTotal.reduce((accumulate, item) => accumulate + item.subTotal, 0)

            const result = await sequelize.transaction(async (t)=> {
                try {
                    const order = await Order.create({
                        user_id: userId,
                        total_amount: totalAmount,
                        delivery_address,
                        payment_method,
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
                        message: 'Success create order'
                    }
                    
                } catch (error) {
                    console.log(error);
                    return res.status(500).send({
                        message: 'Transaction error'
                    })
                }
            })


            return res.status(201).send({
                message: 'Success create order'
            })

        } catch (error) {
            console.log(error);
        }
    }     

}

module.exports = {
    OrderController
} 