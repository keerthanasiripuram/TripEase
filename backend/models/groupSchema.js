const mongoose = require('mongoose');


const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
    }],
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Create the Group model
const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
