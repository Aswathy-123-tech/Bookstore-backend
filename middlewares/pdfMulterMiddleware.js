//import multer
const multer = require('multer')

const storage = multer.diskStorage({
    //PATH TO STORE FILE
    destination:(req,file,callback)=>{
        callback(null,'./pdfuploads')
    },
    filename:(req,file,callback)=>{
        const fName = `resume-${file.originalname}`
    callback(null,fName)
    }
})
const  fileFilter = (req,file,callback)=>{
    if(file.mimetype == 'application/pdf'){
        callback(null,true)

    }else{
        callback(null,false)
        return callback(new Error('accepts only pdf filess....'))
    }

}
const pdfmulterConfig = multer(
    {storage,fileFilter}
)

module.exports = pdfmulterConfig