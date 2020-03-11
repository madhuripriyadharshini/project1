var mongoose = require('mongoose');

var tableschema = new mongoose.Schema({

   id:{
       type:Number,unique:true
   },
   Name:{
       type:String
   },
   Email:{
       type:String
   },
   Pwd:{
       type:String
   },
   pincode:{
       type:Number
   },
   contact:{
       type:Number
   }
  
})
module.exports=mongoose.model('signuprecords',tableschema);