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

    const authorName = req.body
    const page = req.query.p || 1
    const blogsPerPage = 5
    let blogs =[]
    
    blogsModel.find()
    .populate({
        path: 'blogs',
        match: {author: {$gte: authorName}},
        select: 'author'
    })
    .exec()
    .skip((page-1) * blogsPerPage)
    .limit(blogsPerPage)
    .forEach((blog) => {
      blogs =  blogs.push(blog)
      return blogs 
    })
    .then(blogs => {
        res.status(200).json({
            status: true,
            Blogs: blogs.map(blog =>{
                return {
                    title: blog.title,
                    description: blog.description,
                    tags: blog.tags,
                    author: blog.author,
                    timestamp: blog.timestamp,
                    state: blog.state,
                    read_count: blog.read_count,
                    reading_time: blog.reading_time,
                    body: blog.body
                }
            })
        })
    }).catch(err =>{
        console.log(err)
        res.send(err)
    })
})


//get users details with author's name or get all user details and then filter through with author's name
usersRouter.get('/profile', (req, res)=>{
    const authorName= req.body
// this author params should be gotten from the sign in details after auth
    blogsModel.find
    .populate(
        {
            path: 'user',
            match: {author: {$gte: authorName}},
            
        }
    ).exec()
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