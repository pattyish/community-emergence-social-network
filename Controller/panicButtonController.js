const panicButtonService = require('../Services/PanicButtonService');

class PanicButtonController {
    sendHelpRequest = async (req, res) => {
        const response = await panicButtonService.sendHelpRequest(req.body);
        res.status(response.code).json(response.body);
    }

    checkIsPanicButtonResponder = async (req, res) => {
        const response = await panicButtonService.checkIsPanicButtonResponder(req.body.userId, req.body.lat, req.body.lng);
        res.status(response.code).json(response.body);
    }

    acceptRequest = async (req, res) => {
        const response = await panicButtonService.acceptRequest(req.body.userId, req.body.responderId);
        res.status(response.code).json(response.body);
    }

    updateVolunteerSettings = async (req, res) => {
        const response = await panicButtonService.updateVolunteerSettings(req.body.userId, req.body.isPanicButtonResponder, req.body.lat, req.body.lng);
        res.status(response.code).json(response.body);
    }

    getSettings = async (req, res) => {
        const response = await panicButtonService.getSettings(req.body.userId);
        res.status(response.code).json(response.body);
    }
}

module.exports = new PanicButtonController();