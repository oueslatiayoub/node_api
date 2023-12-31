const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
require('dotenv').config()
require('./helpers/init_mongodb')
const { verifyAccessToken} = require('./helpers/jwt_helper')
require ('./helpers/init_redis')


const AuthRoute = require('./Routes/Auth.route')
//const cors = require('cors')

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/',verifyAccessToken ,  async (req, res, next) => {
    res.send("Hello from express")
})

//app.use(cors)
app.use('/auth', AuthRoute)

/*const corsOptions = {
    origin: 'http://localhost:8080',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies, Authorization headers, etc.)
    optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  app.use(cors(corsOptions));*/

app.use(async (req, res, next) => {
    //const error = new Error ("Not found")
    //error.status = 404
    //next(error)
    next(createError.NotFound())
})

app.use((err, req ,res, next) => {
    res.status(err.status || 500)
   res.send({
    error:{
        status: err.status || 500,
        message: err.message,
    },
   })
})
const PORT = process.env.PORT || 3000

app.listen(PORT, '0.0.0.0',() =>{
    console.log(`Server running on ${PORT}`)
})
