const { validationResult } = require("express-validator");
const { createUniqueId, encryptPassword, customPrismaErrors } = require("../helpers/index");
const { PrismaClient } = require("@prisma/client");
const { LENGTH_USER_ID } = require("../config/constants");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const prisma = new PrismaClient();

/*
 * @desc    Sing up a new user.
 * @route   POST /signup
 */
exports.signUp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Validation errors. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }
    let { name, lastName, email, password } = req.body;
    const id = createUniqueId(LENGTH_USER_ID);
    email = email.toLowerCase();
    password = encryptPassword(password);

    prisma.user
        .create({
            data: {
                id,
                name,
                lastName,
                email,
                password,
            },
        })
        .then((user) => {
            logger.info(`User has been created. Method: ${req.method}, URL: ${req.url}.`);
            return res.status(200).json(user);
        })
        .catch((err) => {
            const msg = customPrismaErrors(err);
            logger.warn(
                `User could not be created "${msg}". Method: ${req.method}, URL: ${req.url}.`
            );
            return res.status(400).json({ error: `${msg}.` });
        });
};

/*
 * @desc    Sing in.
 * @route   POST /signin
 */
exports.signIn = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Validation errors. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }
        
    let {email, password } = req.body;
    email = email.toLowerCase();
    password = encryptPassword(password);

    prisma.user
        .findUnique({
            where: {
                email
            }            
        })
        .then((user) => {
            if (user) {
                if (user.password !== password) {
                    logger.warn(`Email and password do not match. Method: ${req.method}, URL: ${req.url}.`);
                    return res.status(401).json({ error: "Email and password do not match." });
                }
                user.password = undefined;
                user.updatedAt = undefined;
                
                const token = jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY);
                res.cookie("t", token, { expire: new Date() + 9999});

                logger.info(`User signed in. Method: ${req.method}, URL: ${req.url}.`);
                return res.status(200).json({token, user});
            }
            logger.warn(
                `User not found. Method: ${req.method}, URL: ${req.url}.`
            );
            return res.status(404).json({ error: "User not found." });
        })
        .catch((err) => {
            logger.warn(
                `User could not be fetched "${err.message}". Method: ${req.method}, URL: ${req.url}.`
            );
            return res.status(400).json({ error: "User could not be fetched." });
        });
};



/*
 * @desc    Get users.
 * @route   GET /users
 */
exports.getUsers = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Validation errors. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }

    prisma.user
        .findMany()
        .then((users) => {
            logger.info(`Get users. Method: ${req.method}, URL: ${req.url}.`);
            return res.status(200).json(users);
        })
        .catch((err) => {
            const msg = customPrismaErrors(err);
            logger.warn(
                `Users could not be fetched "${msg}". Method: ${req.method}, URL: ${req.url}.`
            );
            return res.status(400).json({ error: msg });
        });
};

/*
 * @desc    Get user.
 * @route   GET /users/:id
 */
exports.getUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Validation errors. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }

    const id = req.params.id;
    prisma.user
        .findUnique({
            where: {
                id,
            },
            select: {
                name: true,
                lastName: true,
                email: true,
                createdAt: true,
            },
        })
        .then((user) => {
            if (user) {
                logger.info(`Get user. Method: ${req.method}, URL: ${req.url}.`);
                return res.status(200).json(user);
            }
            logger.warn(
                `User not found. Method: ${req.method}, URL: ${req.url}.`
            );
            return res.status(404).json({ error: "User not found." });
        })
        .catch((err) => {
            logger.warn(
                `User could not be fetched "${err.message}". Method: ${req.method}, URL: ${req.url}.`
            );
            return res.status(400).json({ error: "User could not be fetched." });
        });
};

/*
 * @desc    Update user.
 * @route   PUT /users/:id
 */
exports.updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Validation errors. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }
    const id = req.params.id;
    
    const data = req.body;
    data.updatedAt = new Date();
    if (data.password) {
        data.password = encryptPassword(data.password);
    }
    prisma.user
        .update({
            where: {
                id,
            },
            data,
        })
        .then((user) => {
            logger.info(`User has been updated. Method: ${req.method}, URL: ${req.url}.`);
            return res.status(200).json(user);
        })
        .catch((err) => {
            const msg = customPrismaErrors(err);
            logger.warn(
                `User could not be updated. "${msg}". Method: ${req.method}, URL: ${req.url}.`
            );
            return res.status(400).json({ error: "User could not be updated." });
        });
};

/*
 * @desc    Delete user.
 * @route   DELETE /users/:id
 */
exports.deleteUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Validation errors. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }

    const id = req.params.id;
    prisma.user.delete({
            where: {
                id,
            }
        })
        .then((user) => {
            logger.info(`User has been deleted. Method: ${req.method}, URL: ${req.url}.`);
            return res.status(200).json(user);
        })
        .catch((err) => {
            const msg = customPrismaErrors(err);
            logger.warn(
                `User could not be deleted "${msg}". Method: ${req.method}, URL: ${req.url}.`
            );
            return res.status(400).json({ error: "User could not be deleted." });
        });
};
