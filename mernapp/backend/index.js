import express from "express";
import connectToMongoDB from "./db.js";
import 

const app = express();
const port = 5000;

// Connect to MongoDB
connectToMongoDB();
app.use(express.json());
app.use('/api',require("./Routes/CreateUser"))


app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
