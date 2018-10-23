const mongoose = require('mongoose');
const Board = require('./board');

const Schema = mongoose.Schema;

const ThreadSchema = new Schema(
  {
    board: { type: Schema.ObjectId, ref: 'Board', required: true },
    name: {
      type: String, default: 'Anonymous', required: true, max: 30,
    },
    subject: { type: String, max: 100 },
    body: { type: String, max: 2000 },
    date: { type: Date, default: Date.now, required: true },
    file_id: { type: String, required: true },
    filename: { type: String },
    filesize: { type: Number },
    width: { type: Number },
    height: { type: Number },
    ext: { type: String },
    replies: { type: Number, default: 0, required: true },
    images: { type: Number, default: 0, required: true },
    bump: { type: Date, default: Date.now },
    unique_ips: { type: Number, default: 1 },
  },
);

module.exports = mongoose.model('Thread', ThreadSchema);
