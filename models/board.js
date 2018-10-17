var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BoardSchema = new Schema(
	{
		name: {type: String, unique: true, required: true},
		title: {type: String, required: true}
	}
);

BoardSchema
.virtual('url')
.get(function () {
	return '/' + this._id +'/';
});

BoardSchema
.virtual('label')
.get(function () {
	return '/'+this.name+'/ - '+this.title;
});

module.exports = mongoose.model('Board', BoardSchema);

