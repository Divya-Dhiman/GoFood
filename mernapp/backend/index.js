import  express from "express"
import mongoose from "mongoose";
import bodyParser from "body-parser";
import compression from "compression";



const app = express()
const port = 5000

app.use(bodyParser.json());
app.use(compression());


mongoose
  .connect("mongodb://127.0.0.1/Gofood", {
    //    useNewUrlPaser:true,
    //     useUnifiedTopology:true,
    //    useCreateIndex:true
  })
  .then(() => {
    console.log("connection");
  })
  .catch((e) => {
    console.log("not connection", e);
  });



app.get('/', (req,res)=>{
    res.send('hello world!')
})

app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`)
})