// import express
const express= require('express')
//omport usercontroller
const userController =require('./controllers/userController')

const bookController = require('./controllers/bookController')

const jobController = require('./controllers/jobController')

const applicationController = require('./controllers/applicationController')
const pdfmulterConfig =require('./middlewares/pdfMulterMiddleware')

// import jwt middleware
const jwtMiddleWare = require('./middlewares/jwtMiddleware')


// import multerconfig
const multerConfig = require('./middlewares/multerMiddleware')
const jwtAdminMiddleWare = require('./middlewares/jwtAdminMiddleware')

//instance
const route = new express.Router()

//path for registerr
route.post('/register',userController.registerController)

// path for login
route.post('/login',userController.loginController)

// path for googlelogin
route.post('/google-login',userController.googleLoginController)

// path for add books
route.post('/add-book',jwtMiddleWare,multerConfig.array('uploadedimages',3),bookController.addBookController)


route.post('/apply-jobs',jwtMiddleWare,pdfmulterConfig.single('resume'),applicationController.addApplicationController)

route.get('/all-home-books',bookController.getHomeBookController)



route.get('/all-books',jwtMiddleWare,bookController.getAllBookController)

// path to view abook
route.get('/view-book/:id',bookController.getABookController)

route.get('/all-jobs',jobController.getAllJobsController)

route.delete('/delete-book/:id',bookController.deleteBookController)


// ....................ADMIN.............................
route.get('/admin-all-books',jwtAdminMiddleWare, bookController.getAllAdminBookController)

// approve a book
route.put('/approve-book',jwtAdminMiddleWare, bookController.approveBookController)


route.get('/all-users',jwtAdminMiddleWare, userController.getAllUsersController)

// path to add new job
route.post('/add-job',jobController.addJobController)

route.delete('/delete-job/:id',jobController.deleteJobController)

route.get('/all-applications', applicationController.getApplicationController)
// path to admin profile
route.put('/adm-profile-update',jwtAdminMiddleWare,multerConfig.single('profile'), userController.editAdProfileController)

route.put('/user-profile-update',jwtMiddleWare,multerConfig.single('profile'), userController.edituserProfileController)

route.get('/user-purchase',jwtMiddleWare, bookController.getPurchaseController)

route.get('/user-allbook',jwtMiddleWare, bookController.getSoldHistoryController)

route.put('/make-payment',jwtMiddleWare, bookController.makePaymentController)


//routes export
module.exports=route