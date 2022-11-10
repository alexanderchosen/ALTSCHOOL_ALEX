// In this route, after authentication, users can update profile by changing password, profile pics, and display name (have an edit button)
// also, users can access their profile details 

const express = require('express')
const UsersController = require('../controllers/usersController')
const usersRouter = express.Router()


usersRouter.get('/myblogs/:id', UsersController.getMyBlogs)

// used /id to get the user id and match
usersRouter.get('/profile/:userId', UsersController.getProfile)


module.exports = usersRouter