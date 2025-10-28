const applications = require('../model/applicationModel');

//app applications

exports.addApplicationController = async(req,res)=>{
    const { fullname,
     jobTitle,
     qualification,
     experience,
     email,
     phone,
     coverletter}=req.body
    console.log(fullname,
     jobTitle,
     qualification,
     email,
     phone,
     coverletter);
const resume = req.file ? req.file.filename : null;
    console.log(resume);

    try{
        const existingApplication =await applications.findOne({jobTitle,email})
        if(existingApplication){
            res.status(400).json("alredy appied this post")
        }else{
            const newApplication = new applications({
                fullname,
     jobTitle,
     qualification,experience,
     email,
     phone,
     coverletter,resume
            })
            await newApplication.save()
            res.status(200).json(newApplication)
        }
    }catch(err){
        res.status(500).json(err)
    }
    
console.log("inside.");

}

exports.getApplicationController = async(req,res)=>{
    try{
        const allApplication = await applications.find()
        res.status(200).json(allApplication)
    }catch(err){
        res.status(500).json(err)
    }
}