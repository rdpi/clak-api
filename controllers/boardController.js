const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const { Board } = require('../models');

// Get a list of boards
exports.get_boards = (req, res) => {
  Board.findAll().then(boards => res.json(boards));
};

// Create a new board
exports.create_board = (req, res) => {
  Board.findOrCreate({where: {uri: req.body.uri } }).then(([board, created]) => {
    let response = {};
    if (created) {
      response = { status: '201', board }
    } else {
      response = { status: '409', error: true, message: `Board with URI '${req.body.uri}' already exists`}
    }
    return res.json(response);
  });
};
