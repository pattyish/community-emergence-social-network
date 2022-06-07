const mongoose = require('mongoose');
const Users = require("../Models/user");

const announcementSchema= mongoose.Schema({

    content:{
        type: String,
        required: [true,'The announcement content is required']
    },
    sender:{
        type: Object,
        ref: Users,
        required: [true,'Sender is required']
    },
    date:{
        type: String
    }
}
);

const Announcement = mongoose.model('Announcement', announcementSchema);
module.exports = Announcement;
