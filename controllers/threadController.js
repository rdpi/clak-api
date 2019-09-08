require('dotenv').config();
const { validationResult } = require('express-validator/check');
const cloudinary = require('cloudinary');
const { Board, Thread } = require('../models');

// number of threads allowed on board
const THREAD_LIMIT = 100;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.getThreads = (req, res, next) => {
  Board.findOne({ where: { uri: req.params.boardid } }).then((board) => {
    if (board === null) {
      const err = new Error();
      err.status = 404;
      err.message = 'Board not found';
      return next(err);
    }
    Thread.findAll({ where: { boardId: board.id } }).then(threads => res.json({ threads, board }));
  });
};

exports.createThread = (req, res, next) => {
  const validerr = validationResult(req);
  if (!validerr.isEmpty()) {
    const err = new Error();
    err.status = 400;
    err.message = 'Validation Failed';
    err.validationErrors = validerr.array();
    return next(err);
  }

  Board.findOne({ where: { uri: req.params.boardid } }).then(async (board) => {
    if (board === null) {
      const err = new Error();
      err.status = 404;
      err.message = 'Board not found';
      return next(err);
    }

    const boardId = board.id;
    const postId = board.posts + 1;
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
    } else {
      const err = new Error('No file selected');
      err.status = 501;
      return next(err);
    }

    // check if we need to make room and archive a thread
    Thread.findAndCountAll({ where: { boardId, archived: 0 } }).then((c) => {  
      Board.increment('posts', { where: { id: boardId } });
      if (c >= THREAD_LIMIT) {
        Thread.findOne({
          where: {
            boardId, archived: 0, order: ['bump', 'DESC'],
          },
        }).then((thread) => {
          Thread.update({ archived: 1 }, { where: { id: thread.id } }).then(() => {
            Thread.create({
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
              bump: new Date().toISOString().slice(0, 19).replace('T', ' '),
              postId,
            }).then(thread => res.json({ status: 201, thread, board }));
          });
        });
      } else {
        Thread.create({
          boardId: board.id,
          name: req.body.name === '' ? 'Anonymous' : req.body.name,
          subject: req.body.subject,
          body: req.body.body,
          file_id: filedata.file_id,
          filename: filedata.filename,
          filesize: filedata.filesize,
          width: filedata.width,
          height: filedata.height,
          ext: filedata.ext,
          postId,
          bump: new Date().toISOString().slice(0, 19).replace('T', ' '),
        }).then(thread => res.json({ status: 201, thread, board }));
      }
    });
  });
};
