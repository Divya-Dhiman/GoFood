import express from "express";
import connectToMongoDB from "./db.js";
import createUser from "./Routes/CreateUser.js";
import DisplayData from './Routes/DisplayData.js';
import cors from 'cors'

// app.use((req,res,next)=>{
//   res.setHeader("Acccesss-Control-Allow-Origin", "http://localhost:3000")
// })

const app = express();
const port = 5000;

connectToMongoDB();

app.use(express.json());
app.use(cors());

app.use("/api", createUser);
app.use("/api", DisplayData)
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
