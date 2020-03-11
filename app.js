var express = require('express');
var app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());
var mongoose = require('mongoose');
var Schema = require('./schema');
const date = require('date-and-time');
const timestamp = require('time-stamp');
var URL = "mongodb://localhost:27017/businesslogic";
var billschema = require('./bill');
var cartschema = require('./cart');
var rn = require('random-number');
var company = require('./company')


mongoose.connect(URL, { useCreateIndex: true,useNewUrlParser: true, useFindAndModify: false ,useUnifiedTopology: true  },(err,data)=>
{   
        if(err) throw err;
        if(data)
        {
        app.post('/signup',(req,res)=>
        {
            var options = {
            min: 9874316514 
            }
            var num = rn(options);
            var randomNum = num.toFixed(0);
       
            let data = new Schema(
                {
                    id:randomNum,
                    Name:req.body.name,
                    Email:req.body.email,
                    Pwd:req.body.pwd,
                    pincode:req.body.pin,
                    contact:req.body.contact,
                })

                data.save().then(data=>
                    {
                        res.status(200).json({status:true,message:"stored successfully",user_id:randomNum})
                    }).catch(err=>
                        {
                         res.status(200).json({status:false,message:"storing error"})

                        })
        })

        let count = 0;
        app.get('/ping',(req,res)=>
        {
            count++;
        
            const now = new Date();
            var Hours  = now.getHours()
            var Min    = now.getMinutes()
            var sec    = now.getSeconds()
            var time = Hours+':'+Min+':'+sec
            
            res.json({status:true,count:count,date:date.format(now, 'ddd, MMM DD YYYY'),time:time})
        })

        app.post('/addcart/:id',(req,res)=>
        {
            let cart = new cartschema(

                {
                    id:req.params.id,
                    productname:req.body.productname,
                    product_id:req.body.product_id,
                    quantity:req.body.quantity,
                    address:req.body.address,
                    amount:req.body.amount,
                    percentage:req.body.percentage,
                    description:req.body.description
                }
            )

              cart.save().then(data=>
                {
                        res.status(200).json({status:true,message:"cart Data is stored successfully !"})
                }).catch(err=>
                    {
                        res.status(404).json({status:false,message:"cart Data storing error"})
                    })

        })

        app.get('/cartdata',(req,res)=>
        {
            let temp = 0;
            cartschema.find().then(resp=>
                {
                    if(resp.length > 0)
                    {
                        res.json({status:true,cartinfo:resp,error:"null"})
                    }
                    else
                    {
                        res.json({status:false,message:"you had no data",error:"error"})

                    }
              
                })

        })

        app.get('/companyinfo',(req,res)=>
        {
            cartschema.find().then(resp=>
                {
                    if(resp.length > 0)
                    {
                        res.json({status:true,billinfo:resp,error:"null"})
                    }
                    else
                    {
                        res.json({status:false,message:"you had no data",error:"error"})
                    }
              
                })

        })

        app.post('/company/:id',(req,res)=>
        {
            let company = new company(
                {
                    id:req.params.id,
                    gstnum:req.body.gstnum,
                    company_address:req.body.company_address,
                    company_name:req.body.company_name
                }
            )
            company.save().then(data=>
                {
                        res.status(200).json({status:true,message:"Billing Data is stored successfully !"})
                }).catch(err=>
                    {
                        res.status(404).json({status:false,message:"Billing Data storing error"})
                    })

        })

        app.post('/billcart/:id',(req,res)=>
        {
     
            let bill = new billschema(
                {
                    id:req.params.id,
                    email:req.body.email,
                    product_id:req.body.product_id,
                    quantity:req.body.quantity,                    
                    postcode:req.body.postcode,
                    houseNo:req.body.houseNo,
                    streetAddress:req.body.streetAddress,
                    mobile:req.body.mobile
                }
            )

                bill.save().then(data=>
                {
                    cartschema.find({product_id:req.body.product_id}).then(data=>
                        {
                            console.log(data); 
             
                            var QNO = data[0]['quantity'] - req.body.quantity
                            cartschema.findOneAndUpdate({_id:data[0]['_id']}, {$set: {quantity:QNO}}, {new: true}, function(err,doc) {
                                if (err) { throw err; }
                                else { 
                                    console.log("Updated");
                                    res.status(200).json({status:true,message:"Billing Data is stored successfully !"})

                            }
                              });  
                        })
                }).catch(err=>
                    {
                        res.status(404).json({status:false,message:"Billing Data storing error"})
                    })

        })


        app.get('/getbillinfo/:id',(req,res)=>
        {
            billschema.find({id:req.params.id}).then(resp=>
                {
                                        
                    if(resp.length > 0)
                    {
                        res.status(200).json({status:true,data:resp})                    }

                    else
                    {
    
                        res.json({status:false,message:"you had no data",error:"error"})

                    }
                  
             
                })
        
        })


        app.get('/login/:mail/:pwd',(req,res)=>
        {
            Schema.find({Email:req.params.mail}).then(data=>
                {
                    if(data.length > 0)
                    {
                        Schema.find({Pwd:req.params.pwd}).then(pwddata=>
                            {
                            if(pwddata.length > 0)
                            {
                              res.status(200).json({status:true,message:"you are successfully logged-in",data:data})

                            }
                            else
                            {
                             res.status(404).json({status:false,message:"password verification Failed"})

                            }
                            })

                    }
                    else
                    {
                        res.status(404).json({status:false,message:"mail verification Failed"})
  
                    }
                })

            
        })

        }

    })

    var port = 4300;

    app.listen(port,()=>
    {
        console.log("server listening on port:",port);
        
    })