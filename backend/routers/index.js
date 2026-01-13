const express = require('express')
const { userRouter } = require('./userRouters')
const { cartRouter } = require('./cartRouter')
const { authMiddleware } = require('../middlewares/authMiddleware')
const { orderRouter } = require('./orderRouter')
const { menuRouter } = require('./menuRouter')
const { chatRouter } = require('./chatRouter')
const { superAdminRouter } = require('./superAdminRouter')
const router = express.Router()

router.get('/', (req, res) => {
    res.send({
        message: 'yeayyyyyy'
    })
})

router.use('/', userRouter)
router.use(authMiddleware)

router.use('/', cartRouter)
router.use('/', orderRouter)
router.use('/', menuRouter)
router.use('/chat', chatRouter)
router.use('/superadmin', superAdminRouter)


module.exports = {
    router
}