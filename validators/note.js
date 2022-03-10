const { body, param } = require("express-validator");
const { LENGTH_USER_ID, LENGTH_NOTE_ID } = require("../config/constants");

/*
 * @desc    Validate noteId.
 */
const validateNoteId = [
    param("noteId")
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("noteId must have only letters and numbers.")
        .isLength({ mix: LENGTH_NOTE_ID, max: LENGTH_NOTE_ID })
        .withMessage(`length noteId must be ${LENGTH_NOTE_ID}`),
];

/*
 * @desc    Validate userId.
 */
const validateUserId = [
    body("userId")
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("userId must have only letters and numbers.")
        .isLength({ mix: LENGTH_USER_ID, max: LENGTH_USER_ID })
        .withMessage(`length userId must be ${LENGTH_USER_ID}`),
];

/*
 * @desc    Validate note name.
 */
const validateNoteName = [body("note", "note is required.").notEmpty()];

/*
 * @desc    Get notes by user.
 * @route   GET /notes
 */
exports.getNotes = validateUserId;

/*
 * @desc    Get note by id.
 * @route   GET /notes/:noteId
 */
exports.getNote = validateNoteId;

/*
 * @desc    Create note.
 * @route   POST /notes
 */
exports.createNote = [...validateUserId, ...validateNoteName];

/*
 * @desc    Edit note.
 * @route   PUT /notes/:noteId
 */
exports.editNote = [...validateNoteId, ...validateNoteName];

/*
 * @desc    Delete note by id.
 * @route   DELETE /notes/:noteId
 */
exports.deleteNote = validateNoteId;
