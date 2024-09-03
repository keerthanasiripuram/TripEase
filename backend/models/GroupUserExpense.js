const mongoose = require('mongoose')
const { Schema, Types } = mongoose;

const groupUserExpense = new Schema({
    group: {
        type: Types.ObjectId,
        ref: "Group",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    balance: {
        type: Schema.Types.Number,
        default:0,
        required: true
    },
    userDetails:{
        type:[
            new Schema({
                userId:{
                    type: Schema.Types.ObjectId,
                    ref: 'user',
                },
                amount: {
                    type: Schema.Types.Number,
                }
            }, { _id: false },
            {
                timestamps: true,
                versionKey: false
            })
        ],
        default: []
    }
},
    {
        timestamps: true,
        versionKey: false
    }
)
module.exports = mongoose.model('GroupUserExpense', groupUserExpense)