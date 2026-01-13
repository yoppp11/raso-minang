const { User, Order, Order_Item, Menu_Item, Category, Conversation, Message } = require('../models');
const { Op } = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');

class SuperAdminController {
    // Get dashboard statistics
    static async routeGetStats(req, res, next) {
        try {
            // Total users
            const totalUsers = await User.count({
                where: { role: 'user' }
            });

            // Total admins
            const totalAdmins = await User.count({
                where: { role: 'admin' }
            });

            // Total orders
            const totalOrders = await Order.count();

            // Total revenue
            const totalRevenue = await Order.sum('total_amount', {
                where: {
                    payment_status: 'Lunas'
                }
            }) || 0;

            // Total menu items
            const totalMenuItems = await Menu_Item.count();

            // Total categories
            const totalCategories = await Category.count();

            // Orders this month
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const ordersThisMonth = await Order.count({
                where: {
                    createdAt: {
                        [Op.gte]: startOfMonth
                    }
                }
            });

            // Revenue this month
            const revenueThisMonth = await Order.sum('total_amount', {
                where: {
                    payment_status: 'Lunas',
                    createdAt: {
                        [Op.gte]: startOfMonth
                    }
                }
            }) || 0;

            // Orders today
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const ordersToday = await Order.count({
                where: {
                    createdAt: {
                        [Op.gte]: startOfDay
                    }
                }
            });

            // Pending orders
            const pendingOrders = await Order.count({
                where: {
                    order_status: {
                        [Op.notIn]: ['Selesai', 'Dibatalkan']
                    }
                }
            });

            // Unread messages
            const unreadMessages = await Message.count({
                where: {
                    is_read: false,
                    sender_role: 'user'
                }
            });

            // Recent orders
            const recentOrders = await Order.findAll({
                limit: 5,
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username', 'full_name']
                    }
                ]
            });

            return res.status(200).send({
                status: 'success',
                data: {
                    totalUsers,
                    totalAdmins,
                    totalOrders,
                    totalRevenue,
                    totalMenuItems,
                    totalCategories,
                    ordersThisMonth,
                    revenueThisMonth,
                    ordersToday,
                    pendingOrders,
                    unreadMessages,
                    recentOrders
                }
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // Get all users
    static async routeGetUsers(req, res, next) {
        try {
            const { role, search, page = 1, limit = 10 } = req.query;
            
            const whereClause = {};
            
            if (role) {
                whereClause.role = role;
            }
            
            if (search) {
                whereClause[Op.or] = [
                    { username: { [Op.iLike]: `%${search}%` } },
                    { email: { [Op.iLike]: `%${search}%` } },
                    { full_name: { [Op.iLike]: `%${search}%` } }
                ];
            }

            const offset = (page - 1) * limit;

            const { count, rows: users } = await User.findAndCountAll({
                where: whereClause,
                attributes: { exclude: ['password'] },
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            return res.status(200).send({
                status: 'success',
                data: {
                    users,
                    pagination: {
                        total: count,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        totalPages: Math.ceil(count / limit)
                    }
                }
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // Get user by ID
    static async routeGetUserById(req, res, next) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id, {
                attributes: { exclude: ['password'] },
                include: [
                    {
                        model: Order,
                        include: [
                            {
                                model: Order_Item,
                                include: [Menu_Item]
                            }
                        ]
                    }
                ]
            });

            if (!user) {
                throw { name: 'NotFound', message: 'User not found' };
            }

            return res.status(200).send({
                status: 'success',
                data: user
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // Update user role
    static async routeUpdateUserRole(req, res, next) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            if (!['user', 'admin', 'superadmin'].includes(role)) {
                throw { name: 'BadRequest', message: 'Invalid role' };
            }

            const user = await User.findByPk(id);
            if (!user) {
                throw { name: 'NotFound', message: 'User not found' };
            }

            // Prevent changing own role
            if (user.id === req.user.id) {
                throw { name: 'BadRequest', message: 'Cannot change your own role' };
            }

            await user.update({ role });

            return res.status(200).send({
                status: 'success',
                message: 'User role updated successfully',
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // Create new admin/superadmin user
    static async routeCreateAdmin(req, res, next) {
        try {
            const { username, email, password, full_name, phone_number, role } = req.body;

            if (!['admin', 'superadmin'].includes(role)) {
                throw { name: 'BadRequest', message: 'Role must be admin or superadmin' };
            }

            const user = await User.create({
                username,
                email,
                password,
                full_name,
                phone_number,
                role
            });

            return res.status(201).send({
                status: 'success',
                message: `${role} created successfully`,
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // Delete user
    static async routeDeleteUser(req, res, next) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id);
            if (!user) {
                throw { name: 'NotFound', message: 'User not found' };
            }

            // Prevent deleting own account
            if (user.id === req.user.id) {
                throw { name: 'BadRequest', message: 'Cannot delete your own account' };
            }

            // Prevent deleting other superadmins
            if (user.role === 'superadmin') {
                throw { name: 'BadRequest', message: 'Cannot delete superadmin accounts' };
            }

            await user.destroy();

            return res.status(200).send({
                status: 'success',
                message: 'User deleted successfully'
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // Get all orders with filters
    static async routeGetAllOrders(req, res, next) {
        try {
            const { status, payment_status, search, page = 1, limit = 10 } = req.query;
            
            const whereClause = {};
            
            if (status) {
                whereClause.order_status = status;
            }
            
            if (payment_status) {
                whereClause.payment_status = payment_status;
            }

            const offset = (page - 1) * limit;

            const { count, rows: orders } = await Order.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username', 'full_name', 'email', 'phone_number']
                    },
                    {
                        model: Order_Item,
                        include: [
                            {
                                model: Menu_Item,
                                attributes: ['id', 'name', 'image_url', 'price']
                            }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            return res.status(200).send({
                status: 'success',
                data: {
                    orders,
                    pagination: {
                        total: count,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        totalPages: Math.ceil(count / limit)
                    }
                }
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // Update order status
    static async routeUpdateOrderStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { order_status, payment_status } = req.body;

            const order = await Order.findByPk(id);
            if (!order) {
                throw { name: 'NotFound', message: 'Order not found' };
            }

            const updateData = {};
            if (order_status) updateData.order_status = order_status;
            if (payment_status) updateData.payment_status = payment_status;

            await order.update(updateData);

            return res.status(200).send({
                status: 'success',
                message: 'Order updated successfully',
                data: order
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = { SuperAdminController };
