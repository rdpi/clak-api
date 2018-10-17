const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

require('dotenv').config();
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
})

exports.thread_detail = function(req, res, next) {

	async.parallel({
		thread: function(callback){
			Thread.findById(req.params.threadid)
			.exec(callback)
		},
		replies: function(callback){
			Reply.find({ 'thread': req.params.threadid}, 'name body date media')
			.exec(callback)
		},
	}, function(err, results) {
		if (err) {return next(err); } //Error in API usage
		if (results.thread==null) {
			var err = new Error('Thread not found');
			err.status = 404;
			return next(err);
		}
		//send thread info, and array of replies
		res.json({thread: results.thread, replies: results.replies });
	});
};

exports.reply_create_post = [

	//validate
	
	body('body').isLength({ max: 2000 }).trim().withMessage('Field too long'),
	body('name').isLength({max: 30}).trim().withMessage('Field too long'),
	
	//sanatize
	sanitizeBody('name').trim().escape(),
	sanitizeBody('body').trim().escape(),

	//process next request
	async (req, res, next) => {

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			console.log(errors);
		}
		else{
			//Data is valid
			//is there a file?
			let mediaURL = null;
			console.log(req.files);
			if (Object.keys(req.files).length !== 0){
				const values = Object.values(req.files);
  				const promises = values.map(image => cloudinary.uploader.upload(image.path,
    			function(error, result) {console.log(result, error)}));

  				let results = await Promise.all(promises);
    			mediaURL = (results[0].public_id);
			}

			//post must have at least an image or a message
			else if(req.body.length === 0){
				var err = new Error('No text entered');
				err.status = 501;
				return next(err);
			}
			//Create new reply object with sanatized data
			var reply = new Reply(
				{
					thread: mongoose.Types.ObjectId(req.params.threadid),
					name: req.body.name === "" ? "Anonymous" : req.body.name,
					body: req.body.body,
					media: mediaURL,
					sage: req.body.sage
				});
			reply.save(function (err, replyid) {
				if (err) {return next(err); }
				//update reply count and bump level
				Reply.countDocuments({thread: req.params.threadid}, function(err, count){
					if (err) { return next(err)}
					Reply.findById(replyid, 'date').then(newReply => 
					Thread.findByIdAndUpdate(req.params.threadid, {replies: count, bump: newReply.date}))
					.then(result => console.log(result));
				});
			});

		}

	}
];


