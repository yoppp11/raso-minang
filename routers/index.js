const express = require('express')
const { userRouter } = require('./userRouters')
const { cartRouter } = require('./cartRouter')
const { authMiddleware } = require('../middlewares/authMiddleware')
const router = express.Router()

router.get('/', (req, res) => {
    res.send({
        message: 'yeayyyyyy'
    })
})

router.use('/', userRouter)
router.use(authMiddleware)

router.use('/', cartRouter)


module.exports = {
    router
}