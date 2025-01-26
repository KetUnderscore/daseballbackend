const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./routes/router')
const path = require('path')
const {logger} = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

app.use(cors(corsOptions))

app.use(logger)

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:false}))

app.use('/', express.static(path.join(__dirname, '/public')))

app.use('/users', require('./routes/userRouter'))
app.use('/auth', require('./routes/authRouter'))
app.use('/fav', require('./routes/favoriteRouter'))

app.use('/', cors({credentials: true, origin: true}), router)

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

const dbOptions = {}
mongoose.connect(process.env.DB_URI, dbOptions)
.then(() => console.log('DB Connected!'))
.catch((err) => console.log(err))

app.use(errorHandler)

const port = process.env.PORT || 4000
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})