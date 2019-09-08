const { validationResult } = require('express-validator/check');
const { Board } = require('../models');

// Get a list of boards
exports.get_boards = (req, res) => {
  Board.findAll().then(boards => res.json(boards));
};

// Create a new board
exports.createBoard = (req, res, next) => {
  const validerr = validationResult(req);
  if (!validerr.isEmpty()) {
    const err = new Error();
    err.status = 400;
    err.message = 'Validation Failed';
    err.validationErrors = validerr.array();
    return next(err);
  }
  let { body: { uri } } = req;
  const { body: { title } } = req;
  uri = uri.toLowerCase();
  Board.findOrCreate({ where: { uri }, defaults: { title } }).then(([board, created]) => {
    let response = {};
    if (created) {
      response = { status: '201', board };
    } else {
      const err = new Error();
      err.status = 409;
      err.message = `Board with URI ${uri} alredy exists`;
      return next(err);
    }
    return res.json(response);
  });
};
