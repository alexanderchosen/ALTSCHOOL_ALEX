const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const moment = require('moment')

const UserSchema = new Schema (
    {
        id: ObjectId,

        firstName: {
            type: String 
            
        },

        lastName: {
            type: String
            
        },
        displayName: {
            type: String
            
        },
        email: {
            type: String,
            required: true,
            unique: [true, 'email must be unique']
        },
        password: {
            type: Schema.Types.Mixed,
            required: true
        },
        createdAt: {
            type: Date,
            default: moment().toDate()
        },
        blogs: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'blogs'

    }
})

// pre- hook
UserSchema.pre(
    'save',
    async function (next){
        const user = this
        const hash = await bcrypt.hash(this.password, 10);

        this.password = hash
        next();
    }
)

// also, to ensure that the user trying to log in has the correct details, we can use this method to compare password saved and that given by the user
UserSchema.methods.isValidPassword = async function (password){
    const user = this
    const comparePassword = await bcrypt.compare(password, user.password) // this helper method takes the saved password and compares with the one given upon login by the user
    return comparePassword
}


module.exports = mongoose.model("users", UserSchema)
