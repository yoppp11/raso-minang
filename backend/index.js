require('dotenv').config()

const express = require('express')
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); 
const cors = require('cors')
const { router } = require('./routers')
const { errorHandler } = require('./middlewares/errorMiddleware')
const app = express()
const port = 3000

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

app.use('/', router)
app.use(errorHandler)


app.listen(port, ()=> {
    console.log('menyala abangda', port);
})

module.exports = {
    app,
    upload
}