const { body, param } = require("express-validator");

/*
 * @route   POST /signup
*/
exports.signUp = [
    body("name", "name is required.").notEmpty(),
    body("lastName", "last_name is required.").notEmpty(),
    body("email", "email must be a valid email.").isEmail().toLowerCase(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("password must be at least 5 chars long.")
        .matches(/\d/)
        .withMessage("password must contain a number.")
];

/*
 * @route   POST /signin
*/
exports.signIn = [
    body("email", "email must be a valid email.").isEmail().toLowerCase(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("password must be at least 5 chars long.")
        .matches(/\d/)
        .withMessage("password must contain a number.")
];

/*
 * @route   GET /user/:id
*/
exports.validateId = [
    param('id', 'id must have only letters and numbers.').matches(/^[a-zA-Z0-9]+$/)
];

/*
 * @route   PUT /user/:id
*/
exports.updateUser = [
    ...this.validateId,
    body("name", "name is required.").notEmpty().optional({ nullable: true }),
    body("lastName", "last_name is required.").notEmpty().optional({ nullable: true }),
    body("email", "email must be a valid email.").isEmail().toLowerCase().optional({ nullable: true })
];