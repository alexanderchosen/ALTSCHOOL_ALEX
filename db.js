// connect to DB
const mongoose = require('mongoose')
require('dotenv').config()

// MongoDb url connection
const MONGO_DB_CONNECTION_URL = process.env.MONGO_DB_CONNECTION_URL

// function to check my connection
function connectToMongoDb(){
    mongoose.connect(MONGO_DB_CONNECTION_URL)

    mongoose.connection.on("connected", ()=>{
        console.log("connection to mongoDB successful")
    })
    
    mongoose.connection.on("error", (err)=>{
        console.log(err)
        console.log('MongoDB event error: ' + err)
    })
}

module.exports = {connectToMongoDb}