const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

router.get("/userExists/:username", userController.exists);

router.post("/signup", authController.signup);

router.get("/checkSession", authController.checkSession);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.put("/:id", userController.update);



module.exports = router;