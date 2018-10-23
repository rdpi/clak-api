const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BoardSchema = new Schema(
  {
    uri: {
      type: String, unique: true, min: 1, max: 30, required: true,
    },
    title: {
      type: String, min: 1, max: 40, required: true,
    },
  },
);

module.exports = mongoose.model('Board', BoardSchema);
