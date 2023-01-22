/**
 * This File will have the Logic to Transform the Object
 */

 function userResponse(users){
    usersResponse = [];

    users.forEach(user =>{
        usersResponse.push({
            name : user.name,
            userId : user.userId,
            email : user.email,
            userType : user.userType,
            userStatus : user.userStatus,
        })
    })
    return usersResponse;
}




 function userResponseByID(user){
    findByIDResponse = [];

    findByIDResponse.push({
        name : user.name,
        userId : user.userId,
        email : user.email,
        userType : user.userType,
        userStatus : user.userStatus,
    })
return findByIDResponse;
}

function ticketResponse ( ticket ){
    return {
        title : ticket.title,
        description : ticket.description,
        status : ticket.status,
        reporter : ticket.reporter,
        assignee : ticket.assignee,
        id : ticket._id,
        createdAt : ticket.createdAt,
        updatedAt : ticket.updatedAt
    }
}

function ticketListResponse(tickets) {
    ticketResult = [];
    tickets.forEach( ticket => {
        ticketResult.push({
            title : ticket.title,
            description : ticket.description,
            status : ticket.status,
            reporter : ticket.reporter,
            assignee : ticket.assignee,
            id : ticket._id,
            createdAt : ticket.createdAt,
            updatedAt : ticket.updatedAt
        })
    })

    return ticketResult;
}

module.exports = { 
    userResponse , 
    userResponseByID ,
    ticketResponse ,
    ticketListResponse
}