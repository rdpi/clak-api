const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var Board = require('../models/board'); 
var Thread = require('../models/thread');
var Reply = require('../models/reply');
var mongoose = require('mongoose');
var async = require('async');
var moment = require('moment');

exports.get_boards = function(req, res, next) {
	Board.find()
		.exec( function(err, board_list) {
			if (err){ return next(err);}
			//send list of boards
			res.json({boards: board_list});
		});
};
exports.create_board = [
	//validate
	body('name').isLength({ min: 1 }).trim().withMessage('No text entered'),
	body('title').isLength({ min: 1 }).trim().withMessage('No text entered'),
	
	//sanatize
	sanitizeBody('name').trim().escape(),
	sanitizeBody('title').trim().escape(),

	//process next request
	(req, res, next) => {

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.render('index', {title: 'REEE', errors: errors.array()});
		}
		else{
			//Data is valid
			
			//Create new reply object with sanatized data
			var board = new Board(
				{
					name: req.body.name,
					title: req.body.title
				});
			board.save(function (err) {
				if (err) {return next(err); }
				res.redirect('/')
			});
		}
	}
];

