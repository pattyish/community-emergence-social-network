const Document = require('../../Models/learn-and-support-models/helpDocumentModel');
const User = require('./../../Models/user');
const validation = require('./../../utils/helper_classes/Validations');


exports.saveDocument = async (req, res) => {
    try
    {
        // Validate if saving body has all importanty properties
        if(!validation.validateSaveDocument(req.body))
        {
            res.status(404).json({
                status: "failed",
                message: "All details have to be provided"
            });
        }
        else
        {
            // I am going to validate the user, to see if he already exists
            const uploader= await User.findById(req.body.uploader);
            if(!uploader)
            {
                res.status(404).json({
                    status: "fail",
                    message: "the uploader given is not valid"
                });
            }
            else
            {
                 // I am going to save the document of data given
                const body = req.body;
                console.log(body);
                const document = {
                    document_name: body.document_name,
                    uploader: body.uploader,
                    date: body.date,
                    topic: body.topic,
                    description: body.description
                }
                const result_saved = await Document.create(document);
                if(!result_saved)
                {
                    res.status(404).json({
                        status: "fail",
                        message: "could not save the document"
                    });
                }
                else
                {
                    res.status(200).json({
                        status: "success",
                        message: "Document saved",
                        data: result_saved
                    });
                }
            }
        }
    }
    catch(err)
    {
        res.status(404).json({
            status: "error",
            message: "something went wrong in saving the document",
            error: err
        });
    }
}

exports.saveDocumentChanges = async(req,res) => {
    try
    {
        if(!validation.validateSaveDocumentChanges(req.body))
        {
            res.status(404).json({
                status:"failed to validate",
                message: "To accept or reject a document: document_id and acceptance/rejects are needed"
            });
        }
        else
        {
            // Validate if the document given is a valid document id
            const body = req.body;
            if(!validation.isIdValid(body.document_id))
            {
                res.status(404).json({
                    status: "fail",
                    message: "document Id given is not a valid id",
                    data: req.body
                });
            }
            else
            {
                // update the document of a given if
                const updated_document = await Document.findByIdAndUpdate(body.document_id, {reviewed: body.reviewed, accepted: body.acceptance}); // updates
                if(!updated_document)
                {
                    res.status(404).json({
                        status: "fail",
                        message: "the document cannot be updated"
                    });
                }
                else // SUCCESS
                {
                    res.status(200).json({
                        status:"success",
                        message: "The changes are save successfully",
                        data: updated_document
                    });
                }
            }
        }
    }
    catch(err)
    {
        res.status(404).json({
            status: "error",
            message: "Saving changes is failed"
        });
    }
}

exports.getOneDocument =  async(req, res) => {
    try
    {
        // validate the param given, to check if it is a valid id
        const params = req.params;
        if(!validation.isIdValid(params.id))
        {
            res.status(404).json({
                status: "fail",
                message: "The document id is invalid"
            });
        }
        else
        {
            const document = await Document.findById(params.id).select('-__v');
            if(!document)
            {
                res.status(404).json({
                    status: "fail",
                    message : "Could not select the document"
                });
            }
            else
            {
                // Get user
                const user = await User.findById(document.uploader).select('-password').select('-__v');
                const data = {user: user, document:document}
                res.render('readOneDocument', {data});
                res.status(200);
            }
        }
    }
    catch(err)
    {
        res.status(404).json({
            status: "error",
            error:err,
            message: "Something went wrong in getting the document"
        });
    }
}

exports.getDocuments = async(req,res) =>{
    try
    {
        const documents = await Document.find().select('-__v');
        res.status(200).json({
            status: "success",
            message: "Documents are selected successfully",
            length: documents.length,
            data: documents
        });
    }
    catch(err)
    {
        res.status(404).json({
            status: "error",
            message: "Selecting documents has failed",
            error: err
        });
    }
}
