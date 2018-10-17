var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

const ReplySchema = new Schema(
	{
		name: {type: String, default: "Anonymous"},
		body: {type: String, required: true},
		date: {type: Date, default: Date.now, required: true},
		media: {type: String},
		sage: {type: Boolean, default: false}
	}
);

module.exports = mongoose.model('Reply', ReplySchema);
