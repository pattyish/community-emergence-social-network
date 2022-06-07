const Announcement = require('../Models/announcement');
const User = require('../Models/user');


exports.createAnnouncement = async (req, res) => {
    //retrieving the sender information using the ID
    try {
        let senderId = req.body.sender;

        let senderInfo = await User.findById(senderId)
            .select("-__v")
            .select("-password");
        if (!senderInfo) {
            return res.status(404).json({
                status: "Failed",
                message: "Sender is not valid",
            });
        }
        //creating the announcement object to be saved in the database model
        const myAnnouncement = {
            content: req.body.content,
            sender: senderInfo,
            date: req.body.date,
        }
        const saveAnnouncement = await Announcement.create(myAnnouncement); // Saving the announcement

        res.status(200).json({
            status: "OK",
            message: "Announcement created successfully",
            announcement: saveAnnouncement,
        });

        require("../index").emit("newAnnouncement", saveAnnouncement);

    } catch (err) {
        return res.status(404).json({
            status: "Failed",
            message: "Announcement not saved",
            error: err,
        });
    }

}

exports.getAllAnnouncement = async (req, res) => {
    try {
        /*
            This function retrieves all announcements from the database
        */
        const announcements = await Announcement.find().select("-__v");
        if (announcements) {
            res.status(200).json({
                status: "success",
                message: "Announcements retrieved",
                data: announcements,
            });
        }
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: "Announcements could not be retrieved",
            error: err,
        });
    }
}

exports.updateAnnouncement = async (req, res) => {

}

exports.deleteAnnouncement = async (req, res) => {
    try {
        let announcement = await Announcement.findById(req.params.id)
        if (!announcement) {
            return res.status(404).json({
                status: "Failed",
                message: "Announcement is not found",
            });
        }
        const deleteAnnouncement = await Announcement.deleteOne({ _id: announcement._id })
        if (deleteAnnouncement) {
            res.status(200).json({
                status: "success",
                message: "Announcement deleted succesfully",
            });
        }
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: "Announcements was not deleted",
            error: err,
        });
    }
}

