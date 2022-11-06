// require schema, express, 
const express = require('express')
const BlogsController = require("../controllers/blogsController")

const blogRouter = express.Router()


blogRouter.get('/', BlogsController.getBlogs)

blogRouter.get('/:blogId', BlogsController.getBlog)

blogRouter.post('/', BlogsController.createBlog)

blogRouter.patch('/myblogs/:id', BlogsController.updateBlog)

blogRouter.delete('/myblogs/:id', BlogsController.deleteBlog)


module.exports = blogRouter