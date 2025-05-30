const { Menu_Item, Category } = require("../models");

class MenuController {

    static async routeGetMenu(req, res, next){
        try {
            const dataMenu = await Menu_Item.findAll({
                order: [
                    ['name', 'ASC']
                ],
                include: {
                    model: Category,
                    attributes: ['id', 'name']
                }
            })

            res.status(200).send({ 
                status: "success",
                message: "Get All Menu",
                data: dataMenu
            })
            
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeGetMenuById(req, res, next){
        try {
            const { id } = req.params

            const dataMenu = await Menu_Item.findOne({
                where: {
                    id
                }
            })

            if(!dataMenu)
            throw {
                    name: "NotFound",
                    message: "Menu Not Found"
                }

            res.status(200).send({
                status: "success",
                message: "Get Menu By Id",
                data: dataMenu
            })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeCreateMenu(req, res, next){
        try {
            const file = req.file
            const { name, description, price, categoryId, image, isAvaible, isSpicy } = req.body

            if(!file) throw {
                name: "BadRequest",
                message: "Image is required"
            }

            
            
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}


module.exports = {
    MenuController
}