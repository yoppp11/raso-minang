require('dotenv').config()

const express = require('express')
const { router } = require('./routers')
const { errorHandler } = require('./middlewares/errorMiddleware')
const app = express()
const port = 3000

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use('/', router)
app.use(errorHandler)


app.listen(port, ()=> {
    console.log('menyala abangda', port);
})