var express = require('express');
var router = express.Router();

var thread_controller = require('../controllers/threadController');

//THREAD ROUTERS //

//GET request for thread
router.get('/:id', thread_controller.thread_detail);

//POST request for thread
router.post('/:id', thread_controller.reply_create_post);

module.exports = router;
