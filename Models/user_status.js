const mongoose = require('mongoose');

const userStatusSchema= mongoose.Schema({

    status:{
        type: String,
        required: [true,'Status Name is required']
    },
    color:{
        type: String,
        required: [true,'Status color is required']
    },
    explanation:{
        type: String,
        required: [true,'Status explanation is required']
    },
    timestamp:{
        type: Date,
        default: Date.now()
    }
}
);

/*
    The below class is a singleton class that prevent from creating to many models everytime we will require the model.
*/
class StatusModel
{
    constructor(mongoose_var, schema)
    {
        if(!this.instance) // create a model if it has not been already created
        {
            this.instance = mongoose_var.model('userStatus', schema);
        }
    }

    getModel()
    {
        return this.instance;
    }
};

const model = new StatusModel(mongoose, userStatusSchema);
module.exports = model.getModel();
