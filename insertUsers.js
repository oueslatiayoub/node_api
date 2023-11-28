const mongoose = require('mongoose');
const { insertUsers } = require('./Models/dataAccess');
require('dotenv').config();

mongoose
  .connect(process.env.MONGODB_URL, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('mongodb connected');
    insertUsers();
  })
  .catch((err) => console.log(err.message));
