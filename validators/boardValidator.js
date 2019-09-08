const { check } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

/* Validation/Sanitization */
exports.validate = (method) => {
  switch (method) {
    case 'createBoard': {
      return [
        // Validate
        check('uri', 'URI must be between 1 and 30 characters').isLength({ min: 1, max: 30 }).trim(),
        check('uri', 'URI must be alphanumeric').isAlphanumeric().trim(),
        check('title', 'Board title must be between 1 and 40 characters').isLength({ min: 1, max: 40 }).trim(),

        // Sanitize
        sanitizeBody('uri').trim(),
        sanitizeBody('title').trim(),
      ];
    }
    default:
      return [];
  }
};
