const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var Board = require('../models/board'); 

//Get a list of boards
exports.get_boards = function(req, res, next) {
	Board.find()
		.exec( function(err, board_list) {
			if (err){ return next(err);}
			//send list of boards
			res.json({boards: board_list});
		});
};

//Create a new board
exports.create_board = [

	//validate
	body('uri').isLength({ min: 1 }).trim().withMessage('No text entered'),
	body('uri').isLength({ max: 30 }).trim().withMessage('Too many characters'),
	body('uri').isAlphanumeric().trim().withMessage('Invalid Characters'),
	body('uri').isLowercase().trim().withMessage('URI must be lowercase'),
	body('title').isLength({ min: 1 }).trim().withMessage('No text entered'),
	body('title').isLength({ max: 40 }).trim().withMessage('Too many characters'),
	
	//sanatize
	sanitizeBody('uri').trim().escape(),
	sanitizeBody('title').trim().escape(),

	//process next request
	(req, res, next) => {

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			console.log(JSON.stringify(errors));
		}
		else{
			//Data is valid
			
			//Create new reply object with sanatized data
			const board = new Board(
				{
					uri: req.body.uri,
					title: req.body.title
				});
			board.save(function (err) {
				if (err) {return next(err); }
				res.sendStatus(201);
			});
		}
	}
];

