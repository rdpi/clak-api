const mongoose = require('mongoose');
const Thread = require('./thread');

const Schema = mongoose.Schema;

const ReplySchema = new Schema(
  {
    thread: { type: Schema.ObjectId, ref: 'Thread', required: true },
    name: { type: String, default: 'Anonymous' },
    body: { type: String, required: true },
    date: { type: Date, default: Date.now, required: true },
    file_id: { type: String },
    filename: { type: String },
    filesize: { type: Number },
    width: { type: Number },
    height: { type: Number },
    ext: { type: String },
  },
);

module.exports = mongoose.model('Reply', ReplySchema);
