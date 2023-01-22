const User = require("../models/user.model");
const constants = require("../utils/constants");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
/** Registration Controller  for the User  */

exports.signup = async ( req, res ) => {

    var userStatus = req.body.userStatus;

    if (!userStatus) {
        if (!req.body.userType || req.body.userType != constants.userTypes.ENGINEER) {
            userStatus = constants.userStatus.approved;
        } else {
            userStatus = constants.userStatus.pending;
        }
    }

    const UserDetailsStoredInDB = {
        name: req.body.name,
        userId: req.body.userId,
        email: req.body.email,
        userType: req.body.userType,
        password: bcrypt.hashSync(req.body.password, 8),
        userStatus: userStatus,
    }

     /**
     * Create the New User and Added to the database
     */
      try {
        const createdUser = await User.create(UserDetailsStoredInDB);

         /**
         *  response
         */
          const ResponseOfNewUser = {
            name: createdUser.name,
            userId: createdUser.userId,
            email: createdUser.email,
            userType: createdUser.userType,
            userStatus: createdUser.userStatus,
            createdAt: createdUser.createdAt,
            updatedAt: createdUser.updatedAt
        }

        res.status(201).send({
            status : 201,
            message: `${createdUser.userId} , Added Successully !`,
            user: ResponseOfNewUser
        });
    } catch (err) {

        console.log( err.message);
        res.status(500).send({
            message: "Internal Server Error ,when Insert User !"
        })
    }

}


/**
 * signin Controller
 */
 exports.signin = async (req, res) => {

    //Search the user if it exists 
    try {
        var user = await User.findOne({ userId: req.body.userId });
    } catch (err) {
        console.log(err.message);
    }
    
    if (user == null) {
        return res.status(400).send("User ID Doesn't Exist !")
    }

    /**
     * Check if the user is approved
     */
    if (user.userStatus != constants.userStatus.approved) {
        return res.status(200).send("Can't allow the login as the User is still not approved")
    }

    //User is exists , check for the valid password
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

    if (!isPasswordValid) {
        return res.status(401).send("Invalid Password")
    }

    //** Successfull login */
    //I need to generate access token now
    const token = jwt.sign({ id: user.userId }, process.env.SECRET, {
        expiresIn: '2h'
    });

    //Send the response back 
    res.status(200).send({
        status : 200,
        message: `${user.userId} login Successfully !`,
        user: {
            name: user.name,
            userId: user.userId,
            email: user.email,
            userType: user.userType,
            userStatus: user.userStatus,
            accessToken: token
        }
    })

};