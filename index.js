const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser')

const app = express()
const PORT = 3000 || process.env.PORT;

app.use(express.json()); 

const connectDB = require('./server/config/db');

//connection to database
connectDB();


app.use('/', require('./server/routes/formation/main'));

app.get('' , (req,res)=>{
    res.send("Hello world");
} )

app.listen(PORT , ()=>{
    console.log(`Node server is running on port ${PORT}`)
})