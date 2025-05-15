const { User, Cart, Cart_Item, Menu_Item, Category } = require("../models/");

class CartController {
    static async routeAddCart(req, res, next){
        try {
            const { menu_item_id, quantity } = req.body
            const userId = req.user.id
            
            const dataCart = await Cart.findAll({
                where: {
                    user_id: userId
                },
                include: Cart_Item
            })
            
            const isSame = dataCart.some(el => el.Cart_Items[0]?.menu_item_id === Number(menu_item_id))
            if(isSame) {
                const cart = await Cart.findOne({
                    where: {
                        user_id: userId 
                    },
                    include: {
                        model: Cart_Item,
                        where: {
                            menu_item_id
                        }
                    }
                })
                await Cart_Item.increment('quantity' ,{
                    by: quantity,
                    where: {
                        cart_id: cart.id,
                        menu_item_id
                    }
                })

                return res.status(200).send({message: 'Success updated stock'})
                
            }
            const newCart = await Cart.create({user_id: userId})

            await Cart_Item.create({ 
                cart_id: newCart.id,
                menu_item_id,
                quantity
            })

            return res.status(201).send({
                message: 'Success added to cart'
            })

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeGetCart(req, res, next){
        try {
            const userId = req.user.id
            console.log(userId);
            let dataCart = await Cart.findAll({
                attributes: {exclude: ['createdAt', 'updatedAt']},
                where: {
                    user_id: userId
                },
                include: {
                    attributes: {exclude: ['createdAt', 'updatedAt']},
                    model: Cart_Item,
                    include: {
                        model: Menu_Item,
                        attributes: {exclude: ['createdAt', 'updatedAt']},
                    }
                }
            })
            dataCart = dataCart.map(el => {
                return el.Cart_Items[0]
            })

            return res.status(200).send(dataCart)

        } catch (error) {
            console.log(error);
            next()
        }
    }

    static async routeRemoveCart(req, res, next){
        try {
            const {cartId} = req.params

            const cart = await Cart.findOne({
                where: {
                    id: +cartId
                }
            })
            
            if(!cart) throw { name: 'NotFound', message: 'Cart not found' }

            await Cart_Item.destroy({
                where: {
                    cart_id: +cartId
                }
            })
            await Cart.destroy({
                where: {
                    id: +cartId
                }
            })

            return res.status(200).send({
                message: 'Succes deleted cart'
            })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeIncrementStock(req, res, next){
        try {
            const {cartId} = req.params

            const cart = await Cart.findOne({
                where: {
                    id: +cartId
                }
            })

            if(!cart) throw { name: 'NotFound', message: 'Cart not found' }
            await Cart_Item.increment('quantity' ,{
                by: 1,
                where: {
                    cart_id: +cartId
                }
            })

            return res.status(200).send({
                message: 'Success added quantity'
            })

        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}

module.exports = {
    CartController
}