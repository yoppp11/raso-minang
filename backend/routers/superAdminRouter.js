const express = require('express');
const { SuperAdminController } = require('../controllers/superAdminController');
const { superAdminMiddleware } = require('../middlewares/authMiddleware');
const superAdminRouter = express.Router();

// All routes require superadmin role
superAdminRouter.use(superAdminMiddleware);

// Dashboard stats
superAdminRouter.get('/stats', SuperAdminController.routeGetStats);

// User management
superAdminRouter.get('/users', SuperAdminController.routeGetUsers);
superAdminRouter.get('/users/:id', SuperAdminController.routeGetUserById);
superAdminRouter.patch('/users/:id/role', SuperAdminController.routeUpdateUserRole);
superAdminRouter.post('/users/admin', SuperAdminController.routeCreateAdmin);
superAdminRouter.delete('/users/:id', SuperAdminController.routeDeleteUser);

// Order management
superAdminRouter.get('/orders', SuperAdminController.routeGetAllOrders);
superAdminRouter.patch('/orders/:id', SuperAdminController.routeUpdateOrderStatus);

module.exports = { superAdminRouter };
