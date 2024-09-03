const mongoose = require('mongoose')
const { Schema, Types } = mongoose;

const journalPostSchema = new Schema({

    description: {
        type: String,
        default: ""
    },
    user: {
        type: Types.ObjectId,
        ref: 'user',
    },
    interactors: {
        type: [Types.ObjectId],
        ref: 'user',
        default: []
    },
    images: {
        type: [String],
        default: []
    }
},
    {
        timestamps: true,
        versionKey: false
    }
)
module.exports = mongoose.model('post', journalPostSchema)