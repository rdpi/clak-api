var mongoose = require('mongoose');
var Thread = require('./thread');

var Schema = mongoose.Schema;

var BoardSchema = new Schema(
	{
		name: {type: String, unique: true, required: true},
		title: {type: String, required: true},
		threads: [Thread.schema]
	}
);

BoardSchema
.virtual('url')
.get(function () {
	return '/' + this._id +'/';
});

module.exports = mongoose.model('Board', BoardSchema);

