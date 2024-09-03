const mongoose = require('mongoose')
const { Schema, Types } = mongoose;

const DocumentsSchema = new Schema({


    user: {
        type: Types.ObjectId,
        ref: 'user',
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
module.exports = mongoose.model('Document', DocumentsSchema)