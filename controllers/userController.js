const users=require('../model/userModel')
var jwt = require('jsonwebtoken')

//register
exports.registerController= async(req,res)=>{
    //logic

 const {username,email,password}=req.body
 console.log(username,email,password);

try{
 const existingUser=await users.findOne({email})
 if(existingUser){
    res.status(400).json("Already registered user!!")
 }else{
    const newUser=new users({
        username,
        email,
        password,
        profile:"",
        bio:""
    })
    await newUser.save()
    res.status(200).json(newUser)
 }
}catch(err){
    res.status(500).json(err)
}
}


//login
exports.loginController= async(req,res)=>{
    const {email,password} = req.body
  console.log(email,password);
  try{
    const existingUser = await users.findOne({email})
    if(existingUser){
        if(existingUser.password == password){
            const token = jwt.sign({userMail:existingUser.email},'secretkey')
        res.status(200).json({existingUser,token})

        }else{
            res.status(401).json("incorrect password...")
        }
    }else{
        res.status(404).json("incorrect email id....")
    }
  }
  catch(err){
    res.status(500).json(err)

}
}

// googlelogin
exports.googleLoginController = async(req,res)=>{
const {username,email,password,photo} = req.body
console.log(username,email,password,photo);
try{
    const existingUser  = await users.findOne({email})
    if(existingUser){
      const token = jwt.sign({userMail:existingUser.email},'secretkey')
        res.status(200).json({existingUser,token})

    }else{
            const newUser=new users({
        username,
        email,
        password,
        profile:photo,
    })
    await newUser.save()
    const token = jwt.sign({userMail:newUser.email},'secretkey')

    res.status(200).json({existingUser:newUser,token})

    }
}catch(err){
    res.status(500).json(err)
}

}

exports.edituserProfileController = async (req, res) => {
  console.log("Payload:", req.payload); // should log the email
  const { username, password, profile, bio } = req.body;
  const prof = req.file ? req.file.filename : profile;
  const email = req.payload; // ✅ because payload = userMail

  try {
    const userDetails = await users.findOneAndUpdate(
      { email },
      { username, password, profile: prof, bio },
      { new: true }
    );

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userDetails);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};
// ......................ADMIN..............................
exports.getAllUsersController = async(req,res)=>{
    const email = req.payload
    try{
        const allUsers = await users.find({email:{$ne:email}})
    res.status(200).json(allUsers)
    }catch(err){
          res.status(500).json(err)
  
    }
}

exports.editAdProfileController = async(req,res)=>{
    const{username,password,profile} = req.body
  const prof = req.file ? req.file.filename : profile
  const email = req.payload
  try{
    const adminDetails = await users.findOneAndUpdate({email},{username,email,password,profile:prof},{new:true})
    await adminDetails.save()
    res.status(200).json(adminDetails)
  }catch(err){
              res.status(500).json(err)

  }
}

