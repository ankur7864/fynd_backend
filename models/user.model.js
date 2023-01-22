
/**
* Schema for the user Model will be provided Here
*/

const mongoose = require("mongoose");
const constants = require("../utils/constants");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        minLength: 10,
        unqiue: true
    },

    userType: {
        type: String,
        required: true,
        default: constants.userTypes.customer
        //   default : "CUSTOMER"
    },
    userStatus: {
        type: String,
        required: true,
        default: constants.userStatus.approved
    },

    ticketsCreated: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Ticket" /* Collection Name */
        /* One to Many Relationship between the Ticket's and the User */
    },

    ticketsAssigned: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Ticket"
    }


});

/* These will automatically generates the created and updated fields */
userSchema.set('timestamps' , true);



module.exports = mongoose.model("User", userSchema);


