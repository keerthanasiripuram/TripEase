const mongoose = require('mongoose')
const { Schema, Types } = mongoose;

const groupExpenseHistorySchema = new Schema({
    group: {
        type: Types.ObjectId,
        ref: "Group",
        required: true
    },
    paidBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    amount: {
        type: Schema.Types.Number,
        required: true
    },
    reason: {
        type: Schema.Types.String,
        required: true
    },
    paymentDetails: {
        type: [
            new Schema({
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'user',
                },
                amount: {
                    type: Schema.Types.Number,
                }
            }, { _id: false }, {
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
module.exports = mongoose.model('GroupUserExpenseHistory', groupExpenseHistorySchema)