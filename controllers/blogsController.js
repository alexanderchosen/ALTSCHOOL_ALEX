const express = require('express')
const blogsModel = require('../models/blogs')
const moment = require('moment')
const usersModel = require('../models/users')

// create a new blog with a default draft state - for auth users
exports.createBlog = async (req, res) =>{
    const {id} = req.user
    const reqBody = req.body
    const blogPost = reqBody.body

    const user = await usersModel.findById({_id: id})

    const wordCount = blogPost.split(" ").length

    // write algorithm for read_count and reading_time
    const reading_time = function(){
        let result = wordCount / 200
        result = result.toFixed(2)
        
        let getDecimal = result.toString().split(".")[1];
        let minutes = result.toString().split(".")[0];

        getDecimal = parseFloat(("0." + getDecimal))
        let seconds = getDecimal * 0.60
        seconds = seconds.toFixed(2)

        let getSeconds = seconds.toString().split(".")[1]
    
        let finalTime = parseFloat(minutes + getSeconds)
        if(finalTime.toString().split(".")[1] < 30){
            return Math.floor(finalTime)
        }else{
            return Math.round(finalTime)
        }

    //     let seconds = resultSplit[1] * 0.60
    //    let newSeconds = seconds.toFixed(2)
    //     secondSplit = newSeconds.split(".")

    //     let finalResult = (minutes+"."+secondSplit[1])
    //     finalResult = finalResult.toFixed()
    }

    read_count = read_count + 1


    const blog = blogsModel.create({
        title: reqBody.title,
        description: reqBody.description,
        tags: reqBody.tags,
        author: id,
        owner: `${user.firstName} ${user.lastname}`,
        timestamp: moment().toDate(),
        body: reqBody.body,
        state: reqBody.state,
        read_count: read_count,
        reading_time: reading_time
    }).then(
        blog =>{
            const saveMyBlog=  blog.save()
            res.status(200).json({
                status: true,
                message: saveMyBlog
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

    
}

// show a single blog when requested and return user information with the blog
exports.getBlog = async(req, res)=>{
    const blogId = req.params.id

    const read_count = read_count + 1

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
                read_count: blog.read_count,
                message: blog 
        }
    )
})
}

// For all users - get published blogs by author or title, tags
// break down the array tags to single strings using the split array method
// after auth, user/author should still be able to search for blogs using different params (additional - his blogs should display on top)
exports.getBlogs = async (req, res)=>{
    const {query} = req

    const { 
        author_name,
        title,
        tags,
        order = 'asc',
        order_by =['read_count', 'reading_time', 'timestamp'],
        page = 1,
        per_page = 20
    } = query
    
    const findQuery = {}
    
    if(author_name){
        findQuery.author_name = {
            author: {$eq: author_name }}
        }
    
        if(title){
            findQuery.title = {
                title: {$eq: title}
            }
        }
    
        if(tags){
            findQuery.tags ={
                tags: {$in: tags }
            }
        }
    
        const sortQuery ={}

        const sortAttributes = order_by

        for (const attribute of sortAttributes){
            if(order === 'asc' && order_by){
                sortQuery[attribute] = 1
            }
        }
    
        const blogs = await blogsModel.find({state:"published"}, findQuery)
        .sort(sortQuery)
        .skip(page)
        .limit(per_page)
    
        return res.status(200).json({
            status: true,
            message: blogs
        })
}

// update a blog state only from draft to published
// logged in user (author) should be able to change the description, tags, title, state (if its in draft), body
exports.updateBlog = async (req, res)=>{
  
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
        blog.tags = [...tags]
        blog.body = body
    
       await blog.save()
    
        return res.status(200).json({
            message: blog
        })
    
    }
      


// delete a blog only done by the author
// id should be a unique title or generated ref_id
exports.deleteBlog = async (req, res)=>{
    const id = req.params.id
    const author = req.user.id
    const blog = blog.author.valueOf()

    if(author === blog){
        const blogToDelete = await blogsModel.findByIdAndDelete({_id:id})

    return res.status(200).json({
        status: true,
        message: "blog with" + id + "was successfully deleted"
    })
    }
    else{
        return res.status(404).json({
            status: false,
            message: " An error occured"
        })
    }
    
}