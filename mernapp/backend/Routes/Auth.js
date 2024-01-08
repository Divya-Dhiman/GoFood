import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import fetch from "../middleware/fetchdetails.js";
import User from "../models/Users.js";
import Order from "../models/Orders.js";
import Stripe from "stripe";
import dotenv from "dotenv"; 


dotenv.config();
const router = express.Router();
const jwtSecret = "haha"

const stripeSecretKey =
  "sk_test_51OV7X5SAXoYgVXCem1gK296BDWEZ111C8GdzcVOkET6TZxwpd4ymxV5vWRwaWmKY6DlczZe5NFCMWq6qDy6pFqGt00aU5HREg3"; 
const stripe = new Stripe(stripeSecretKey);



router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
   
    const salt = await bcrypt.genSalt(10);
    let securePass = await bcrypt.hash(req.body.password, salt);
    try {
      await User.create({
        name: req.body.name,
        password: securePass,
        email: req.body.email,
        location: req.body.location,
      })
        .then((user) => {
          const data = {
            user: {
              id: user.id,
            },
          };
          const authToken = jwt.sign(data, jwtSecret);
          success = true;
          res.json({ success, authToken });
        })
        .catch((err) => {
          console.log(err);
          res.json({ error: "Please enter a unique value." });
        });
    } catch (error) {
      console.error(error.message);
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email }); 
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Try Logging in with correct credentials" });
      }

      const pwdCompare = await bcrypt.compare(password, user.password);
      if (!pwdCompare) {
        return res
          .status(400)
          .json({ success, error: "Try Logging in with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      success = true;
      const authToken = jwt.sign(data, jwtSecret);
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.send("Server Error");
    }
  }
);


router.post("/getuser", fetch, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.send("Server Error");
  }
});

router.post("/getlocation", async (req, res) => {
  try {
    let lat = req.body.latlong.lat;
    let long = req.body.latlong.long;
    console.log(lat, long);
    let location = await axios
      .get(
        "https://api.opencagedata.com/geocode/v1/json?q=" +
          lat +
          "+" +
          long +
          "&key=74c89b3be64946ac96d777d08b878d43"
      )
      .then(async (res) => {
        console.log(res.data.results);
        
        let response = res.data.results[0].components;
        console.log(response);
        let { village, county, state_district, state, postcode } = response;
        return String(
          village +
            "," +
            county +
            "," +
            state_district +
            "," +
            state +
            "\n" +
            postcode
        );
      })
      .catch((error) => {
        console.error(error);
      });
    res.send({ location });
  } catch (error) {
    console.error(error.message);
    res.send("Server Error");
  }
});


router.post("/foodData", async (req, res) => {
  try {
    res.send([global.foodData2, global.foodcategray]);
  } catch (error) {
    console.error(error.message);
    res.send("Server Error");
  }
});

// router.post("/orderData", async (req, res) => {
//   try {
//     const { order_data, email, token } = req.body;

//     if (!token || !token.id) {
//       return res.status(400).json({ error: "Invalid token" });
//     }

//     const charge = await stripe.charges.create({
//       amount: order_data.reduce((total, food) => total + food.price * 100, 0),
//       currency: "INR",
//       source: token.id,
//       description: "Payment for items in the cart",
//     });

//     const existingOrder = await Order.findOne({ email: email });

//     if (!existingOrder) {
//       await Order.create({
//         email: email,
//         order_data: [order_data],
//       });
//     } else {
//       await Order.findOneAndUpdate(
//         { email: email },
//         { $push: { order_data: order_data } }
//       );
//     }

//     res.status(200).json({ message: "Payment successful", charge });
//   } catch (error) {
//     console.error("Error during payment:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
router.post("/orderData", async (req, res) => {
  try {
    const { order_data, email, token, order_date } = req.body;

    // Save order data to MongoDB
    const newOrder = new Order({ order_data, email, token, order_date });
    await newOrder.save();

    res.status(200).send("Order placed successfully!");
  } catch (error) {
    console.error("Error during order placement:", error);
    res.status(500).send("Failed to place order. Please try again.");
  }
});
  

router.post("/myOrderData", async (req, res) => {
  try {
    const eId = await Order.findOne({ email: req.body.email });
    res.json({ orderData: eId });
  } catch (error) {
    res.send("Error", error.message);
  }
});



export default router;
