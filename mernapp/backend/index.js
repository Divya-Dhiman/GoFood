import express from "express";
import connectToMongoDB from "./db.js";
import cors from "cors";
import authRoutes from "./Routes/Auth.js";

const app = express();
const port = 5000;

// Configure CORS
const corsOptions = {
  origin: "http://localhost:3000", // Replace with the origin of your React app
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

connectToMongoDB()
  .then(({ data, catData }) => {
    global.foodData2 = data;
    global.foodcategray = catData;

    app.use("/api/auth", authRoutes);

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });
