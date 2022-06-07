const notificationService = require('./NotificationService');
const emailService = require('./EmailService');
const User = require('../Models/user');

class PanicButtonService {
    async sendHelpRequest(data) {
        let user = (await User.findById(data.userId)).toObject();
        data.username = user.username;
        notificationService.sendPanicButtonHelpRequest(data);
        let users = await User.find({'isPanicButtonResponder':true});
        if (users) {
            users.forEach(function(record){
                if (record.email && record.email!=='' && record._id!==data.userId){
                    emailService.sendmail(record.email, 'ESN User needs first aid', `Please help a fellow ESN citizen in need of first aid. Their location is at: https://maps.google.com/?q=${data.lat},${data.lng}`);
                }
            });
        }
        return {code:200, body:data};
    }

    async checkIsPanicButtonResponder(userId, lat, lng) {
        let user = await User.findById(userId)
            .select("-__v")
            .select("-password");
        if (!user) {
            return {code:400, body: {success: false, msg:'User not found'}}
        } else {
            if (user.isPanicButtonResponder && this.calcDist(lat, lng, user.lat, user.lng)<10) {
                return {code:200, body: {success: true, msg:'User is allowed to respond to panic requests'}}
            } else {
                return {code:200, body: {success: false, msg:'User is not allowed to respond to panic requests'}}
            }

        }
    }

    async acceptRequest(userId, responderId) {
        let user = (await User.findById(responderId)).toObject();
        const data = {
            userId: userId,
            responderId: responderId,
            responderUsername: user.username,
        };
        notificationService.sendMessage("panicRequestAccepted", data);
        return {code:200, body:data};
    }

    async updateVolunteerSettings(userId, isPanicButtonResponder, lat, lng) {
        let user = await User.findById(userId);
        user.isPanicButtonResponder = isPanicButtonResponder;
        user.lat = lat;
        user.lng = lng;
        user.save();
        const data = {
            success: true,
            msg: "Updated user volunteer setting successfully",
        };
        return {code:200, body:data};
    }

    async getSettings(userId) {
        let user = await User.findById(userId);
        const data = {
            success: true,
            isPanicButtonResponder: user.isPanicButtonResponder,
        };
        return {code:200, body:data};
    }

    calcDist(lat1, lon1, lat2, lon2) {
        Number.prototype.toRad = function() {
            return this * Math.PI / 180;
        }

        var R = 6371; // km
        var x1 = lat2-lat1;
        var dLat = x1.toRad();
        var x2 = lon2-lon1;
        var dLon = x2.toRad();
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    }
}

module.exports = new PanicButtonService();