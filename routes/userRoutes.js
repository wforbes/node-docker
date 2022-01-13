const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const usersController = require("../controllers/usersController");

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.get("/userExists/:username", usersController.exists);

module.exports = router;