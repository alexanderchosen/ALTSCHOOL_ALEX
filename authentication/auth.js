// where we retrieve token for signup and login using passport

const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const UsersModel = require('../models/users')
require('dotenv').config()

const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt 

// using a bearer auth method
passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken() // for bearer auth, i have to add token to the header as an authentiction header
        }, 
        async(token, next)=>{
            try{
                return next(null, token.user)
            } catch(error){
                return next(error)
            }
        }
    )
)

// this next middleware saves the information provided to the DB,
// then, it sends the users information to the next middleware if successful or returns an error if it fails

// for signup
passport.use(
    'signup',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async(email, password, next)=>{
            try{
                const user = await UsersModel.create({email, password})
                return next(null, user, {message: "Sign In successful"})
            } catch(error){
                next(error)
            }
        }
    )
)



// for login
passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        }, 
        async(email, password, next)=>{
            try{
                const user = await UsersModel.findOne({email})

                if(!user){
                    return next( null, false, {message: 'email and password not found'})
                }

                const validatePassword = await user.$isValidPassword(password)

                if(!validatePassword){
                    return next(null, false, {message: 'password is incorrect!'})
                }

                return next(null, user, {message: 'Login Successful'})

            } catch(error){
                next(error)
            }
        }
    )
)
