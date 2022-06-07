const express = require('express');
const panicButtonController = require('../Controller/panicButtonController');

const router = express.Router();

router.route('/send-request').post(panicButtonController.sendHelpRequest);
router.route('/check-responder').post(panicButtonController.checkIsPanicButtonResponder);
router.route('/accept-request').post(panicButtonController.acceptRequest);
router.route('/update-volunteer-settings').post(panicButtonController.updateVolunteerSettings);
router.route('/get-settings').post(panicButtonController.getSettings);
module.exports = router;