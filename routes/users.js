// In this route, after authentication, users can update profile by changing password, profile pics, and display name (have an edit button)
// also, users can access their profile details 


const express = require('express')
const usersModel = require('../models/users')
const blogsModel = require('../models/blogs')
const usersRouter = express.Router()

// the user route is activated when a user clicks on the profile

// this get route is for the authenticated user to get all his drafted and published blogs, have a MY BLOGS button
// in a div card showing basic info such as title, description, state, tags  
usersRouter.get('/myblogs', (req, res)=>{
    // filter by state query and paginate 5 per pages
    // onclick event on each list to show the full body
    blogsModel.find()
    .then(blogs => {
        res.status(200).json({
            status: true,
            message: {
                title: blogs.title,
                tags: blogs.tag,
                description: blogs.description,
                state: blogs.state
            }
        })
    }).catch(err =>{
        console.log(err)
        res.send(err)
    })
})


//get users details with author's name or get all user details and then filter through with author's name
usersRouter.get('/profile/:author', (req, res)=>{
    const {author}= req.params
// this author params should be gotten from the sign in details after auth
    blogsModel.findById(author)
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


module.exports = usersRouter