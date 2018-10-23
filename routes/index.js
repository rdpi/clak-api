const express = require('express');

const router = express.Router();
const threadController = require('../controllers/threadController');
const boardController = require('../controllers/boardController');
const indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', indexController.get_boards);

/* Create new board */
router.post('/', indexController.create_board);

// THREAD ROUTERS //

// GET request for thread
router.get('/:boardid/thread/:threadid', threadController.thread_detail);

// POST request for thread
router.post('/:boardid/thread/:threadid', threadController.reply_create_post);

// BOARD ROUTERS //

// GET request for thread
router.get('/:boardid', boardController.get_threads);

// POST request for thread
router.post('/:boardid', boardController.create_thread);

module.exports = router;
