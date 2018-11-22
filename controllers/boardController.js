require('dotenv').config();
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const cloudinary = require('cloudinary');

const Board = require('../models/board');
const Thread = require('../models/thread');

// number of threads allowed on board
const THREAD_LIMIT = 100;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.get_threads = (req, res, next) => {
  Board.findOne({ uri: req.params.boardid }).exec((err, board) => {
    if (err) { return next(err); }
    if (board == null) {
      const err = new Error();
      err.status = 404;
      err.message = 'Board not found';
      return next(err);
    }
    Thread.find({ 'board': board._id }).exec((err, threads) => {
      if (err) { return next(err); }
      return res.json({ board, threads });
    });
    return board;
  });
};


exports.create_thread = [
  // validate
  body('body').isLength({ max: 2000 }).trim().withMessage('Field too long'),
  body('name').isLength({ max: 30 }).trim().withMessage('Field too long'),
  body('subject').isLength({ max: 100 }).trim().withMessage('Field too long'),

  // sanatize
  sanitizeBody('name').trim(),
  sanitizeBody('subject').trim(),
  sanitizeBody('body').trim(),

  // process next request
  async (req, res, next) => {

    // make sure the request is valid
    const board = await Board.findOne({ 'uri': req.params.boardid });
    if (board == null) {
      const err = new Error();
      err.status = 404;
      err.message = 'Board not found';
      return next(err);
    }

    // check validator for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send({ errors: errors.array() });
    } else {
      // Data is valid

      // object to store file data
      const filedata = {
        file_id: null,
        filename: null,
        filesize: null,
        width: null,
        height: null,
        ext: null,
      };
      if (Object.keys(req.files).length !== 0) {
        const values = Object.values(req.files);
        const promises = values.map(image => cloudinary.uploader.upload(image.path);
        const results = await Promise.all(promises);

        filedata.file_id = (results[0].public_id);
        filedata.filename = (req.files.file.originalFilename);
        filedata.filesize = (results[0].bytes);
        filedata.width = (results[0].width);
        filedata.height = (results[0].height);
        filedata.ext = (results[0].format);
      } else {
        const err = new Error('No file selected');
        err.status = 501;
        return next(err);
      }
      // Create new thread object with sanatized data
      const thread = new Thread(
        {
          board: board._id,
          name: req.body.name === '' ? 'Anonymous' : req.body.name,
          subject: req.body.subject,
          body: req.body.body,
          file_id: filedata.file_id,
          filename: filedata.filename,
          filesize: filedata.filesize,
          width: filedata.width,
          height: filedata.height,
          ext: filedata.ext,
        },
      );
      thread.save((err, newThread) => {
        if (err) { return next(err); }
        res.send({ status: '201', thread: newThread._id });
        // prune last thread
        return Thread.countDocuments({ board: board._id }, (err, count) => {
          if (err) { return next(err); }
          if (count > THREAD_LIMIT) {
            Thread.findOneAndDelete({ 'board': board._id }, { sort: { 'bump': 1 } }).exec();
          }
          return count;
        });
      });
    }
  },
];
