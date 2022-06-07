const express = require('express')
const {getAllAnnouncement,createAnnouncement, updateAnnouncement, deleteAnnouncement} = require('../Controller/announcementController');

const router = express.Router();

router.get('/', getAllAnnouncement);
//router.post('/',createAnnouncement);
router.route('/').post(createAnnouncement);

router.delete('/:id', deleteAnnouncement);
router.patch('/:id', updateAnnouncement);

module.exports = router;