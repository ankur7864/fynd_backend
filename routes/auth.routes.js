/**
 * Routes for Authentication and Authorization
 */

// UserType  |  UserID | Passsword 

// Customer  |  Nil11 | newNil11@
// ENGINEER  |  Nil02 | Customer@123
// ENGINEER  | user02  | newUser02@
// ENGINEER     | ENGINEER |  Welcome987

// RESTFULL -APIs for Authentication
const express = require("express");
const authController = require("../controllers/auth.controller");
const { signupVerification } = require("../middlewares");
const router = express.Router();



/** SIGNUP - POST */
router.post("/auth/signup", [signupVerification.addMiddlewaresToSignupRequest] , authController.signup);

 /** SIGNIN - POST */
router.post("/auth/signin", authController.signin);

module.exports = router
   