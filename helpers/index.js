const crypto = require("crypto");
require('dotenv').config();

/*
 * @desc    Creates an unique id for users tasks and notes.
 * @param {Number} length The length of the unique id.
*/
exports.createUniqueId = (length) => {
    if (length < 5) {
        length = 5;
    }
    return Math.random().toString(36).slice(2).substring(0, length);
};

/*
 * @desc    Creates a token password reset.
*/
exports.createTokenPasswordReset = () => {
    return crypto.randomUUID();
};

/*
 * @desc    Encrypts password.
 * @param {String} password - Password to encrypt.
*/
exports.encryptPassword = (password) => {
    if (!password) return "";
    try {
        return crypto.createHmac('sha1', process.env.SALT_KEY)
            .update(password)
            .digest('hex')
    } catch (err) {
        return "";
    }
}

/*
 * @desc    Custom prisma errors.
 * @param {Object} error - Error object.
*/
exports.customPrismaErrors = (error) => {
    if (error.message.includes("but not found")) {
        return "not found.";
    } else if(error.message.includes("Unique constraint failed on the constrain")) {
        return `duplicated unique field '${error.meta.target}'`;
    } else {
        return "other prisma error.";
    }
}