const express = require('express');

const router = express.Router();
// const replyController = require('../controllers/replyController');
// const threadController = require('../controllers/boardController');
const boardController = require('../controllers/boardController');

/* GET home page. */
router.get('/boards', boardController.get_boards);

/* Create new board */
router.post('/boards', boardController.create_board);

// THREAD ROUTERS //

// GET request for thread
// router.get('/api/:boardid/thread/:threadid', replyController.thread_detail);

// POST request for thread
// router.post('/api/:boardid/thread/:threadid', replyController.reply_create_post);

// BOARD ROUTERS //

// GET request for thread
// router.get('/api/:boardid', threadController.get_threads);

// POST request for thread
// router.post('/api/:boardid', threadController.create_thread);


module.exports = router;
