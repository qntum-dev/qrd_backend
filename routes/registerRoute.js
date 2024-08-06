const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../services/registerUserService");
const validInfo = require("../middleware/validInfo");
const authorize = require("../middleware/authorize");
const { getUserById } = require("../services/userService");

router.post("/register", validInfo, async (req, res) => {
    try {
      const { phoneNumber, name, password } = req.body;
      const jwtToken = await registerUser(name, phoneNumber, password);
      res.json({ jwtToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });
  
  router.post("/login", validInfo, async (req, res) => {
    try {
      const { phoneNumber, password } = req.body;
      const {jwtToken,user} = await loginUser(phoneNumber, password);

      
      console.log("logged in");
      

      res.json({ jwtToken:jwtToken,user:user });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });
  
  router.post("/verify", authorize, async (req, res) => {
    try {
      res.json(true);
      
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });
  
  module.exports = router;
  