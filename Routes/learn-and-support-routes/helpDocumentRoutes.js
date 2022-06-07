const express = require('express')
const controller = require('../../Controller/learn-and-support-controllers/helpDocumentController');

const router = express.Router();


router.route('/').get(controller.getDocuments).post(controller.saveDocument);

router.route('/:id').get(controller.getOneDocument);

router.route('/accept').patch(controller.saveDocumentChanges);

module.exports = router;