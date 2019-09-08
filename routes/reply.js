const express = require('express');
const replyValidator = require('../validators/replyValidator');

const router = express.Router();


// Controllers //
const replyController = require('../controllers/replyController');

// REPLY ROUTERS //

// GET request for thread
router.get('/:boardid/thread/:threadid', replyController.getReplies);

// POST request for thread
router.post('/:boardid/thread/:threadid', replyValidator.validate('createReply'), replyController.createReply);

module.exports = router;
