const express = require('express');
const userStatus = require('../Controller/userStatusController'); // user status controller

const router= express.Router();

// Status routes
router.route('/').get(userStatus.getStatus).post(userStatus.saveStatus);
router.route('/user').post(userStatus.saveUserStatus);
router.route('/:id').get(userStatus.getUserStatus);

module.exports = router;