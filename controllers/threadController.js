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

	Thread.findOne({_id: req.params.threadid}).exec( (err, thread) => {
		if (err){return next(err)}
		if (thread == null){
			const err = new Error('Thread not found');
			err.status = 404;
			return next(err);
		}
		Reply.find({'thread': req.params.threadid}).exec((err, replies) => {
			res.json({thread: thread, replies: replies})
		})
	})
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

			//object to store file data
			let filedata = {
				file_id: null,
				filename: null,
				filesize: null,
				width: null,
				height: null,
				ext: null
			}
			if (Object.keys(req.files).length !== 0){
				const values = Object.values(req.files);
  				const promises = values.map(image => cloudinary.uploader.upload(image.path,
    			function(error, result) {console.log(result, error)}));
				console.log(req.files.file.originalFilename);
  				let results = await Promise.all(promises);

    			filedata.file_id = (results[0].public_id);
				filedata.filename = (req.files.file.originalFilename);
				filedata.filesize = (results[0].bytes);
				filedata.width = (results[0].width);
				filedata.height = (results[0].height);
				filedata.ext = (results[0].format);
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
					file_id: filedata.file_id,
					filename: filedata.filename,
					filesize: filedata.filesize,
					width: filedata.width,
					height: filedata.height,
					ext: filedata.ext

				});
			reply.save(function (err, replyid) {
				if (err) {return next(err); }
				//update reply count and bump level
				Reply.countDocuments({thread: req.params.threadid}, function(err, count){
					if (err) { return next(err)}
					//don't bump the thread 
					if(count < 10){
						Reply.findById(replyid, 'date').then(newReply => 
						Thread.findByIdAndUpdate(req.params.threadid, {replies: count, bump: newReply.date}))
						.then(result => console.log(result));
					}
					else{
						Thread.findByIdAndUpdate(req.params.threadid, {replies: count})
						.then(result => console.log(result));
					}
				});
			});

		}

	}
];


