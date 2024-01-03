import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import fetch from "../middleware/fetchdetails.js";
import User from "../models/Users.js";
import Order from "../models/Orders.js";
import stripe from "stripe";

const router = express.Router();
const jwtSecret = "HaHa";
const stripeSecretKey = "sk_test_4eC39HqLyjWDarjtT1zdp7dc"; // Replace with your actual Stripe secret key
const stripeClient = new stripe(stripeSecretKey);

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
    // console.log(req.body)
    // let user = await User.findOne({email:req.body.email})
    const salt = await bcrypt.genSalt(10);
    let securePass = await bcrypt.hash(req.body.password, salt);
    try {
      await User.create({
        name: req.body.name,
        // password: req.body.password,  first write this and then use bcryptjs
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
      let user = await User.findOne({ email }); //{email:email} === {email}
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Try Logging in with correct credentials" });
      }

      const pwdCompare = await bcrypt.compare(password, user.password); // this return true false.
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
        // console.log(`statusCode: ${res.status}`)
        console.log(res.data.results);
        // let response = stringify(res)
        // response = await JSON.parse(response)
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

router.post("/orderData", async (req, res) => {
  try {
        // console.log("Received request body:", req.body);

    // Check if req.body is an array
    // if (!Array.isArray(req.body)) {
    //   return res
    //     .status(400)
    //     .json({ error: "Invalid request body format. Expected an array." });
    // }

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_options: [{ shipping_rate: "shr_1N0qDnSAq8kJSdzMvlVkJdua" }],
      line_items: req.body.map((item) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * 100,
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
          quantity: item.qty,
        };
      }),
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await stripeClient.checkout.sessions.create(params);
    res.status(200).json(session.id);
  } catch (err) {
    res.status(err.statusCode || 500).json(err.message);
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
