//import dotenv file
// const dotenv=require('dotenv')
// dotenv.config()
require("dotenv").config()
//1.import express server
const express=require('express')
//import cors
const cors=require('cors')

//import route
const route = require('./routes')

// import db connection file
require('./databaseConnection')

//import application specific middleware
// const appMiddleWare = require('./middlewares/appMiddleware')

// create server -express()
const BookStoreServer = express()
//sever using cors
BookStoreServer.use(cors())
BookStoreServer.use(express.json()) //parsee json-middleware
// BookStoreServer.use(appMiddleWare)
BookStoreServer.use(route)

// export the uploads folder from server
BookStoreServer.use('/upload',express.static('./uploads'))

BookStoreServer.use('/pdfuploads',express.static('./pdfuploads'))
//create port
const PORT = process.env.PORT || 4000;
BookStoreServer.listen(PORT,()=>{
    console.log(`server running in port:${PORT}`);
    
})