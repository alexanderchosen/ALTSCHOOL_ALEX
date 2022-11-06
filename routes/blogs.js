// require schema, express, 
const express = require('express')
const blogsModel = require('../models/blogs')
const moment = require('moment')

const blogRouter = express.Router()


// For all users - get published blogs by author or title, tags
// break down the array tags to single strings using the split array method
// after auth, user/author should still be able to search for blogs using different params (additional - his blogs should display on top)
blogRouter.get('/:id', (req, res)=>{

    // set query for only published blogs
    let id;
    try{
        if(id = req.params.author){
            blogsModel.findById(id, {state: "published"})
            .then(blog =>{
                res.status(200).json(
                    {
                        status: true,
                        message: blog
                    }
                )
            }).catch(err =>{
                res.status(404).json(
                    {
                        status: false,
                        message: err
                    }
                )
            })
        }
        else if(id = req.params.title){
            blogsModel.findById(id)
            .then(blog =>{
                res.status(200).json({
                    status: true,
                    message: blog
                })
            }).catch(err =>{
                res.status(404).json({
                    status: false,
                    message: err
                })
            })
        }
        // add find blogs by tags. blogs are saved in an array format so they must be splitted into single strings before used for search cases
        // be orderable by read_count, reading_time and timestamp
    } catch(error){
        res.status(400).send("Invalid Search ID. Search by either using the Author's name, blog's title or tags")
    }
}) 

// show a single blog when requested and return user information with the blog
blogRouter.get('/:blogId', (req, res)=>{
    const blogId = req.params.id

    blogsModel.findById(blogId)
    .populate({
        path: 'user',
        select: 'firstName lastName email'
    })
    .exec()
    .then(
        blog =>{
            res.status(200).json({
                status: true,
                message: blog
        }
    )
})
})



// create a new blog with a default draft state - for auth users
blogRouter.post('/', (req, res)=>{
    const reqBody = req.body

// write algorithm for read_count and reading_time
    const blog = blogsModel.create({
        title: reqBody.title,
        description: reqBody.description,
        tags: reqBody.tags,
        author: reqBody.author,
        timestamp: moment().toDate(),
        body: reqBody.body,
        state: reqBody.state
    }).then(
        blog =>{
            res.status(200).json({
                status: true,
                message: blog
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


// update a blog state only from draft to published
// logged in user (author) should be able to change the description, tags, title, state (if its in draft), body
blogRouter.patch('/myblogs/:id', async (req, res)=>{
// write a function that generates unique random ids
    // let ref_id = function(){
    //     let id = Math.Rand
    // }
    const id = req.params.id
    let {state, description, tags, body } = req.body

    const blog = await blogsModel.findByIdAndUpdate({_id: id})

    // check if title is for the authenticated author or user
    if(!blog){
        return res.status(404).json({
            status: false,
            message: `blog with ${id} does not exist.`
        })
    }

    if(blog.state == "draft"){
        blog.state = state
    }

    // work on changing the author's tag input from strings to an array
    blog.description = description
    // use spread operator to join previous tags, or remove previous tags using .pop and delete specific tags
    blog.tags = tags
    blog.body = body

   // blog.save()

    return res.status(200).json({
        message: blog
    })

})


// delete a blog oly done by the author
// id should be a unique title or generated ref_id
blogRouter.delete('/myblogs/:id'), async (req,res)=>{
    // use another request parameter to delete specific blog
    const id = req.params.id

    const blog2Delete = await blogsModel.deleteOne(id)

    return res.status(200).json({
        status: true,
        message: blog2Delete
    })

    // get/show the remaining blogs after deleting
}


module.exports = blogRouter