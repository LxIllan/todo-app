const { PrismaClient } = require("@prisma/client");
const { createUniqueId, customPrismaErrors } = require("../helpers/index");
const { validationResult } = require("express-validator");
const { LENGTH_TASK_ID } = require("../config/constants");
const prisma = new PrismaClient();

/*
 * @desc    Create task.
 * @route   POST /task
 */
exports.createTask = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Validation errors. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }

    const id = createUniqueId(LENGTH_TASK_ID);
    let { task, noteId } = req.body;
    prisma.task.create({
        data: { id, task, noteId }
    }).then((task) => {
        logger.info(`Task has been created. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(200).json(task);
    })
    .catch((err) => {
        const msg = customPrismaErrors(err);
        logger.warn(
            `User could not be created "${msg}". Method: ${req.method}, URL: ${req.url}.`
        );
        return res.status(400).json({ error: `${msg}.` });
    });
}

/*
 * @desc    Edit task.
 * @route   PUT /tasks/:taskId
 */
exports.editTask = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Validation errors. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }
    
    const id = req.params.taskId;
    const data = req.body;
    prisma.task.update({
        where: {
            id
        },
        data
    }).then((task) => {
        logger.info(`Task has been updated. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(200).json(task);
    })
    .catch((err) => {
        const msg = customPrismaErrors(err);
        logger.warn(
            `Task could not be updated "${msg}". Method: ${req.method}, URL: ${req.url}.`
        );
        return res.status(400).json({ error: `${msg}.` });
    });
}

/*
 * @desc    Set completed task.
 * @route   PUT /task/completed/:taskId
 */
exports.setCompleted = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Validation errors. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }
    
    const id = req.params.taskId;
    
    prisma.task.update({
        where: {
            id
        },
        data: {
            completed: true
        }
    }).then((task) => {
        logger.info(`Task completed. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(200).json(task);
    })
    .catch((err) => {
        console.log(err)
        const msg = customPrismaErrors(err);
        logger.warn(
            `Task could not be completed "${msg}". Method: ${req.method}, URL: ${req.url}.`
        );
        return res.status(400).json({ error: `${msg}.` });
    });
}

/*
 * @desc    Set uncompleted task.
 * @route   PUT /task/uncompleted/:taskId
 */
exports.unsetCompleted = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Validation errors. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }
    
    const id = req.params.taskId;
    
    prisma.task.update({
        where: {
            id
        },
        data: {
            completed: false
        }
    }).then((task) => {
        logger.info(`Task uncompleted. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(200).json(task);
    })
    .catch((err) => {
        const msg = customPrismaErrors(err);
        logger.warn(
            `Task could not be uncompleted "${msg}". Method: ${req.method}, URL: ${req.url}.`
        );
        return res.status(400).json({ error: `${msg}.` });
    });
}

/*
 * @desc    Delete task by id.
 * @route   DELETE /task/:taskId
 */
exports.deleteTask = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Validation errors. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }
    
    const id = req.params.taskId;
    
    prisma.task.delete({
        where: {
            id
        }
    }).then((task) => {
        logger.info(`Task has been deleted. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(200).json(task);
    })
    .catch((err) => {
        const msg = customPrismaErrors(err);
        logger.warn(
            `Task could not be deleted "${msg}". Method: ${req.method}, URL: ${req.url}.`
        );
        return res.status(400).json({ error: `${msg}.` });
    });
}