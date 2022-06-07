const express = require('express');
const user = require('../Controller/userController');

const router= express.Router();

router.route('/register').post(user.register);

router.route('/login').post(user.login);

router.route('/').get(user.getAllUser)

router.route('/updateProfile').get(user.getAllUserProfiles)

router.route('/:id').get(user.findUserId).patch(user.updateUserProfile).delete(user.deleteUser);

router.route('/update/:id').get(user.findUserToUpdate);

module.exports = router;