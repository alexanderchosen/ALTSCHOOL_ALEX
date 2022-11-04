const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const UserSchema = new Schema (
    {
        id: ObjectId,

        firstName: {
            type: String, 
            required: true
        },

        lastName: {
            type: String,
            required: true
        },
        displayName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: [true, 'email must be unique']
        },
        password: {
            type: mixed,
            required: true
        },
        createdAt: {
            type: Date,
            default: moment().toDate()
        }
    }
)


module.exports = mongoose.model('users', UserSchema)
