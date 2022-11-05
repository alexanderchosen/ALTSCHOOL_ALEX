const express= require('express')
const mongoose = require('mongoose')
const blogRoute = require("./routes/blogs")
const authRoute = require("./routes/auth")
const passport = require('passport')
const bodyParser = require('body-parser')
const blogsModel = require("./models/blogs")
const {connectToMongoDb} = require('./db')
const userRoute = require("./routes/users")
require('./authentication/auth')

require('dotenv').config()

const app= express()

app.use(express.json())

const PORT = process.env.PORT

connectToMongoDb()

app.use(bodyParser.urlencoded({ extended: false }));


//define views here
app.set('views', 'views')
app.set('view engine', 'ejs')

//routes
app.use("/auth", authRoute) // used to authenticate users and cn be accessed by all
app.use("/blogs",passport.authenticate('jwt', { session: false }), blogRoute) // route is protected and can be accessed by logged in users - using jwt strategy for auth
app.use("/users",passport.authenticate('jwt', { session: false }), userRoute) // using a jwt strategy for authentication, seesion is false to prevent saving the token in browser 

// show home page as list of published blogs endpoint
// also, be orderable by read_count, reading_time and timestamp
// break down the array tags to single strings using the split array method
app.get("/", (req,res)=>{

    // add order queries 
    // add pagination of 20 per page
    // show only published blogs

//     const blog = function blogFormat(){
//         for(let i=0; i<= blogs.length; i++){
//         blogs.title,
//         description: blogs.description,
//         author: blogs.author,
//         reading_time: blogs.reading_time,
//         tags: blogs.tags
//     }
// }


    blogsModel.find({state: "published"})
    .then(
        blogs =>{
            res.status(200).json({
                status: true,
                message: blogs
        })
    }).catch(
        err =>{
            res.status(404).json({
                message: err                
            })
        }
    )
})



// the list of blogs accessed by all users should be searchable by author, title, tags
// show only published blogs
app.get('/id', async (req, res)=>{
    let id = mongoose.Types.ObjectId(req.params.trim());
    // let id = (req.body).trim()
    // let objectId = new ObjectID(id);
    

    try{
        if(id = req.params.author){
            const blogs = await blogsModel.findById(id)
           
           return res.status(200).json(
                {
                    status: true,
                    message: {
                        title: blogs.title,
                        author: blogs.author,
                        tags: blogs.tags,
                        description: blogs.description,
                        username: blogs.username
                    }
                    }
                )
            }
        //     (err =>{
        //         res.status(404).json(
        //             {
        //                 status: false,
        //                 message: err
        //             }
        //         )
        //     })
        // }
        else if(id = blogs.title){
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