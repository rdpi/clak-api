const express = require('express');

const router = express.Router();
const threadController = require('../controllers/threadController');
const boardController = require('../controllers/boardController');
const indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/api/boards', indexController.get_boards);

/* Create new board */
router.post('/api/boards', indexController.create_board);

// THREAD ROUTERS //

// GET request for thread
router.get('/api/:boardid/thread/:threadid', threadController.thread_detail);

// POST request for thread
router.post('/api/:boardid/thread/:threadid', threadController.reply_create_post);

// BOARD ROUTERS //

// GET request for thread
router.get('/api/:boardid', boardController.get_threads);

// POST request for thread
router.post('/api/:boardid', boardController.create_thread);

module.exports = router;
