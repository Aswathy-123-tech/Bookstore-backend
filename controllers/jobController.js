const jobs  = require('../model/jobModel')

exports.addJobController = async(req,res)=>{
console.log("inside add book controller");



const{ title,location,jType,salary,qualification,experience,description} = req.body;
console.log(title,location,jType,salary,qualification,experience,description);


try{
    const existingjob = await jobs.findOne({title,location})

    if(existingjob){
        res.status(400).json("you have already added this job!!")
    }else{
        console.log("inside....");
        
        const newJob = new jobs({
       title,location,jType,salary,qualification,experience,description  })
        await newJob.save()
        res.status(200).json(newJob)
    }
}catch(err){
    res.status(500).json(err)
}
}

exports.getAllJobsController = async(req,res)=>{
const searchKey = req.query.search
    try{
const allJobs = await jobs.find({title:{$regex:searchKey,$options:'i'}})
res.status(200).json(allJobs)
    }catch(err){
     res.status(500).json(err)
    }
}

exports.deleteJobController = async(req,res)=>{
    const{id} = req.params
    try{
        await jobs.findByIdAndDelete({_id:id})
        res.status(200).json("deleted")

    }catch(err){
             res.status(500).json(err)

    }
}