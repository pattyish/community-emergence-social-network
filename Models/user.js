const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema=mongoose.Schema({
    firstname:{
        type: String
    },
    lastname:{
        type: String
    },
    username:{
        type: String,
        required: [true,'A username must be unique.'],
        unique: true
    }, 
    password:{
        type: String,
        required: [true,'A password is required']
    },
    privilege: {
        type: String ,
        default: "citizen"
    },
    userrole:{
        type: String
    },
    who_added:{
        type: Object
    },
    status: {
        type: String,
        default: "active"
    },
    userstatus: {
        type: Object
    },
    isPanicButtonResponder: {
        type: Boolean,
        default: false,
    },
    lat: {
        type: Number,
        default: 0.0,
    },
    lng: {
        type: Number,
        default: 0.0,
    },
    email: {
        type: String
    },
});

userSchema.methods.isPasswordCorrect = async function(enteredPassword, realPassword)
{
    return await bcrypt.compare(enteredPassword, realPassword);
}

/*
    The below class is a singleton class that prevent from creating to many models everytime we will require the model.
*/
class MessageModel
{
    constructor(mongoose_var, schema)
    {
        if(!this.instance) // create a model if it has not been already created
        {
            this.instance = mongoose_var.model('Users', schema);
        }
    }

    getModel()
    {
        return this.instance;
    }
};

const model = new MessageModel(mongoose, userSchema);

module.exports = model.getModel();