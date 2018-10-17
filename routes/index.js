var express = require('express');
var router = express.Router();
var thread_controller = require('../controllers/threadController');
var board_controller = require('../controllers/boardController');
var index_controller = require('../controllers/indexController');
var upload_controller = require('../controllers/uploadController');

/* GET home page. */
router.get('/', index_controller.get_boards);

/* Create new board */
router.post('/', index_controller.create_board);

//handle requests to upload files
router.post('/upload', upload_controller.upload_file);

//THREAD ROUTERS //

//GET request for thread
router.get('/:boardid/thread/:threadid', thread_controller.thread_detail);

//POST request for thread
router.post('/:boardid/thread/:threadid', thread_controller.reply_create_post);

//BOARD ROUTERS //

//GET request for thread
router.get('/:boardid', board_controller.get_threads);

//POST request for thread
router.post('/:boardid', board_controller.create_thread);



module.exports = router;


