var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var ReplySchema = new Schema(
	{
		thread: {type: Schema.ObjectId, ref: 'Thread', required: true},
		name: {type: String, default: "Anonymous"},
		body: {type: String, required: true},
		date: {type: Date, default: Date.now, required: true},
		media: {type: String},
		sage: {type: Boolean, default: false}
	}
);

module.exports = mongoose.model('Reply', ReplySchema);
