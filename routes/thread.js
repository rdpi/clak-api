const express = require('express');
const threadController = require('../controllers/threadController');
const threadValidator = require('../validators/threadValidator');

const router = express.Router();

// THREAD ROUTERS //

/* GET threads for board */
router.get('/:boardid', threadController.getThreads);

/* POST(create) a new thread */
router.post('/:boardid', threadValidator.validate('createThread'), threadController.createThread);

module.exports = router;
