const express= require('express')
const blogRoute = require("./routes/blogs")
const authRoute = require("./routes/auth")
const passport = require('passport')
const PORT = process.env.PORT
const bodyParser = require('body-parser')
const blogsModel = require("models/blogs")
const {connectToMongoDb} = require("./db")

require('dotenv').config()

const app= express()

connectToMongoDb()

app.use(express.json())

app.use(bodyParser.urlencoded({ extended: false }));


//define views here
app.set('views', 'views')
app.set('view engine', 'ejs')

//routes
app.use("/blogs", blogRoute) // route is not protected and can be accessed by both logged in and not logged in users
app.use("/", authRoute) // used to authenticate users
app.use("/users", userRoute) // using a jwt strategy for authentication, seesion is false to prevent saving the token in browser 

// show home page as list of blogs endpoint
// also, be orderable by read_count, reading_time and timestamp
// break down the array tags to single strings using the split array method
app.get("/", (req,res)=>{

    // add order queries 
    // add pagination of 20 per page
    blogsModel.find()
    .then(
        blogs =>{
            res.status(200).json({
                status: true,
                message: {
                    title: blogs.title,
                    author: blogs.author,
                    tags: blogs.tag,
                    description: blogs.description,
                    username: blogs.username
                }
            })
        }
    ).catch(
        err =>{
            res.status(404).json({
                message: err                
            })
        }
    )
})


// the list of blogs accessed by all users should be searchable by author, title, tags
app.get('/:id', (req, res)=>{
    let id;
    
    try{
        if(id = req.body.author){
            blogsModel.findById(id)
            .then(blog =>{
                res.status(200).json(
                    {
                        status: true,
                         message: {
                        title: blog.title,
                        author: blog.author,
                        tags: blog.tag,
                        description: blog.description,
                        username: blog.username
                    }
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
        else if(id = req.body.title){
            blogsModel.findById(id)
            .then(blog =>{
                res.status(200).json({
                    status: true,
                    message: {
                        title: blog.title,
                        author: blog.author,
                        tags: blog.tag,
                        description: blog.description,
                        username: blog.username
                    }
                })
            }).catch(err =>{
                res.status(404).json({
                    status: false,
                    message: err
                })
            })
        }
        // add find blogs by tags. blogs are saved in an array format so they must be splitted into single strings before used for search cases
        // also be orderable by read_count, reading_time and timestamp
    } catch(error){
        res.status(400).send("Invalid Search ID. Search by either using the Author's name, blog's title or tags")
    }
}) 


// error handler
app.use(function (err, req, res, next){
    console.log(err)
    res.status(500).json({
        status: res.status,
        message: err
    })
})

// listening to server

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`)
})