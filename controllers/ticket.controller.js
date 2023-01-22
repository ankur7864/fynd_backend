const User = require("../models/user.model");
const Ticket = require("../models/ticket.model");
const constants = require("../utils/constants");
const responseConvertor = require("../utils/responseConvertor");

/** Create a ticket */
exports.createTicket = async (req, res) => {

    const ticketObj = {
         title: req.body.title,
         description: req.body.description
    }

    /**
     * If the ENGINEER  is available 
     */
    try {

     const approvedENGINEER = await User.aggregate([
          { $match : {
               userType : constants.userTypes.ENGINEER,
               userStatus : constants.userStatus.approved,
               }
          },
          {  $unwind : "$ticketsAssigned" } ,
          { $group : { _id : "$_id" ,
                    ticketsAssigned : { "$first" : "$ticketsAssigned"},
                    length : { $sum : 1} } } ,
                    { $sort : { length : 1 } }
     ])
     
     if(approvedENGINEER.length !== 0 ){
          var ENGINEER = await User.findOne({ _id : approvedENGINEER[0]._id });
     }else{
          var ENGINEER = await User.findOne({
                        userType: constants.userTypes.ENGINEER,
                        userStatus: constants.userStatus.approved,
                   })
     }

         if (ENGINEER) {
              ticketObj.assignee = ENGINEER.userId
         }

         /** User ID of reported must be present in x-access-token */
         const customer = await User.findOne({
              userId : req.userId
         })

         if (customer) {
              ticketObj.reporter = customer.userId
         }



         const ticket = await Ticket.create(ticketObj);

         /**
          * Ticket is created Now 
          * We should update the Customer and ENGINEER Documents 
          */

         /**
          * Find Out the Customer
          */

         if (ticket) {

              const user = await User.findOne({
                   userId: req.userId
              })
              /**
               * Update the Customer
               */
              user.ticketsCreated.push(ticket._id);
              await user.save();

              /**
               * Update the ENGINEER
               */
              await ENGINEER.save();

              return res.status(201).send({
                   message: "Ticket , created Successfully !",
                   ticket: responseConvertor.ticketResponse(ticket)
              })
         }

    } catch (error) {

         console.log(error);
         return res.status(500).send({
              status: 500,
              message: "Internal Server Error "
         })
    }
}


/* API to fetch all the Tickets */
exports.getAllTickets = async (req, res) => {
     /**
     * I want to get the list of all the tickets
     */
     const queryObj = {};


     const user = await User.findOne({ userId: req.userId });

     /**
      * If ENGINEER , can able to see all the tickets created 
      */
     if (user.userType === constants.userTypes.ENGINEER) {
          /**
           * Return all the ticket 
           * No need to change in the QueryObj
           */
     }
     else if (user.userType == constants.userTypes.ENGINEER) {
          /**
           * Get all the tickets  Assigned !
           */
          queryObj.assignee = req.userId;

     }
     else if (user.userType == constants.userTypes.customer) {

          /**
           * if CUSTOMER ,should get ticket created by Him.
           */
          if (user.ticketsCreated == null || user.ticketsCreated.length == 0) {
               return res.status(200).send({
                    message: "No tickets created by You !!!"
               })
          }

          queryObj._id = {
               $in: user.ticketsCreated /* Array's of TicketID's */
          }
     }

     if (req.query.status != undefined) {
          queryObj.status = req.query.status;
     };

     const tickets = await Ticket.find(queryObj);

     if (tickets == null || tickets.length == 0) {
          return res.status(200).send({
               message: `No Tickets Found !`
          })
     }

     return res.status(200).send({
          message: `${user.userType} | ${user.userId} , Fetched All Tickets !`,
          tickets: responseConvertor.ticketListResponse(tickets)
     });

}


/**
 * Controller to fetch the Tickets based on ID's 
 */
 exports.getOneTicket = async (req, res) => {

     const ticket = await Ticket.findOne({
          _id: req.params.id
     });

     res.status(200).send({
          status : 200,
          message : "Ticket get successfully !",
          Ticket : responseConvertor.ticketResponse(ticket)
     });
}


/**
 * Controller to Update the Ticket
 */
 exports.updateTicket = async (req, res) => {

     /**
      * Check the Ticket exists 
      */
     const ticket = await Ticket.findOne({
          _id: req.params.id
     });

     if (ticket == null) {
          return res.status(200).send({
               message: "Ticket doesn't exist "
          })
     }

     try {


          /**
           * Only the Ticket Requester be allowed to update the Ticket
           */

          const user = await User.findOne({
               userId: req.userId
          });

          // console.log(ticket.assignee);

          if( ticket.assignee == undefined ){
               ticket.assignee = req.userId;
          }
         
          if ( (user.ticketsCreated == undefined || !user.ticketsCreated.includes(req.params.id)) && !(user.userType == constants.userTypes.ENGINEER )&& !(ticket.assignee == req.userId) ) {
               return res.status(403).send({
                    message: "Only Owner of the Ticket is allowed to Update Ticket "
               })
          }

          /**
          * Update the Attributes of the Saved Ticket 
          */

          ticket.title = req.body.title != undefined ? req.body.title : ticket.title;
          ticket.description = req.body.description != undefined ? req.body.description : ticket.description;
          ticket.status = req.body.status != undefined ? req.body.status : ticket.status;

          const  ENGINEER = await User.findOne({
               userId : ticket.assignee,
          });

          /** 
          * Saved the Changed Ticket
          */
          const updatedTicket = await ticket.save();

          /**  
           *  Return the Updated Ticket
           */
          return res.status(200).send({
               message: "Ticket Updated successfully !",
               ticket: responseConvertor.ticketResponse(updatedTicket)
          });
     }

     catch (error) {
          console.log("Someone updating tickets  , who has not created ticket !");
          return res.status(403).send({
               message: "Ticket can be Updated Only by Customer , who created it !"
          })
     }
}

