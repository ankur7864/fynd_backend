
/**
 *  The routes for the User 
 *  Resource
 */

 const express = require("express");
 const homeController = require("../controllers/home.controller");
 const router = express.Router();

  
  
  /** HOME -- GET */
 router.get("/", homeController.home)
  

 
 module.exports = router