const mongoose = require('mongoose')
const moment = require ('moment')

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const BlogSchema = new Schema({
    id: ObjectId,

    title: {
        type: String,
        required: true,
        unique: [true, 'Blog title must be unique and creative']
    },
    description: {
        type: String
    },
    tags:{
        type: Array,
        default: undefined,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    timestamp:{
        type: Date,
        default: moment().toDate()
    },
    state:{
        type: String,
        default: "draft"
    },
    read_count:{
        type: Number,
        required: true,
        default: 0
    },
    reading_time:{
        type: Schema.Types.Mixed,
        required: true,
        default: "0 secs"
    },
    body:{
        type: String,
        required: true,
        unique: [ true, 'We uphold every authors right and frowns seriously against unlawful copyrights and plagiarism ']
    }
})


module.exports = mongoose.model('blogs', BlogSchema)