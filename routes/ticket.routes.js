const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticket.controller");
const {  JWTAuth } = require("../middlewares");

module.exports = router

/** createTicket - POST  */
router.post("/tickets" ,[ JWTAuth.verifyToken ], ticketController.createTicket );

 /**GET ALL TICKETS - GET */
router.get("/tickets" ,[ JWTAuth.verifyToken ], ticketController.getAllTickets );
    
/** GET ONE TICKET -- GET */
router.get("/tickets/:id" ,[ JWTAuth.verifyToken ], ticketController.getOneTicket  );

  /** UPDATE TICKETS -- PUT */
router.put("/tickets/:id" ,[ JWTAuth.verifyToken ], ticketController.updateTicket  );
