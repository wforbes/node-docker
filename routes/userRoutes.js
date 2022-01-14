const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const usersController = require("../controllers/usersController");

router.get("/userExists/:username", usersController.exists);

router.post("/signup", authController.signup);

router.get("/checkSession", authController.checkSession);

router.post("/login", authController.login);



module.exports = router;