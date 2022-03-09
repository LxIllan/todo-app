const express = require("express");

const userController = require("../controllers/user");
const userValidator = require("../validators/user");

const router = express.Router();

router.post("/signup", userValidator.signUp, userController.signUp);
router.post("/signin", userValidator.signIn, userController.signIn);

router.get("/users", userController.getUsers);
router.get("/users/:id", userValidator.validateId, userController.getUser);
router.put("/users/:id", userValidator.updateUser, userController.updateUser);
router.delete("/users/:id", userValidator.updateUser, userController.deleteUser);
module.exports = router;