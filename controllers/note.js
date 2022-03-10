const { PrismaClient } = require("@prisma/client");
const { createUniqueId, customPrismaErrors } = require("../helpers/index");
const { validationResult } = require("express-validator");
const { LENGTH_NOTE_ID } = require("../config/constants");

const prisma = new PrismaClient();

/*
 * @desc    Get notes by user.
 * @route   GET /notes
 */
exports.getNotes = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Validation errors. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }

    const userId = req.body.userId;

    prisma.note
        .findMany({
            where: {
                userId,
            },
            include: { tasks: true },
        })
        .then((notes) => {
            logger.info(`Get notes. Method: ${req.method}, URL: ${req.url}.`);
            return res.status(200).json(notes);
        })
        .catch((err) => {
            const msg = customPrismaErrors(err);
            logger.warn(
                `Note could not be fetched "${msg}". Method: ${req.method}, URL: ${req.url}.`
            );
            return res.status(400).json({ error: msg });
        });
};

/*
 * @desc    Create note.
 * @route   POST /notes
 */
exports.createNote = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Validation errors. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }
    const id = createUniqueId(LENGTH_NOTE_ID);
    let { note, userId } = req.body;
    prisma.note
        .create({
            data: { id, note, userId },
        })
        .then((note) => {
            logger.info(`Note has been created. Method: ${req.method}, URL: ${req.url}.`);
            return res.status(200).json(note);
        })
        .catch((err) => {
            const msg = customPrismaErrors(err);
            logger.warn(
                `Note could not be created "${msg}". Method: ${req.method}, URL: ${req.url}.`
            );
            return res.status(400).json({ error: `${msg}.` });
        });
};

/*
 * @desc    Get note by id.
 * @route   GET /notes/:noteId
 */
exports.getNote = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Validation errors. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }

    const id = req.params.noteId;
    prisma.note
        .findUnique({
            where: {
                id,
            },
            include: { tasks: true },
        })
        .then((note) => {
            if (note) {
                logger.info(`Get note. Method: ${req.method}, URL: ${req.url}.`);
                return res.status(200).json(note);
            }
            logger.warn(`Note not found. Method: ${req.method}, URL: ${req.url}.`);
            return res.status(404).json({ error: "Note not found." });
        })
        .catch((err) => {
            logger.warn(
                `Note could not be fetched "${err.message}". Method: ${req.method}, URL: ${req.url}.`
            );
            return res.status(400).json({ error: "Note could not be fetched." });
        });
};

/*
 * @desc    Edit note.
 * @route   PUT /notes/:noteId
 */
exports.editNote = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Validation errors. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }
    const id = req.params.noteId;

    const data = req.body;
    data.updatedAt = new Date();
    prisma.note
        .update({
            where: {
                id,
            },
            data,
        })
        .then((note) => {
            logger.info(`Note has been updated. Method: ${req.method}, URL: ${req.url}.`);
            return res.status(200).json(note);
        })
        .catch((err) => {
            const msg = customPrismaErrors(err);
            logger.warn(
                `Note could not be updated. "${msg}". Method: ${req.method}, URL: ${req.url}.`
            );
            return res.status(400).json({ error: "Note could not be updated." });
        });
};

/*
 * @desc    Delete note by id.
 * @route   DELETE /notes/:noteId
 */
exports.deleteNote = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Validation errors. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }

    const id = req.params.noteId;
    prisma.note
        .delete({
            where: {
                id,
            },
        })
        .then((note) => {
            logger.info(`Note has been deleted. Method: ${req.method}, URL: ${req.url}.`);
            return res.status(200).json(note);
        })
        .catch((err) => {
            const msg = customPrismaErrors(err);
            logger.warn(
                `Note could not be deleted "${msg}". Method: ${req.method}, URL: ${req.url}.`
            );
            return res.status(400).json({ error: "Note could not be deleted." });
        });
};
