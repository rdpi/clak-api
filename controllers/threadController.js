require('dotenv').config();

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const cloudinary = require('cloudinary');
const mongoose = require('mongoose');

const Thread = require('../models/thread');
const Reply = require('../models/reply');

const REPLY_LIMIT = 300;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.thread_detail = (req, res, next) => {
  Thread.findOne({ _id: req.params.threadid }).exec((err, thread) => {
    if (err) { return next(err); }
    if (thread == null) {
      const err = new Error('Thread not found');
      err.status = 404;
      return next(err);
    }
    Reply.find({ 'thread': req.params.threadid }).exec((err, replies) => res.json({ thread, replies }));
    return thread;
  });
};

exports.reply_create_post = [

  // validate

  body('body').isLength({ max: 2000 }).trim().withMessage('Field too long'),
  body('name').isLength({ max: 30 }).trim().withMessage('Field too long'),

  // sanatize
  sanitizeBody('name').trim().escape(),
  sanitizeBody('body').trim().escape(),

  // process next request
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
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
        const promises = values.map(image => cloudinary.uploader.upload(image.path,
          (error, result) => { console.log(result, error); }));
        console.log(req.files.file.originalFilename);
        const results = await Promise.all(promises);

        filedata.file_id = (results[0].public_id);
        filedata.filename = (req.files.file.originalFilename);
        filedata.filesize = (results[0].bytes);
        filedata.width = (results[0].width);
        filedata.height = (results[0].height);
        filedata.ext = (results[0].format);
      } else if (req.body.length === 0) {
        const err = new Error('No text entered');
        err.status = 501;
        return next(err);
      }
      // Create new reply object with sanatized data
      const reply = new Reply(
        {
          thread: mongoose.Types.ObjectId(req.params.threadid),
          name: req.body.name === '' ? 'Anonymous' : req.body.name,
          body: req.body.body,
          file_id: filedata.file_id,
          filename: filedata.filename,
          filesize: filedata.filesize,
          width: filedata.width,
          height: filedata.height,
          ext: filedata.ext,

        },
      );
      reply.save((err, replyid) => {
        if (err) { return next(err); }

        // update reply count
        return Thread.findByIdAndUpdate(req.params.threadid, { $inc: { replies: 1 } })
          .exec((err, thread) => {
            if (err) { return next(err); }
            // don't bump the thread if we're over the reply limit
            if (thread.replies < REPLY_LIMIT) {
              Reply.findById(replyid, 'date').then(newReply => Thread.findByIdAndUpdate(req.params.threadid, { bump: newReply.date }));
            }
            return res.sendStatus(201);
          });
      });
    }
    return next();
  },
];
