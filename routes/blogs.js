// require schema, express, 
const express = require('express')
const blogsModel = require('./models/blogs')
const moment = require('moment')

const blogRouter = express.Router()

// get all blogs
blogRouter.get('/blogs', (req, res)=>{
    blogsModel.find()
    .then(blogs => {
        res.status(200).json(blogs)
    }).catch(err =>{
        console.log(err)
        res.send(err)
    })
})

// get blogs by author or title, tags
// break down the array tags to single strings using the split array method

blogRouter.get('/blogs/:id', (req, res)=>{
    let id;
    try{
        if(id = req.params.author){
            blogsModel.findById(id)
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

// create a new blog with a default draft state

blogRouter.post('/', (req, res)=>{
    const reqBody = req.body

    const blog = blogsModel.create({
        title: reqBody.title,
        description: reqBody.description,
        tags: reqBody.tags,
        author: reqBody.author,
        timestamp: moment().toDate(),
        state: reqBody.state,
        read_count: reqBody.read_count,
        reading_time: reqBody.reading_time,
        body: reqBody.body
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
blogRouter.patch('/:title', (req, res)=>{
// write a function that generates unique random ids
    // let ref_id = function(){
    //     let id = Math.Rand
    // }
    const {title} = req.params
    const {state, description, tags, body } = req.body

    const blog = blogsModel.findById(title)

    if(!blog){
        return res.status(404).json({
            status: false,
            message: `blog with {title} was found`
        })
    }

    if(state == "draft"){
        blog.state = state
    }

    // work on changing the author's tag input from strings to an array
    blog.description = description
    blog.tags = tags
    blog.body = body

    blog.save()

    return res.status(200).json({
        status: true,
        message: blog
    })

})


// delete a blog 
// id should be a unique title or generated ref_id
blogRouter.delete('/:title'), (req,res)=>{
    const {title} = req.params

    const blog2Delete = blogsModel.deleteOne(title)

    return res.status(200).json({
        status: true,
        message: `blog with title {blog2Delete.title} has been deleted`
    })
}