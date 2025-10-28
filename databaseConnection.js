//import mongoose

const  mongoose=require('mongoose')

connectionString=process.env.DATABASE

mongoose.connect(connectionString).then(()=>{
    console.log("MongoDB connected successfully...");

    
}).catch((err)=>{
    console.log(`MongoDB connection failed due to ${err}`);
    
})