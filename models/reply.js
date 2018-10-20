var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var ReplySchema = new Schema(
	{
		thread: {type: Schema.ObjectId, ref: 'Thread', required: true},
		name: {type: String, default: "Anonymous"},
		body: {type: String, required: true},
		date: {type: Date, default: Date.now, required: true},
		file_id: {type: String},
		filename: {type: String},
		filesize: {type: Number},
		width: {type: Number},
		height: {type: Number},
		ext: {type: String}
	}
);

module.exports = mongoose.model('Reply', ReplySchema);
