const express = require("express");
const noteController = require("../controllers/note");
const noteValidator = require("../validators/note");

const router = express.Router();

router.post("/notes", noteValidator.createNote, noteController.createNote);
router.get("/notes", noteValidator.getNotes, noteController.getNotes);

router.delete("/notes/:noteId", noteValidator.deleteNote, noteController.deleteNote);
router.get("/notes/:noteId", noteValidator.getNote, noteController.getNote);
router.put("/notes/:noteId", noteValidator.editNote, noteController.editNote);

module.exports = router;
