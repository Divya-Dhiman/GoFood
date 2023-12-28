import express from "express";
const router = express.Router();

router.post('/foodData',(req,res)=>{
    try{
        res.send([global.foodData2, global.foodcategray]);

    }
    catch(error) {
        console.errror(error.message);
        res.send("Server Error")

    }
})


export default router;
