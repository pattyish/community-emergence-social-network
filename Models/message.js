const mongoose = require('mongoose');
const Users = require("../Models/user");

const messageSchema= mongoose.Schema({

    content:{
        type: String,
        required: [true,'Message content is required']
    },
    sender:{
        type: Object,
        ref: Users,
        required: [true,'Sender is required']
    },
    receiver:{
        ref: Users,
        type: Object,
        ref: Users,
    },
    public:{
        type: Boolean,
        default: true
    },
    date:{
        type: String
    },
    status:{
        type: String,
        default: "Active"
    }
}
);

/*
    The below class is a singleton class that prevent from creating to many models everytime we will require the model.
*/
class MessageModel
{
    constructor(mongoose_var, schema)
    {
        if(!this.instance) // create a model if it has not been already created
        {
            this.instance = mongoose_var.model('Message', schema);
        }
    }

    getModel()
    {
        return this.instance;
    }
};

const model = new MessageModel(mongoose, messageSchema);
module.exports = model.getModel();
