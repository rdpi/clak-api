const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const Board = require('../models/board');

// Get a list of boards
exports.get_boards = (req, res, next) => {
  Board.find()
    .exec((err, boardList) => {
      if (err) { return next(err); }
      // send list of boards
      return res.json({ boards: boardList });
    });
};

// Create a new board
exports.create_board = [

  // validate
  body('uri').isLength({ min: 1 }).trim().withMessage('No text entered'),
  body('uri').isLength({ max: 30 }).trim().withMessage('Too many characters'),
  body('uri').isAlphanumeric().trim().withMessage('Invalid Characters'),
  body('uri').isLowercase().trim().withMessage('URI must be lowercase'),
  body('title').isLength({ min: 1 }).trim().withMessage('No text entered'),
  body('title').isLength({ max: 40 }).trim().withMessage('Too many characters'),

  // sanatize
  sanitizeBody('uri').trim(),
  sanitizeBody('title').trim(),

  // process next request
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(JSON.stringify(errors));
    } else {
      // Data is valid

      // create new board
      const board = new Board(
        {
          uri: req.body.uri,
          title: req.body.title,
        },
      );
      board.save((err, newBoard) => {
        if (err) { return next(err); }
        return res.send({ status: '201', board: newBoard.uri });
      });
    }
  },
];
