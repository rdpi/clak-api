var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BoardSchema = new Schema(
	{
		uri: {type: String, unique: true, min: 1, max: 30, required: true},
		title: {type: String, min: 1, max: 40, required: true}
	}
);

module.exports = mongoose.model('Board', BoardSchema);

