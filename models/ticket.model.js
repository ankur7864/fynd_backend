/**
 * This file represents the schema for the ticket Resource
 */

 const mongoose = require("mongoose");
 const constants = require("../utils/constants");
 
 const ticketSchema = new mongoose.Schema({
     title : {
         type : String,
         required : true,
     }, 
 
     description : {
         type : String,
         required : true,
     },
 
     status : {
         type : String,
         required : true,
         default : constants.ticketStatus.open, // Possible values : OPEN / CLOSED / BLOCKED /IN_PROGRESS
     },
 
     reporter : { // Who created ticket - userID  of the creater
         type : String,
     },
 
     assignee : {
         type : String,
     },

 });

/* These will automatically generates the created and updated fields */
 ticketSchema.set('timestamps' , true);
 
 module.exports = mongoose.model("Ticket" , ticketSchema);