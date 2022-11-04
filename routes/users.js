// In this route, after authentication, users can update profile by changing password, profile pics, and display name (have an edit button)
// also, users can access their profile details 


const express = require('express')
const usersModel = require('./models/users')
const usersRouter = express.Router()

//get users details with author's name or get all user details and then filter through with author's name
usersRouter.get('/profile/:author', (req, res)=>{
    const {author}= req.params
// this author params should be gotten from the sign in details after auth
    usersModel.findById(author)
    .then(
        profileDetails =>{
            res.status(200).json({
                status: true,
                message:profileDetails
            })
        }
    ).catch(
        err =>{
            res.status(404).json({
                status: false,
                message: err
            })
        }
    )
})

// update/change password after being authenticated as owner of account, change display name, change profile picture
// reset
usersRouter.patch('/edit/:id', (req, res)=>{
    let id;

    
})

// logout

