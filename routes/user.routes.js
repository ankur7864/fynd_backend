
/**
 *  The routes for the User 
 *  Resource
 */

const express = require("express");
const router = express.Router();
 const userController = require("../controllers/user.controller");
 const { JWTAuth } = require("../middlewares")
 
 
 /** FIND-ALL-USERS -- GET */
router.get("/users",[JWTAuth.verifyToken , JWTAuth.isENGINEER] , userController.findAllUsers)
 
 /** FIND-USER-BY-ID -- GET */
router.get("/users/:userId", [JWTAuth.verifyToken , JWTAuth.isENGINEER], userController.findUserByID )


  /** UPDATE-USER --  PUT */
  router.put("/users/:userId", [JWTAuth.verifyToken ], userController.updateUserByID )
 

module.exports = router