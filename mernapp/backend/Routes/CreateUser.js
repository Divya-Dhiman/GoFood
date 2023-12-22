const express = require('express')
const router = express.Router()
const User = require('../models/Users')

router.post("/createuser",async (req,res)=>{
    try{
        User.create({
            name: "Shyam Das",
            password: "123456",
            email: "shyamdas12@hotmail.com",
            location: "QWerty edrfef"
        })
        res.json({success:true});
    }
    catch (error) {
        console.log(error)
        res.json({success:false});
    }
})

module.exports = router;