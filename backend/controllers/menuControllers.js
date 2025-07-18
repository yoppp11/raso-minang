const { Menu_Item, Category, Sequelize } = require("../models");
const cloudinary = require('cloudinary')

const API_KEY = process.env.KEY_CLOUDINARY
const API_SECRET = process.env.SECRET_CLOUDINARY
const CLOUD = process.env.CLOUD_CLOUDINARY

cloudinary.config({ 
    cloud_name: CLOUD, 
    api_key: API_KEY, 
    api_secret: API_SECRET 
});


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

    static async routeGetMenuRandom(req, res, next){
        try {
            const dataMenu = await Menu_Item.findAll({
                order: [ Sequelize.literal('random()') ],
                include: {
                    model: Category,
                    attributes: ['id', 'name']
                },
                limit: 4,
            })

            res.status(200).send({
                status: 'success',
                message: 'Get All Menu Random',
                data: dataMenu
            })
            
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeGetMenuLimit(req, res, next){
        try {
            const dataMenu = await Menu_Item.findAll({
                order: [
                    ['name', 'ASC']
                ],
                include: {
                    model: Category,
                    attributes: ['id', 'name']
                },
                limit: 8,
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
            const image = req.file
            const { name, description, price, categoryId, isAvailable, isSpicy } = req.body
            console.log(req.file);
            console.log(req.body);
            console.log(req.params);


            if(!image) throw {
                name: "BadRequest",
                message: "Image is required"
            }

            const imageString = image.buffer.toString('base64')
            const base64Image = `data:${image.mimetype};base64,${imageString}`

            const imageUrl = await cloudinary.v2.uploader.upload(base64Image)

            await Menu_Item.create({
                name,
                description,
                price,
                category_id: categoryId,
                image_url: imageUrl.secure_url,
                is_avaible: isAvailable === 'true',
                is_spicy: isSpicy === 'true'
            })

            return res.status(201).send({
                status: "success",
                message: "Menu Created Successfully",
                data: {
                    name,
                    description,
                    price,
                    categoryId,
                    isAvailable,
                    isSpicy,
                    imageUrl: imageUrl.secure_url
                }
            })
            
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeUpdateMenu(req, res, next){
        try {
            const imageFile = req.file
            const { name, description, price, categoryId, isAvailable, isSpicy, image } = req.body
            const { id } = req.params
            console.log(req.body, '<=====');
            console.log(req.file);

            if(!name) throw { name: 'BadRequest', message: 'Name is required' }
            if(!description) throw { name: 'BadRequest', message: 'Description is required' }
            if(!price) throw { name: 'BadRequest', message: 'Price is required' }
            if(!categoryId) throw { name: 'BadRequest', message: 'Category ID is required' }
            if(!imageFile && !image) throw {
                name: "BadRequest",
                message: "Image is required"
            }

            const menu = await Menu_Item.findByPk(+id)

            if(!menu) throw {
                name: "NotFound",
                message: "Menu Not Found"
            }

            let imageUrl = image
            if (!imageUrl) {
                const imageString = imageFile?.buffer.toString('base64');
                const base64Image = `data:${imageFile?.mimetype};base64,${imageString}`;
                const uploadedImage = await cloudinary.v2.uploader.upload(base64Image);
                imageUrl = uploadedImage.secure_url;
                console.log('imageUrl', imageUrl);
              }

            await Menu_Item.update({
                name,
                description,
                price,
                category_id: categoryId,
                image_url: imageUrl,
                is_avaible: isAvailable === 'true',
                is_spicy: isSpicy === 'true'
            }, {
                where: { id }
            })

            return res.status(200).send({
                status: "success",
                message: "Menu Updated Successfully",
                data: {
                    name,
                    description,
                    price,
                    categoryId,
                    isAvaible: isAvailable,
                    isSpicy,
                    imageUrl: imageUrl.secure_url
                }
            })

            
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeGetCategories(req, res, next){
        try {
            const result = await Category.findAll({
                order: [
                    ['id', 'ASC']
                ]
            })

            return res.status(200).send({
                status: "success",
                message: "Get All Categories",
                data: result
            })
            
        } catch (error) {
            console.log(error);
            next(error)
            
        }
    }

    static async routeGetCategoryById(req, res, next){
        try {
            const { id } = req.params

            const category = await Category.findByPk(+id)

            if(!category) throw {
                name: "NotFound",
                message: "Category Not Found"
            }

            return res.status(200).send({
                status: "success",
                message: "Get Category By Id",
                data: category
            })
            
        }
        catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeEditCategory(req, res, next){
        try {
            const { id } = req.params
            const { name, description } = req.body
            if(!name) throw {
                name: "BadRequest",
                message: "Name is required"
            }
            if(!description) throw {
                name: "BadRequest",
                message: "Description is required"
            }

            const category = await Category.findByPk(+id)
            if(!category) throw {
                name: "NotFound",
                message: "Category Not Found"
            }

            await Category.update({
                name,
                description
            }, {
                where: {
                    id
                }
            })

            return res.status(200).send({
                status: "success",
                message: "Category Updated Successfully",
                data: {
                    id,
                    name,
                    description
                }
            })
            
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeAddCategory(req, res, next){
        try {
            const { name, description } = req.body
            if(!name) throw {
                name: "BadRequest",
                message: "Name is required"
            }
            if(!description) throw {
                name: "BadRequest",
                message: "Description is required"
            }

            const category = await Category.create({
                name,
                description
            })

            return res.status(201).send({
                status: "success",
                message: "Category Created Successfully",
                data: category
            })
            
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeDeteleCategory(req, res, next){
        try {
            const { id } = req.params

            const category = await Category.findByPk(+id)

            if(!category) throw {
                name: "NotFound",
                message: "Category Not Found"
            }

            await Category.destroy({
                where: {
                    id
                }
            })
            return res.status(200).send({
                status: "success",
                message: "Category Deleted Successfully"
            })
            
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeDeleteMenu(req, res, next){
        try {
            const { id } = req.params
            
            const menu = await Menu_Item.findByPk(+id)
            if(!menu) throw {
                name: "NotFound",
                message: "Menu Not Found"
            }

            await Menu_Item.destroy({
                where: {
                    id
                }
            })

            return res.status(200).send({
                status: "success",
                message: "Menu Deleted Successfully"
            })

        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}


module.exports = {
    MenuController
}