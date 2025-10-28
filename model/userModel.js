const mongoose =require('mongoose')

const userSchema=new mongoose.Schema({
username:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
profile:{
    type:String,
   
},
bio:{
    type:String,
    default:"Bookstore user.."
}
})
const users=mongoose.model("user",userSchema)
module.exports=users