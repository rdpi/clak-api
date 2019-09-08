require('dotenv').config();

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const cloudinary = require('cloudinary');

const { Board, Thread, Reply } = require('../models');

const REPLY_LIMIT = 300;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


exports.getReplies = (req, res, next) => {
  Board.findOne({ where: { uri: req.params.boardid } }).then((board) => {
    if (board === null) {
      const err = new Error();
      err.status = 404;
      err.message = 'Board not found';
      return next(err);
    }
    Thread.findOne({ where: { boardId: board.id, postId: req.params.threadid } }).then((thread) => {
      if (thread === null) {
        const err = new Error();
        err.status = 404;
        err.message = 'Thread not found';
        return next(err);
      }
      Reply.findAll({ where: { threadId: thread.id } })
        .then(replies => res.json({ thread, replies }));
    });
  });
};

exports.createReply = (req, res, next) => {
  const validerr = validationResult(req);
  if (!validerr.isEmpty()) {
    const err = new Error();
    err.status = 400;
    err.message = 'Validation Failed';
    err.validationErrors = validerr.array();
    return next(err);
  }

  Board.findOne({ where: { uri: req.params.boardid } }).then((board) => {
    if (board === null) {
      const err = new Error();
      err.status = 404;
      err.message = 'Board not found';
      return next(err);
    }
    Thread.findOne({ where: { boardId: board.id, postId: req.params.threadid } })
      .then(async (thread) => {
        if (thread === null) {
          const err = new Error();
          err.status = 404;
          err.message = 'Thread not found';
          return next(err);
        }

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
          const promises = values.map(image => cloudinary.uploader.upload(image.path));
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

        Reply.count({ where: { threadId: thread.id } }).then((c) => {
          if (c < REPLY_LIMIT) {
          // bump the thread
            Thread.update( { bump: new Date().toISOString().slice(0, 19).replace('T', ' ') }, { where: { id: thread.id } });
          }
          const postId = board.posts + 1;
          Board.increment('posts', { where: { id: board.id } });
          Thread.increment('replies', { where: { id: thread.id } });
          if (filedata.file_id) {
            Thread.increment('images', { where: { id: thread.id } });
          }
          Reply.create({
            thread: '',
            name: req.body.name === '' ? 'Anonymous' : req.body.name,
            body: req.body.body,
            file_id: filedata.file_id,
            filename: filedata.filename,
            filesize: filedata.filesize,
            width: filedata.width,
            height: filedata.height,
            ext: filedata.ext,
            postId,
            threadId: thread.id,
          }).then(reply => res.json({ status: 201, reply }));
        });
      });
  });
};
