import { Router } from "express";
import * as todoController from "../Controllers/post-controller";
import { body } from "express-validator";

const router = Router();
const todoValidator = body("task").trim().notEmpty();

router.get("/post", todoController.getAllTodos);
router.post("/post", todoController.addTodo);
router.patch("/:postId", todoController.updateTodo);
router.delete("/:postId", todoController.deleteTodo);

export default router;