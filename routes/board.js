const express = require('express');
const boardController = require('../controllers/boardController');
const boardValidator = require('../validators/boardValidator');

const router = express.Router();

/* GET boards */
router.get('/', boardController.get_boards);

/* POST(create) new board */
router.post('/', boardValidator.validate('createBoard'), boardController.createBoard);

module.exports = router;
