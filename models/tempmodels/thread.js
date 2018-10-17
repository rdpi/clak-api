const mongoose = require('mongoose');
const moment = require('moment');
const Reply = require('./reply');

const Schema = mongoose.Schema;

const ThreadSchema = new Schema(
	{
		name: {type: String, default: "Anonymous", required: true, max: 30},
		subject: {type: String, max: 350},
		body: {type: String, max: 2000},
		date: {type: Date, default: Date.now},
		media: {type: String, required: true},
		replies: [Reply.schema]
	}
);

ThreadSchema
.virtual('url')
.get(function () {
	return '/' + this.board + '/thread/' + this._id;
});

module.exports = mongoose.model('Thread', ThreadSchema);

