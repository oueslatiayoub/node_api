import { Router } from "express";
import * as todoController from "../Controllers/blog-controller";
import { body } from "express-validator";

const router = Router();
const todoValidator = body("task").trim().notEmpty();

router.get("/get", todoController.getAllTodos);
router.post("/add", todoController.addTodo);
router.patch("/:todoId", todoValidator, todoController.updateTodo);
router.delete("/:todoId", todoController.deleteTodo);

export default router;
