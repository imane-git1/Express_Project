import { body } from 'express-validator';

const registerValidator = [
  body('name')
  .isString()
  .notEmpty({ 
    ignore_whitespace: true 
  })
  .withMessage('Name is required')
  .isLength({ min: 3 })
  .withMessage('Name must be at least 3 characters long')
  .trim(),
  body('email')
  .notEmpty({ 
    ignore_whitespace: true 
  })
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Invalid email address')
  .normalizeEmail(),
  body('password')
  .isString()
  .notEmpty({ 
    ignore_whitespace: true 
  })
  .withMessage('Password is required')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .trim(),
  body('role')
  .isString()
  .notEmpty({ 
    ignore_whitespace: true 
  })
  .withMessage('Role is required')
  .isIn(['admin', 'user'])
  .withMessage('Role must be either admin or user')
  .trim(),
];

const loginValidator = [
  body('email')
  .notEmpty({ 
    ignore_whitespace: true 
  })
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Invalid email address')
  .normalizeEmail(),
  body('password')
  .isString()
  .notEmpty({ 
    ignore_whitespace: true 
  })
  .withMessage('Password is required')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .trim(),
];

const updateProfileValidator = [
  body('name')
  .isString()
  .notEmpty({ 
    ignore_whitespace: true 
  })
  .withMessage('Name is required')
  .isLength({ min: 3 })
  .withMessage('Name must be at least 3 characters long')
  .trim(),
  body('email')
  .notEmpty({ 
    ignore_whitespace: true 
  })
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Invalid email address')
  .normalizeEmail(),
  body('password')
  .isString()
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .trim(),
];

export { registerValidator, loginValidator, updateProfileValidator };

