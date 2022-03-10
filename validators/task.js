const { body, param } = require("express-validator");
const { LENGTH_NOTE_ID, LENGTH_TASK_ID } = require("../config/constants");

/*
 * @desc    Validate noteId.
 */
const validateNoteId = [
    body("noteId")
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("noteId must have only letters and numbers.")
        .isLength({ mix: LENGTH_NOTE_ID, max: LENGTH_NOTE_ID })
        .withMessage(`length noteId must be ${LENGTH_NOTE_ID}`),
];

/*
 * @desc    Validate taskId.
 */
const validateTaskId = [
    param("taskId")
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("taskId must have only letters and numbers.")
        .isLength({ mix: LENGTH_TASK_ID, max: LENGTH_TASK_ID })
        .withMessage(`length taskId must be ${LENGTH_TASK_ID}`),
];

/*
 * @desc    Validate task content.
 */
const validateTask = [body("task", "task is required.").notEmpty()];

/*
 * @desc    Create task.
 * @route   POST /task
 */
exports.createTask = [...validateNoteId, ...validateTask];

/*
 * @desc    Edit task.
 * @route   PUT /tasks/:taskId
 */
exports.editTask = [...validateTaskId, ...validateTask];

/*
 * @desc    Delete task by id.
 * @route   DELETE /task/:taskId
 */
exports.deleteTask = validateTaskId;

/*
 * @desc    Set completed task.
 * @route   PUT /task/completed/:taskId
 */
exports.completedTask = validateTaskId;

/*
 * @desc    Set uncompleted task.
 * @route   PUT /task/uncompleted/:taskId
 */
exports.uncompletedTask = validateTaskId;