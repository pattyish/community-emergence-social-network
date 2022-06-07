const mongoose = require('mongoose');
const Users = require('./../user');

const documentSchema= mongoose.Schema({
    topic:{
        type: String,
        required: [true,'The document should have a topic']
    },
    document_name:{
        type: String,
        required: [true,'Document should have a name'],
        unique: true
    },
    date:{
        type: String,
        required: [true, "The date on-which a document was saved is needed"]
    },
    uploader:{
        type: mongoose.Schema.Types.ObjectId,
        ref: Users,
        required: [true,'A document should show who uploaded it']
    },
    reviewed:{
        type: Boolean,
        default: false
    },
    accepted:{
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: [true, "A document description is needed to guide the citizen"],
        unique: true
    }
}
);

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
