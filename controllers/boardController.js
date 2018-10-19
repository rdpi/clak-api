const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

require('dotenv').config();
var Board = require('../models/board'); 
var Thread = require('../models/thread');
var Reply = require('../models/reply');
var mongoose = require('mongoose');
var async = require('async');
var moment = require('moment');
const cloudinary = require('cloudinary');

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET
});

exports.get_threads = function(req, res, next) {

	async.parallel({
		board: function(callback){
			Board.findById(req.params.boardid)
			.exec(callback)
		},
		threads: function(callback){
			Thread.find({ 'board': req.params.boardid })
			.exec(callback)
		},
	}, function(err, results) {
		if (err) {return next(err); } //Error in API usage
		if (results.board==null) {
			var err = new Error('Board not found');
			err.status = 404;
			return next(err);
		}
		res.json({board: results.board, threads: results.threads});
	});
};


exports.create_thread = [
	//validate
	body('body').isLength({ max: 2000 }).trim().withMessage('Field too long'),
	body('name').isLength({ max: 30 }).trim().withMessage('Field too long'),
	body('subject').isLength({ max: 100 }).trim().withMessage('Field too long'),
	
	//sanatize
	sanitizeBody('name').trim().escape(),
	sanitizeBody('subject').trim().escape(),
	sanitizeBody('body').trim().escape(),

	//process next request
	async (req, res, next) => {

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.send({errors: errors.array()});
		}
		else{
			//Data is valid
			let mediaURL = null;
			console.log(req.files);
			if (Object.keys(req.files).length !== 0){
				const values = Object.values(req.files);
  				const promises = values.map(image => cloudinary.uploader.upload(image.path,
    			function(error, result) {console.log(result, error)}));

  				let results = await Promise.all(promises);
    			mediaURL = (results[0].public_id);
			}
			else{
				var err = new Error('No file selected');
				err.status = 501;
				return next(err);
			}
			//Create new reply object with sanatized data
			var thread = new Thread(
				{
					board: req.params.boardid,
					name: req.body.name === "" ? "Anonymous" : req.body.name,
					subject: req.body.subject,
					body: req.body.body,
					media: mediaURL,
				});
			thread.save(function (err, threadid) {
				if (err) {return next(err); console.log(err);}
				//prune last thread
				Thread.countDocuments({board: req.params.boardid}, function(err, count){
					if (err) {return next(err)}
					console.log(count);
					if (count > 10){
						console.log("Over thread limit")
						Thread.findOneAndDelete({ "board": req.params.boardid}, {sort: {"bump": 1}}).exec()
					}
				});
			});
		}
	}
];
