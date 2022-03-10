const { body, param } = require("express-validator");
const { LENGTH_USER_ID } = require("../config/constants");

/*
 * @desc    Sing up a new user.
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
 * @desc    Sing in.
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
 * @desc    Get user.
 * @route   GET /users/:id
 */
exports.validateId = [
    param("id").matches(/^[a-zA-Z0-9]+$/)
    .withMessage("userId must have only letters and numbers.")
    .isLength({ mix: LENGTH_USER_ID, max: LENGTH_USER_ID })
    .withMessage(`length userId must be ${LENGTH_USER_ID}`),
];

/*
 * @desc    Update user.
 * @route   PUT /users/:id
 */
exports.updateUser = [
    ...this.validateId,
    body("name", "name is required.").notEmpty().optional({ nullable: true }),
    body("lastName", "last_name is required.").notEmpty().optional({ nullable: true }),
    body("email", "email must be a valid email.").isEmail().toLowerCase().optional({ nullable: true })
];